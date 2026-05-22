import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Địa Điểm Du Lịch | Tin Tức | Trường Thịnh",
};

const POSTS = [
  { title: "Khám phá Quy Nhơn - Maldives thu nhỏ của Việt Nam", date: "15/05/2026", img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80", excerpt: "Kinh nghiệm du lịch Quy Nhơn 3 ngày 2 đêm chi tiết nhất, khám phá Kỳ Co, Eo Gió..." },
  { title: "Top 5 địa điểm không thể bỏ qua khi đến Đà Nẵng", date: "10/05/2026", img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80", excerpt: "Đà Nẵng không chỉ có Bà Nà Hills, hãy cùng khám phá những địa điểm thú vị khác..." },
  { title: "Review Nha Trang - Thành phố biển vẫy gọi", date: "05/05/2026", img: "https://images.unsplash.com/photo-1542640244-7e672d6cb466?auto=format&fit=crop&q=80", excerpt: "Hướng dẫn ăn chơi thả ga tại Nha Trang với ngân sách tiết kiệm nhất..." },
  { title: "Đà Lạt Mộng Mơ: Cẩm nang ăn chơi từ A-Z", date: "28/04/2026", img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80", excerpt: "Những góc check-in tuyệt đẹp tại Đà Lạt mà bạn không nên bỏ qua trong năm nay." }
];

export default function TravelNewsPage() {
  return (
    <div className="pt-[72px] min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-blue-dark py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-blue-dark opacity-95"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Địa Điểm Du Lịch</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">Khám phá những điểm đến tuyệt vời trên mọi nẻo đường cùng Trường Thịnh</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
          <Link href="/news" className="hover:text-brand-blue">Tin tức</Link>
          <span>/</span>
          <span className="text-brand-text font-medium">Địa điểm du lịch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post, i) => (
            <article key={i} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-video bg-gray-200 overflow-hidden relative">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand-blue text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Du Lịch
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-brand-muted mb-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-brand-text mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-[15px] mb-5 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <button className="text-brand-blue font-semibold text-sm flex items-center gap-1.5 hover:text-brand-red transition-colors">
                  Đọc tiếp <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
