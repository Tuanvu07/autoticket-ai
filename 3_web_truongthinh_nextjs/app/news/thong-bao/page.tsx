import { Bell, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Thông Báo | Trường Thịnh" };

const POSTS = [
  { title: "Thông báo lịch chạy xe dịp Lễ 30/4 - 1/5", date: "01/04/2026", excerpt: "Để phục vụ nhu cầu đi lại trong dịp lễ, Trường Thịnh thông báo tăng cường chuyến và điều chỉnh lịch trình..." },
  { title: "Thay đổi vị trí điểm đón khách tại Bến xe Miền Đông", date: "15/03/2026", excerpt: "Kể từ ngày 20/03/2026, quầy vé và điểm đón khách của Trường Thịnh sẽ dời về vị trí mới..." },
  { title: "Cảnh báo mạo danh Trường Thịnh lừa đảo bán vé", date: "10/02/2026", excerpt: "Gần đây xuất hiện một số trang web và fanpage mạo danh công ty. Quý khách lưu ý chỉ đặt vé qua các kênh chính thức..." }
];

export default function AnnouncementPage() {
  return (
    <div className="pt-[72px] min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-blue-dark py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-blue-dark opacity-95"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Thông Báo Cập Nhật</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">Các thông báo chính thức từ ban giám đốc, lịch trình và dịch vụ</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
          <Link href="/news" className="hover:text-brand-blue">Tin tức</Link>
          <span>/</span>
          <span className="text-brand-text font-medium">Thông báo</span>
        </div>

        <div className="space-y-6">
          {POSTS.map((post, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-card transition-all duration-300 border border-brand-border/50 animate-fade-in-up flex gap-5 group" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red transition-colors">
                <Bell className="w-6 h-6 text-brand-red group-hover:text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-brand-text mb-2 group-hover:text-brand-blue transition-colors">{post.title}</h3>
                <div className="flex items-center gap-2 text-xs text-brand-muted mb-3">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                </div>
                <p className="text-gray-600 text-[15px] mb-4">{post.excerpt}</p>
                <button className="text-brand-blue font-semibold text-sm flex items-center gap-1.5 hover:text-brand-red transition-colors">
                  Xem chi tiết <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
