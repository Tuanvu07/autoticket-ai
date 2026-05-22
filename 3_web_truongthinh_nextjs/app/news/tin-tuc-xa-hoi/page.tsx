import { Calendar, ArrowRight, Rss } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Tin Tức Xã Hội | Trường Thịnh" };

const POSTS = [
  { title: "Khai trương tuyến xe Limousine VIP đi Đà Nẵng", date: "20/05/2026", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80", excerpt: "Nhằm đáp ứng nhu cầu đi lại tăng cao và mang lại trải nghiệm tiện nghi, Trường Thịnh chính thức khai trương tuyến xe VIP hoàn toàn mới..." },
  { title: "Lễ trao thưởng cho những tài xế xuất sắc năm", date: "15/04/2026", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80", excerpt: "Ghi nhận sự đóng góp của các bác tài, công ty đã tổ chức buổi lễ tri ân vô cùng ý nghĩa..." },
  { title: "Trường Thịnh đồng hành cùng chiến dịch Mùa Hè Xanh", date: "10/04/2026", img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80", excerpt: "Mang yêu thương đến với cộng đồng thông qua những chuyến xe thiện nguyện..." }
];

export default function SocialNewsPage() {
  return (
    <div className="pt-[72px] min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-blue-dark py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-blue-dark opacity-95"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Tin Tức Xã Hội</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">Cập nhật tin tức mới nhất về đời sống và hoạt động doanh nghiệp</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
          <Link href="/news" className="hover:text-brand-blue">Tin tức</Link>
          <span>/</span>
          <span className="text-brand-text font-medium">Tin tức xã hội</span>
        </div>

        <div className="space-y-8">
          {POSTS.map((post, i) => (
            <article key={i} className="bg-white rounded-2xl overflow-hidden shadow-card flex flex-col md:flex-row hover:shadow-card-hover transition-all duration-300 group animate-fade-in-up border border-brand-border/50" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="md:w-1/3 aspect-video md:aspect-auto bg-gray-200 overflow-hidden relative">
                 <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Xã Hội
                 </div>
              </div>
              <div className="p-6 md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs text-brand-muted mb-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-text mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-6 text-[15px] line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <button className="text-brand-blue font-semibold text-sm flex items-center gap-1.5 w-max hover:text-brand-red transition-colors">
                  Đọc tiếp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
