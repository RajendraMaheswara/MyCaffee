<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Kasir</title>
</head>
<body>
    <h2>Selamat datang di Dashboard Kasir</h2>
    <p>Halo, {{ auth()->user()->nama_lengkap }} ({{ auth()->user()->peran }})</p>

    <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit">Logout</button>
    </form>
</body>
</html>