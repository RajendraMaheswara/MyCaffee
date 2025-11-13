<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserResourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(5);
        return new UserResourse(true, 'List Data User', $users);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username'      => 'required|string|max:50|unique:users',
            'password'      => 'required|string|min:4',
            'nama_lengkap'  => 'nullable|string|max:100',
            'peran'         => 'required|in:admin,kasir',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'peran' => $request->peran,
        ]);

        return new UserResourse(true, 'Data User Berhasil Ditambahkan!', $user);
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Data User Tidak Ditemukan!'], 404);
        }

        return new UserResourse(true, 'Detail Data User!', $user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Data User Tidak Ditemukan!'], 404);
        }

        $validator = Validator::make($request->all(), [
            'username'      => 'required|string|max:50|unique:users,username,' . $user->id,
            'password'      => 'nullable|string|min:4',
            'nama_lengkap'  => 'nullable|string|max:100',
            'peran'         => 'required|in:admin,kasir',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->update([
            'username' => $request->username,
            'password' => $request->filled('password') ? Hash::make($request->password) : $user->password,
            'nama_lengkap' => $request->nama_lengkap,
            'peran' => $request->peran,
        ]);

        return new UserResourse(true, 'Data User Berhasil Diubah!', $user);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Data User Tidak Ditemukan!'], 404);
        }

        $user->delete();
        return new UserResourse(true, 'Data User Berhasil Dihapus!', null);
    }
}