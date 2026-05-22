import { Users, Award, Shield, Target } from "lucide-react";

export const metadata = {
  title: "Giới thiệu | Trường Thịnh",
  description: "Về chúng tôi và đội ngũ lãnh đạo của Trường Thịnh.",
};

export default function AboutPage() {
  return (
    <div className="pt-[72px] min-h-screen bg-brand-bg pb-20">
      {/* Hero Section */}
      <section className="relative bg-brand-blue-dark py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-blue-dark opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-up">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm border border-white/20">Về Chúng Tôi</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Hành Trình Tận Tâm <br className="hidden sm:block" /> Phụng Sự Khách Hàng
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            Trải qua nhiều năm hoạt động, chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực vận tải, mang đến trải nghiệm an toàn, nhanh chóng và tin cậy nhất cho hàng triệu hành khách.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { icon: Shield, title: "An Toàn Tuyệt Đối", desc: "Đặt sự an toàn của hành khách và hàng hóa lên hàng đầu trong mọi hành trình với hệ thống phương tiện hiện đại." },
            { icon: Target, title: "Phục Vụ Chuyên Nghiệp", desc: "Đội ngũ nhân viên tận tâm, quy trình phục vụ chuẩn mực, tối ưu hóa trải nghiệm khách hàng từ khâu đặt vé đến khi kết thúc chuyến đi." },
            { icon: Award, title: "Uy Tín Vững Chắc", desc: "Cam kết giữ vững niềm tin của khách hàng thông qua chất lượng dịch vụ ổn định, minh bạch và trách nhiệm." },
          ].map((val, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 group animate-fade-in-up border border-brand-border/50" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform group-hover:bg-gradient-to-br from-brand-blue to-brand-blue-dark group-hover:shadow-glass">
                <val.icon className="w-8 h-8 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-3">{val.title}</h3>
              <p className="text-brand-muted leading-relaxed text-[15px]">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      <section id="lanh-dao" className="max-w-7xl mx-auto px-4 sm:px-6 mt-32">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text mb-4">Đội Ngũ Lãnh Đạo</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-brand-blue to-brand-blue-light mx-auto rounded-full mb-6"></div>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg">
            Những con người tâm huyết, dẫn dắt Trường Thịnh không ngừng đổi mới, phát triển và vươn tầm xa hơn trong tương lai.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Nguyễn Văn A", role: "Chủ tịch HĐQT" },
            { name: "Trần Thị B", role: "Tổng Giám đốc" },
            { name: "Lê Văn C", role: "Phó Tổng Giám đốc" },
            { name: "Phạm Thị D", role: "Giám đốc Vận hành" },
          ].map((leader, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 animate-fade-in-up border border-brand-border/50 group" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <Users className="w-20 h-20 text-gray-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 text-center relative bg-white">
                <h4 className="text-lg font-bold text-brand-text mb-1 group-hover:text-brand-blue transition-colors">{leader.name}</h4>
                <p className="text-[14px] text-brand-red font-medium">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
