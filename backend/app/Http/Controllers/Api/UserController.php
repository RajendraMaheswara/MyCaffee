<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'List Data User',
            'data' => $users
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username'     => 'required|string|max:50|unique:users',
            'email'        => 'required|string|email|unique:users,email',
            'password'     => 'required|string|min:4',
            'nama_lengkap' => 'nullable|string|max:100',
            'peran'        => 'required|in:admin,kasir,user',
            'total_stamp'  => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'username'     => $request->username,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'peran'        => $request->peran,
            'total_stamp'  => $request->total_stamp ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan!',
            'data' => $user
        ], 201);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail user',
            'data' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'username'     => 'required|string|max:50|unique:users,username,' . $user->id,
            'email'        => 'required|string|email|unique:users,email,' . $user->id,
            'password'     => 'nullable|string|min:4',
            'nama_lengkap' => 'nullable|string|max:100',
            'peran'        => 'required|in:admin,kasir,user',
            'total_stamp'  => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->update([
            'username'     => $request->username,
            'email'        => $request->email,
            'nama_lengkap' => $request->nama_lengkap,
            'peran'        => $request->peran,
            'total_stamp'  => $request->total_stamp ?? $user->total_stamp,
            'password'     => $request->filled('password')
                                ? Hash::make($request->password)
                                : $user->password,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diupdate!',
            'data' => $user
        ]);
    }
    
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus'
        ]);
    }
}