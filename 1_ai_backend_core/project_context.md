PROJECT CONTEXT (Bối cảnh & Triết lý dự án)
Tên lõi sản phẩm (SaaS): AutoTicket AI (TT Agent sẽ chỉ là Khách hàng đầu tiên - Tenant 01).

Triết lý phát triển: "Invisible UI" (Giao diện vô hình). Người dùng không cần học cách dùng web, không cần tìm kiếm chuyến đi. Họ chỉ cần "nói" ra nhu cầu, AI sẽ lo toàn bộ phần còn lại. Đơn giản đến mức người lớn tuổi cũng mua vé được trong 30 giây.

Sứ mệnh cao cả: Số hóa 100% ngành vận tải hành khách truyền thống tại Việt Nam. Giúp các nhà xe gia đình vươn lên cạnh tranh với các nền tảng OTA (như Vexere) bằng cách sở hữu "tổng đài viên AI" túc trực 24/7 với chi phí rẻ bằng 1/100 con người.

Mục tiêu kinh doanh (Tầm nhìn 100 tỷ):

Phase 1 (MVP): Nâng cấp web Trường Thịnh cho dượng Nhân + Tích hợp AI Agent. Chứng minh mô hình giảm 50% chi phí vận hành tổng đài.

Phase 2: Đóng gói AI thành một đoạn mã nhúng (như <script src="...">). Bán theo dạng Subcription (SaaS) 5 triệu/tháng/nhà xe hoặc thu phí 2.000đ/vé bán thành công.

Phase 3: Mở rộng sang Zalo Mini App, Messenger, Telegram cho hàng trăm nhà xe. 

2. CHIẾN LƯỢC TÁCH BIỆT CODE (SaaS Architecture)
Để AI Agent tách biệt hoàn toàn với Web Trường Thịnh, chúng ta sẽ áp dụng mô hình Micro-Frontend & API-First:

AI Backend Core (Python/FastAPI): Chứa não bộ LangGraph, Gemini, Database. Nó phục vụ nhiều nhà xe. Khi gọi API, phải truyền lên tenant_id (Ví dụ: tenant_id = truong_thinh).

Web Trường Thịnh (Next.js): Một trang web hoàn toàn mới, hiện đại, gọi API chuẩn. Lời khuyên thật lòng: KHÔNG NÊN dùng tool cào nguyên source code web cũ vì code rất rác và chậm. Hãy bảo AI Thợ "clone" lại UI dựa trên ảnh chụp, build bằng TailwindCSS sẽ đẹp, mượt và chuẩn SEO hơn gấp 10 lần.

Embeddable Widget (React/Vite): Đây là con gà đẻ trứng vàng. Nó là một cục Chatbot nổi ở góc màn hình. Nó được build ra 1 file widget.js. Chỉ cần đưa file này cho bất kỳ công ty nào dán vào thẻ <body> web của họ là họ có AI Agent. 
autoticket-ai-workspace/
│
├── 1_ai_backend_core/              # LÕI AI & API (SaaS Backend)
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── chat.py         # [DONE by AI 1] API Chat chính (nhận/trả text, mock API)
│   │   │   │   ├── webhooks.py     # [TODO] Xử lý Webhook thanh toán (VietQR/PayOS)
│   │   │   │   └── admin.py        # [TODO] API Dashboard quản lý cho nhà xe
│   │   ├── core/
│   │   │   ├── config.py           # [TODO] Cấu hình Pydantic (GEMINI, SUPABASE)
│   │   │   ├── database.py         # [DONE by AI 1] Quản lý kết nối Prisma Client
│   │   │   ├── security.py         # [TODO] Xác thực JWT, bảo mật API
│   │   │   └── multi_tenant.py     # [TODO] Middleware phân luồng AI theo nhà xe
│   │   ├── agents/                 
│   │   │   ├── booking_agent.py    # [TODO] Agent xử lý luồng đặt vé (LangGraph)
│   │   │   ├── tools.py            # [TODO] Hàm Tool Calling (check_seats, book...)
│   │   │   └── prompts.py          # [TODO] System Prompts cho Gemini
│   │   └── main.py                 # [DONE by AI 1] Khởi chạy FastAPI & Lifespan DB
│   ├── prisma/
│   │   └── schema.prisma           # [DONE by AI 1] Model DB (Tenant, Route, Trip, Booking)
│   ├── .env                        # [DONE by AI 1] Biến môi trường (DATABASE_URL)
│   ├── requirements.txt            # [DONE by AI 1] Khai báo thư viện (fastapi, prisma...)
│   └── Dockerfile                  # [TODO] Đóng gói image Docker
│
├── 2_frontend_widget/              # CHATBOT GẮN VÀO MỌI WEB (SaaS Client)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBubble.jsx      # [TODO] Nút tròn mở chat
│   │   │   ├── ChatWindow.jsx      # [TODO] Giao diện khung chat
│   │   │   ├── TicketCard.jsx      # [TODO] UI thẻ vé AI gợi ý
│   │   │   └── QRPayment.jsx       # [TODO] UI mã QR thanh toán
│   │   ├── hooks/
│   │   │   └── useAgentChat.js     # [TODO] Hook gọi API Backend
│   │   ├── main.jsx                # [TODO] Mount widget vào DOM web gốc
│   │   └── widget.css              # [TODO] CSS độc lập cho widget
│   ├── vite.config.js              # [TODO] Cấu hình build bundle (autoticket.js)
│   └── package.json                # [TODO] Khai báo thư viện Frontend
│
└── 3_web_truongthinh_nextjs/       # BẢN NÂNG CẤP WEB NHÀ XE (Client Demo)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx            # [TODO] Trang chủ chính
    │   │   ├── gioi-thieu/page.tsx # [TODO] Trang giới thiệu
    │   │   ├── tuyen-duong/page.tsx# [TODO] Bảng giá vé, lộ trình
    │   │   ├── layout.tsx          # [TODO] Layout bọc toàn trang (nơi nhúng widget)
    │   │   └── globals.css         # [TODO] TailwindCSS toàn cục
    │   ├── components/
    │   │   ├── Header.tsx          # [TODO] Menu & Logo
    │   │   ├── Footer.tsx          # [TODO] Chân trang
    │   │   └── HeroSection.tsx     # [TODO] Banner chính trang chủ
    │   └── lib/
    │       └── utils.ts            # [TODO] Các hàm tiện ích
    ├── tailwind.config.ts          # [TODO] Cấu hình TailwindCSS
    └── package.json                # [TODO] Khai báo thư viện NextJS