<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Login | MyCaffee</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
        @theme {
            --color-cream: #F5F1ED;
            --color-brown-light: #C4A574;
            --color-brown: #8B6B47;
            --color-brown-dark: #5C4033;
        }
    </style>
</head>
<body style="background: linear-gradient(135deg, #5C4033 0%, #8B6B47 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center;">

    <div class="max-w-md w-full mx-4">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
            <!-- Logo -->
            <div class="text-center mb-8">
                <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4" style="background-color: #5C4033; color: #F5F1ED">
                    <span class="text-4xl font-bold">J</span>
                </div>
                <h1 class="text-3xl font-serif font-bold text-gray-800 mb-2">Jagongan Coffee</h1>
                <p class="text-gray-600">Point of Sale System</p>
            </div>

            {{-- Error dan pesan sukses --}}
            @if ($errors->any())
                <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                    <p class="text-red-700 text-sm">{{ $errors->first() }}</p>
                </div>
            @endif

            @if (session('success'))
                <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                    <p class="text-green-700 text-sm">{{ session('success') }}</p>
                </div>
            @endif

            <form action="{{ route('login.post') }}" method="POST" class="space-y-6">
                @csrf
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input type="text" name="username" value="{{ old('username') }}" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent transition"
                           placeholder="Masukkan username" autofocus>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" name="password" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent transition"
                           placeholder="Masukkan password">
                </div>

                <button type="submit" 
                        class="w-full py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                        style="background-color: #5C4033">
                    Login
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    Demo: admin/admin atau kasir/kasir
                </p>
            </div>
        </div>

        <div class="text-center mt-6 text-white text-sm">
            <p>&copy; {{ date('Y') }} Jagongan Coffee. All rights reserved.</p>
        </div>
    </div>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3 {
            font-family: 'Playfair Display', serif;
        }
    </style>
</body>
</html>