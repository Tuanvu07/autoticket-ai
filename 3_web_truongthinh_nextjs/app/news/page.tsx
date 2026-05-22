import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";

export const metadata = {
  title: "Tin Tức & Sự Kiện | Trường Thịnh",
  description: "Cập nhật tin tức mới nhất về du lịch, xã hội và Trường Thịnh.",
};

const NEWS_CATEGORIES = [
  { title: "Địa điểm du lịch", slug: "dia-diem-du-lich", desc: "Khám phá những điểm đến hấp dẫn trên mọi miền đất nước cùng Trường Thịnh.", img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80" },
  { title: "Tin tức xã hội", slug: "tin-tuc-xa-hoi", desc: "Cập nhật các thông tin đời sống, sự kiện xã hội nhanh chóng và chính xác.", img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80" },
  { title: "Thông báo từ Trường Thịnh", slug: "thong-bao", desc: "Các thông báo chính thức, lịch trình lễ tết, ưu đãi và dịch vụ mới.", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80" },
  { title: "Tuyển dụng", slug: "tuyen-dung", desc: "Tham gia đội ngũ Trường Thịnh với nhiều cơ hội phát triển và đãi ngộ tốt.", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" },
];

export default function NewsPage() {
  return (
    <div className="pt-[72px] min-h-screen bg-brand-bg pb-24">
      {/* Hero Header */}
      <div className="bg-white py-16 border-b border-brand-border relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-up relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6 shadow-sm">
            <Newspaper className="w-8 h-8 text-brand-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-4 tracking-tight">Tin Tức & Sự Kiện</h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            Không chỉ là vận chuyển, chúng tôi đồng hành cùng bạn trên mọi hành trình khám phá và cập nhật thông tin.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {NEWS_CATEGORIES.map((cat, i) => (
          <Link href={`/news/${cat.slug}`} key={i} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up flex flex-col border border-brand-border/50" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-200 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${cat.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5 text-white font-bold text-xl leading-tight drop-shadow-md">
                {cat.title}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 bg-white">
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                {cat.desc}
              </p>
              <div className="flex items-center gap-2 text-brand-blue font-semibold text-sm group-hover:text-brand-red transition-colors mt-auto">
                Xem chuyên mục 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
