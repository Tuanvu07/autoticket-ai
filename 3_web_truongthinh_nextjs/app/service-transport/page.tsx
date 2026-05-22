import { Bus, Clock, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Vận Chuyển Hành Khách | Trường Thịnh",
  description: "Dịch vụ vận chuyển hành khách chất lượng cao, các tuyến xe và giá vé.",
};

export default function TransportServicePage() {
  return (
    <div className="pt-[72px] min-h-screen bg-brand-bg pb-20">
      {/* Hero Section */}
      <section className="relative bg-brand-blue-dark py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-blue-dark opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm border border-white/20">
            <Bus className="w-4 h-4" /> Dịch Vụ Cốt Lõi
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Vận Chuyển Hành Khách <br className="hidden sm:block" /> Tiện Nghi & An Toàn
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            Hệ thống xe giường nằm cao cấp, đội ngũ tài xế chuyên nghiệp, mang đến cho bạn những chuyến đi thoải mái nhất.
          </p>
        </div>
      </section>

      {/* Routes & Pricing */}
      <section id="tuyen-chay" className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 animate-fade-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text mb-2">Tuyến Chạy & Giá Vé</h2>
            <div className="w-16 h-1 bg-brand-blue rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { from: "Quy Nhơn", to: "TP. Hồ Chí Minh", price: "350.000đ", time: "12h00 - 14h00", type: "Limousine 22 phòng" },
            { from: "Quy Nhơn", to: "Đà Nẵng", price: "200.000đ", time: "6h00 - 8h00", type: "Giường nằm 34 chỗ" },
            { from: "Quy Nhơn", to: "Nha Trang", price: "250.000đ", time: "8h00 - 10h00", type: "Giường nằm 34 chỗ" },
          ].map((route, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-brand-border/50 group">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-brand-blue font-bold text-lg">
                  <MapPin className="w-5 h-5 text-brand-red" />
                  {route.from}
                </div>
                <div className="w-8 h-[2px] bg-gray-300 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-gray-300 rotate-45"></div>
                </div>
                <div className="flex items-center gap-2 text-brand-blue font-bold text-lg">
                  {route.to}
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4 text-brand-gold" />
                  Thời gian: {route.time}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Bus className="w-4 h-4 text-brand-gold" />
                  Loại xe: {route.type}
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Giá vé từ</p>
                  <p className="text-xl font-bold text-brand-red">{route.price}</p>
                </div>
                <Link href="/#tuyen-duong" className="bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                  Đặt vé ngay
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules and Policies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rules */}
        <div id="quy_dinh" className="bg-white rounded-3xl p-8 shadow-card border border-brand-border/50 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-brand-blue" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text">Quy Định Khi Đi Xe</h2>
          </div>
          <ul className="space-y-4">
            {[
              "Có mặt tại bến hoặc điểm đón trước 30 phút.",
              "Mang theo giấy tờ tùy thân (CCCD/CMND).",
              "Mỗi hành khách được mang tối đa 20kg hành lý.",
              "Không mang theo hàng hóa cấm, dễ cháy nổ.",
              "Giữ gìn vệ sinh chung trên xe."
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 flex-shrink-0"></span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Refund Policy */}
        <div id="doi-tra" className="bg-white rounded-3xl p-8 shadow-card border border-brand-border/50 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-brand-red" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text">Chính Sách Đổi Trả Vé</h2>
          </div>
          <ul className="space-y-4">
            {[
              "Hủy vé trước 24h: Hoàn tiền 100%.",
              "Hủy vé từ 12h - 24h: Phí hủy 10%.",
              "Hủy vé dưới 12h: Không hoàn tiền.",
              "Hỗ trợ đổi chuyến miễn phí 1 lần (báo trước 6h).",
              "Tiền hoàn sẽ được chuyển trong 1-3 ngày làm việc."
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-2 flex-shrink-0"></span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
