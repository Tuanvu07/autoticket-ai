import { Package, Truck, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Vận Tải Hàng Hóa | Trường Thịnh",
  description: "Dịch vụ vận tải hàng hóa chuyên nghiệp, an toàn, nhanh chóng.",
};

export default function GoodsServicePage() {
  return (
    <div className="pt-[72px] min-h-screen bg-brand-bg pb-20">
      <section className="relative bg-brand-red-dark py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-red-dark opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c663c0?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm border border-white/20">
            <Package className="w-4 h-4" /> Dịch Vụ Vận Tải
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Vận Tải Hàng Hóa <br className="hidden sm:block" /> Nhanh Chóng & An Toàn
          </h1>
          <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto font-light leading-relaxed">
            Giải pháp vận chuyển hàng hóa tối ưu, tiết kiệm chi phí, giao nhận tận nơi với hệ thống quản lý hiện đại.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { icon: Truck, title: "Đa Dạng Gói Dịch Vụ", desc: "Cung cấp nhiều gói vận chuyển linh hoạt: hỏa tốc, tiêu chuẩn, tiết kiệm phù hợp với mọi nhu cầu." },
            { icon: ShieldCheck, title: "Đảm Bảo An Toàn", desc: "Cam kết bồi thường 100% giá trị hàng hóa nếu xảy ra mất mát, hư hỏng trong quá trình vận chuyển." },
            { icon: Package, title: "Đóng Gói Chuyên Nghiệp", desc: "Hỗ trợ đóng gói đúng quy chuẩn, bảo vệ hàng hóa tối đa, đặc biệt là hàng dễ vỡ, giá trị cao." },
          ].map((val, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up border border-brand-border/50" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform group-hover:bg-gradient-to-br from-brand-red to-brand-red-dark group-hover:shadow-[0_8px_32px_rgba(198,40,40,0.2)]">
                <val.icon className="w-8 h-8 text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-3">{val.title}</h3>
              <p className="text-brand-muted leading-relaxed text-[15px]">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="quy-dinh" className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-white rounded-3xl p-8 shadow-card border border-brand-border/50 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text">Quy Định Về Vận Chuyển & Đóng Gói</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-brand-text mb-4 text-brand-blue">1. Hàng Hóa Nhận Vận Chuyển</h3>
              <ul className="space-y-3">
                {[
                  "Hàng hóa tiêu dùng, máy móc, thiết bị.",
                  "Hàng thực phẩm khô, nông sản.",
                  "Hàng hóa cồng kềnh, siêu trường siêu trọng (cần liên hệ trước).",
                  "Các loại thư từ, bưu phẩm, hồ sơ chứng từ."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-text mb-4 text-brand-red">2. Hàng Hóa Từ Chối Vận Chuyển</h3>
              <ul className="space-y-3">
                {[
                  "Hàng quốc cấm, vũ khí, chất nổ, chất dễ cháy.",
                  "Hàng hóa có nguồn gốc không rõ ràng, hàng lậu.",
                  "Động vật sống (trừ trường hợp có thỏa thuận riêng).",
                  "Các loại tiền, kim khí quý, đá quý."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center mt-12 animate-fade-in-up">
        <a href="https://trackingtruongthinh.smartpost.vn" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-xl font-bold shadow-cta hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
          Tra cứu đơn hàng online
          <Truck className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
