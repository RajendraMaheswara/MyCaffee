<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #5C4033 0%, #8B6B47 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .otp-box {
            background-color: #f8f8f8;
            border: 2px dashed #5C4033;
            border-radius: 10px;
            padding: 20px;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #5C4033;
            letter-spacing: 8px;
            margin: 10px 0;
        }
        .footer {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .warning {
            color: #dc3545;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍵 Jagongan Coffee</h1>
            <p style="margin: 5px 0 0 0;">
                @if($type === 'reset_password')
                    Reset Password
                @else
                    Verifikasi Email Anda
                @endif
            </p>
        </div>
        
        <div class="content">
            <h2 style="color: #333;">Kode Verifikasi OTP</h2>
            <p style="color: #666; font-size: 16px;">
                @if($type === 'reset_password')
                    Anda telah meminta untuk mereset password akun Jagongan Coffee Anda.
                    Gunakan kode OTP berikut untuk melanjutkan proses reset password:
                @else
                    Terima kasih telah mendaftar di Jagongan Coffee POS System. 
                    Gunakan kode OTP berikut untuk menyelesaikan registrasi Anda:
                @endif
            </p>
            
            <div class="otp-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Kode OTP Anda</p>
                <div class="otp-code">{{ $otp }}</div>
                <p style="margin: 0; color: #666; font-size: 12px;">Kode berlaku selama 10 menit</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                @if($type === 'reset_password')
                    Masukkan kode ini pada halaman reset password untuk melanjutkan.
                @else
                    Masukkan kode ini pada halaman registrasi untuk melanjutkan.
                @endif
            </p>
            
            <div class="warning">
                ⚠️ Jangan bagikan kode ini kepada siapapun!
                @if($type === 'reset_password')
                    <br>Jika Anda tidak meminta reset password, abaikan email ini.
                @endif
            </div>
        </div>
        
        <div class="footer">
            <p>Email ini dikirim otomatis, mohon tidak membalas email ini.</p>
            <p>&copy; 2025 Jagongan Coffee. All rights reserved.</p>
        </div>
    </div>
</body>
</html>