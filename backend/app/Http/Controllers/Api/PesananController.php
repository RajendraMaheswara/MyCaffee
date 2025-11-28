<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Menu;
use App\Models\Pesanan;
use App\Models\DetailPesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Controllers\Api\StampController;
use Carbon\Carbon;

class PesananController extends Controller
{
    protected $stampController;

    public function __construct(StampController $stampController)
    {
        $this->stampController = $stampController;
    }

    // GET /pesanan
    public function index()
    {
        $pesanan = Pesanan::with(['kasir', 'user', 'detailPesanan.menu'])
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'List Data Pesanan',
            'data'    => $pesanan
        ]);
    }

    // POST /pesanan
    public function store(Request $request)
    {
        // Validasi input pesanan
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'menu_id' => 'required|exists:menu,id',
            'jumlah' => 'required|integer|min:1',
            'total_harga' => 'required|numeric',
            'status_pesanan' => 'required|string',
            'status_pembayaran' => 'required|string',
            'nomor_meja' => 'required|integer',
        ]);

        // Buat pesanan
        $pesanan = Pesanan::create([
            'user_id' => $validated['user_id'],
            'total_harga' => $validated['total_harga'],
            'status_pesanan' => $validated['status_pesanan'],
            'status_pembayaran' => $validated['status_pembayaran'],
            'nomor_meja' => $validated['nomor_meja'],
        ]);

        // Hitung jumlah stamp berdasarkan harga total dan kategori 'Kopi'
        $totalKopiHarga = 0;
        $stampCount = 0;
        foreach ($pesanan->detailPesanan as $item) {
            $menu = $item->menu;
            if ($menu->kategori == 'Kopi') {
                $totalKopiHarga += $item->harga_satuan * $item->jumlah;
            }
        }

        // Jika total harga kopi >= 15k, berikan stamp sesuai kelipatan
        if ($totalKopiHarga >= 15000) {
            $stampCount = floor($totalKopiHarga / 15000);
        }

        // Perbarui jumlah_stamp di pesanan
        $pesanan->jumlah_stamp = $stampCount;
        $pesanan->save(); // Pastikan menyimpan perubahan jumlah_stamp di pesanan

        // Tambahkan detail pesanan (misalnya, item menu yang dipesan)
        $detailPesanan = new DetailPesanan();
        $detailPesanan->pesanan_id = $pesanan->id;
        $detailPesanan->menu_id = $validated['menu_id'];
        $detailPesanan->jumlah = $validated['jumlah'];
        $detailPesanan->harga_satuan = $validated['total_harga'] / $validated['jumlah'];  // Misalnya harga per item
        $detailPesanan->save();

        return response()->json([
            'message' => 'Pesanan berhasil dibuat',
            'pesanan' => $pesanan,
            'detail_pesanan' => $detailPesanan,
        ], 201);
    }

    // GET /pesanan/{id}
    public function show($id)
    {
        $pesanan = Pesanan::with(['kasir', 'user', 'detailPesanan.menu'])->find($id);

        if (!$pesanan) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail pesanan',
            'data'    => $pesanan
        ]);
    }

    // PUT /pesanan/{id}
    public function update(Request $request, $id)
    {
        $pesanan = Pesanan::with('detailPesanan')->find($id);

        if (!$pesanan) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nomor_meja'        => 'required|integer',
            'total_harga'       => 'required|numeric|min:0',
            'status_pesanan'    => 'required|in:diproses,diantar',
            'status_pembayaran' => 'required|in:belum_dibayar,lunas',
            'catatan'           => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $oldStatus = $pesanan->status_pembayaran;

        // Update data pesanan
        $pesanan->update($request->all());

        // === LOGIC STAMP ===

        // Jika pembayaran baru berubah menjadi "lunas"
        if ($oldStatus !== 'lunas' && $request->status_pembayaran === 'lunas') {
            // Cek jika pelanggan memiliki cukup stempel
            if ($pesanan->user && $pesanan->user->total_stamp >= 10) {
                // Potong 10 stempel dari akun pelanggan
                $pesanan->user->decrement('total_stamp', 10);
                
                // Terapkan kopi gratis (maks 20k)
                $pesanan->total_harga -= 20000;  // Sesuaikan dengan harga kopi gratis maksimal
                $pesanan->save();
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Stempel tidak cukup untuk menukarkan kopi gratis.'
                ], 400);
            }
        }

        // Jika pembayaran dibatalkan (revert lunas → belum_dibayar)
        if ($oldStatus === 'lunas' && $request->status_pembayaran === 'belum_dibayar') {
            if ($pesanan->user_id && $pesanan->jumlah_stamp > 0) {
                $pesanan->user->decrement('total_stamp', $pesanan->jumlah_stamp);
            }
            $pesanan->jumlah_stamp = 0;
            $pesanan->save();
        }

        // --- Menambahkan User berdasarkan No. Telp atau Email ---
        if ($request->has('user_identitas')) {
            $user = User::where('email', $request->user_identitas)
                    ->orWhere('no_telp', $request->user_identitas)
                    ->first();
            
            if ($user) {
                $pesanan->user_id = $user->id;
            } else {
                $pesanan->user_id = null; // Jika tidak ada, set null
            }
        }

        // Menyimpan perubahan
        $pesanan->save();

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil diupdate!',
            'data'    => $pesanan
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $pesanan = Pesanan::findOrFail($id);

        // Pastikan hanya kasir atau admin yang bisa mengubah status
        if (!in_array($request->user()->role, ['kasir', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Cek jika status pembayaran diubah menjadi 'lunas'
        if ($request->has('status_pembayaran') && $request->status_pembayaran == 'lunas' && $pesanan->status_pembayaran != 'lunas') {
            $pesanan->tanggal_pembayaran = Carbon::now();
            $pesanan->kasir_id = $request->user()->id;  // Mengisi kasir_id saat status pembayaran 'lunas'
        }

        // Update status pesanan dan pembayaran
        if ($request->has('status_pesanan')) {
            $pesanan->status_pesanan = $request->status_pesanan;
        }
        if ($request->has('status_pembayaran')) {
            $pesanan->status_pembayaran = $request->status_pembayaran;
        }

        $pesanan->save();

        // Jika status pembayaran 'lunas' dan harga total mencapoi kelipatan 15k, beri stamp
        if ($pesanan->status_pembayaran == 'lunas') {
            $this->stampController->giveStamps($pesanan); // Call giveStamps through dependency injection
        }

        return response()->json(['message' => 'Status pesanan berhasil diperbarui']);
    }


    public function addMenuToPesanan(Request $request, $id)
    {
        $pesanan = Pesanan::findOrFail($id);

        // Pastikan pesanan masih dalam status 'diproses' sebelum menambah menu
        if ($pesanan->status_pesanan !== 'diproses') {
            return response()->json(['message' => 'Pesanan tidak dapat diubah lagi'], 400);
        }

        // Validasi menu
        $menu = Menu::findOrFail($request->menu_id);

        // Tambahkan detail menu ke pesanan
        $detailPesanan = new DetailPesanan();
        $detailPesanan->pesanan_id = $pesanan->id;
        $detailPesanan->menu_id = $menu->id;
        $detailPesanan->jumlah = $request->jumlah;
        $detailPesanan->harga_satuan = $menu->harga;
        $detailPesanan->save();

        // Update total harga pesanan
        $pesanan->total_harga += $menu->harga * $request->jumlah;
        $pesanan->save();

        return response()->json(['message' => 'Menu berhasil ditambahkan ke pesanan']);
    }


    // DELETE /pesanan/{id}
    public function destroy($id)
    {
        $pesanan = Pesanan::find($id);

        if (!$pesanan) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan tidak ditemukan'
            ], 404);
        }

        $pesanan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dihapus'
        ]);
    }
}