import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5C4033] to-[#8B6B47] px-4">
      <div className="max-w-lg w-full text-center">
        
        {/* Coffee Cup Icon */}
        <div className="mb-8">
          <div className="inline-block relative">
            {/* Steam */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-1 h-6 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0s" }}></div>
              <div className="w-1 h-8 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1 h-6 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            
            {/* Coffee Cup */}
            <div className="w-32 h-32 rounded-full mx-auto flex items-center justify-center" 
                 style={{ backgroundColor: "#F5F1ED" }}>
              <svg className="w-20 h-20" fill="#5C4033" viewBox="0 0 24 24">
                <path d="M2 21h18v-2H2v2zm2-10h12V9H4v2zm14.5-6.5C18.5 2.5 17 2 17 2H3s1.5.5 1.5 2.5S3 7 3 7l1 6c0 1.5 2 3 5 3s5-1.5 5-3l1-6s-1.5-.5-1.5-2.5zm4.5 6c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1s1 .45 1 1v2.5c0 .55-.45 1-1 1z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-10">
          <h1 className="text-8xl font-serif font-bold mb-4" style={{ color: "#5C4033" }}>
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Ups! Halaman Tidak Ditemukan
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sepertinya kopi yang Anda cari belum tersedia di menu kami. 
            <br />
            Mari kembali dan nikmati menu lainnya! ☕
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 inline-block"
              style={{ backgroundColor: "#5C4033" }}
            >
              Kembali ke Beranda
            </Link>
            
            <Link 
              to="/login" 
              className="px-6 py-3 rounded-lg font-semibold border-2 transition hover:bg-gray-50 inline-block"
              style={{ 
                borderColor: "#5C4033",
                color: "#5C4033"
              }}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p className="text-white/80 text-sm">
            "Jangan khawatir, masih banyak kopi lain yang bisa dinikmati!"
          </p>
        </div>

        <div className="text-center mt-6 text-white text-sm">
          <p>&copy; 2025 Jagongan Coffee. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}