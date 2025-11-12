<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Http\Resources\MenuResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    /**
     * index
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // ambil semua data menu, urut terbaru
        $menu = Menu::latest()->paginate(5);

        // kembalikan sebagai resource
        return new MenuResource(true, 'List Data Menu', $menu);
    }

    /**
     * store
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // validasi input
        $validator = Validator::make($request->all(), [
            'gambar'     => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'nama_menu'  => 'required|string|max:255',
            'deskripsi'  => 'nullable|string',
            'harga'      => 'required|numeric',
            'stok'       => 'required|integer|min:0',
            'kategori'   => 'required|in:Snack,Makanan,Kopi',
        ]);

        // jika validasi gagal
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // upload gambar
        $image = $request->file('gambar');
        $image->storeAs('menu', $image->hashName());

        // buat data menu
        $menu = Menu::create([
            'nama_menu' => $request->nama_menu,
            'deskripsi' => $request->deskripsi,
            'harga'     => $request->harga,
            'stok'      => $request->stok,
            'kategori'  => $request->kategori,
            'gambar'    => $image->hashName(),
        ]);

        return new MenuResource(true, 'Data Menu Berhasil Ditambahkan!', $menu);
    }

    /**
     * show
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Data Menu Tidak Ditemukan!',
            ], 404);
        }

        return new MenuResource(true, 'Detail Data Menu!', $menu);
    }

    /**
     * update
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // validasi input
        $validator = Validator::make($request->all(), [
            'gambar'     => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'nama_menu'  => 'required|string|max:255',
            'deskripsi'  => 'nullable|string',
            'harga'      => 'required|numeric',
            'stok'       => 'required|integer|min:0',
            'kategori'   => 'required|in:Snack,Makanan,Kopi',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Data Menu Tidak Ditemukan!',
            ], 404);
        }

        // jika upload gambar baru
        if ($request->hasFile('gambar')) {
            Storage::delete('menu/' . basename($menu->gambar));

            $image = $request->file('gambar');
            $image->storeAs('menu', $image->hashName());

            $menu->update([
                'gambar'    => $image->hashName(),
                'nama_menu' => $request->nama_menu,
                'deskripsi' => $request->deskripsi,
                'harga'     => $request->harga,
                'stok'      => $request->stok,
                'kategori'  => $request->kategori,
            ]);
        } else {
            // update tanpa ubah gambar
            $menu->update([
                'nama_menu' => $request->nama_menu,
                'deskripsi' => $request->deskripsi,
                'harga'     => $request->harga,
                'stok'      => $request->stok,
                'kategori'  => $request->kategori,
            ]);
        }

        return new MenuResource(true, 'Data Menu Berhasil Diubah!', $menu);
    }

    /**
     * destroy
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'success' => false,
                'message' => 'Data Menu Tidak Ditemukan!',
            ], 404);
        }

        // hapus gambar dari storage
        Storage::delete('menu/' . basename($menu->gambar));

        // hapus record dari database
        $menu->delete();

        return new MenuResource(true, 'Data Menu Berhasil Dihapus!', null);
    }
}