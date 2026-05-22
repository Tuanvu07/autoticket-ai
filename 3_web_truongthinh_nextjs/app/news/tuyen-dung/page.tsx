import { Briefcase, MapPin, DollarSign, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Tuyển Dụng | Trường Thịnh" };

const JOBS = [
  { title: "Tài Xế Xe Giường Nằm", location: "Quy Nhơn - TP.HCM", salary: "15 - 25 Triệu", type: "Toàn thời gian" },
  { title: "Nhân Viên Bán Vé", location: "Bến Xe Miền Đông", salary: "8 - 12 Triệu", type: "Theo ca" },
  { title: "Nhân Viên Chăm Sóc Khách Hàng", location: "Trụ sở Quy Nhơn", salary: "7 - 10 Triệu", type: "Toàn thời gian" },
  { title: "Lơ Xe Cao Cấp", location: "Các tuyến cố định", salary: "10 - 15 Triệu", type: "Toàn thời gian" }
];

export default function CareersPage() {
  return (
    <div className="pt-[72px] min-h-screen bg-brand-bg pb-20">
      <div className="bg-brand-blue-dark py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-blue-dark opacity-95"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center animate-fade-up">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Tuyển Dụng</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">Đồng hành cùng Trường Thịnh kiến tạo những giá trị tốt đẹp và phát triển sự nghiệp của bạn</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="flex items-center gap-2 text-sm text-brand-muted mb-8">
          <Link href="/news" className="hover:text-brand-blue">Tin tức</Link>
          <span>/</span>
          <span className="text-brand-text font-medium">Tuyển dụng</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {JOBS.map((job, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-brand-border/50 animate-fade-in-up flex flex-col h-full group" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-blue transition-colors group-hover:rotate-3">
                  <Briefcase className="w-7 h-7 text-brand-blue group-hover:text-white" />
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                  Đang Tuyển
                </span>
              </div>
              <h3 className="text-xl font-bold text-brand-text mb-4 group-hover:text-brand-blue transition-colors">{job.title}</h3>
              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-2 text-gray-600 text-[15px]">
                  <MapPin className="w-4 h-4 text-brand-muted" /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-[15px]">
                  <DollarSign className="w-4 h-4 text-brand-muted" /> <span className="font-semibold text-brand-red">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-[15px]">
                  <Clock className="w-4 h-4 text-brand-muted" /> {job.type}
                </div>
              </div>
              <button className="w-full bg-blue-50 text-brand-blue font-bold py-3.5 rounded-xl hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2 group-hover:shadow-md">
                Ứng Tuyển Ngay <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
