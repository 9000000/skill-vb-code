---
trigger: always_on
---

# NATURAL-SKILLS.MD - Natural Chat Skill Routing & Automatic Intent Execution

> **Mục tiêu**: Tuyệt đối giải phóng người dùng khỏi việc phải gõ lệnh slash (`/`). Mọi kỹ năng trong hệ thống PHẢI được AI tự động nhận diện và kích hoạt một cách tự nhiên nhất ngay khi chat bằng Tiếng Việt hoặc Tiếng Anh.

---

## 🎯 1. NGUYÊN TẮC VẬN HÀNH (Step 0: Intent Discovery)

Mỗi khi người dùng gửi một tin nhắn bất kỳ (yêu cầu tạo tính năng, sửa bug, thiết kế, hỏi đáp, tối ưu code):
1. **Bước 0 - Quét ý định tự nhiên (Intent Check)**: 
   Trước khi trả lời hoặc viết code, Agent PHẢI rà soát nội dung câu hỏi/yêu cầu của người dùng để xác định xem thuộc nhóm kỹ năng nào dưới đây.
2. **Kích hoạt ngầm định & Thực thi chuẩn mực**:
   - Tự động gọi `view_file` trên file `SKILL.md` tương ứng để nạp kiến thức sâu (nếu cần triển khai chi tiết).
   - Áp dụng các nguyên tắc, checklist, và design tokens của kỹ năng đó vào câu trả lời hoặc code tạo ra.
3. **Phản hồi tự nhiên (Natural Feedback)**:
   - Thông báo ngắn gọn, tự nhiên ở đầu phản hồi (ví dụ: `🎨 Áp dụng chuẩn [UI/UX Pro Max & Tailwind Patterns]...` hoặc `⚡ Kích hoạt chế độ tối giản [Ponytail - YAGNI]...`).
   - KHÔNG BAO GIỜ yêu cầu hay nhắc nhở người dùng phải gõ lệnh `/ui-ux-pro-max`, `/ponytail`, `/debug`, v.v.

---

## 🗺️ 2. BẢNG TRA Ý ĐỊNH TỰ NHIÊN (Natural Chat Intent Matrix)

Dưới đây là từ điển ánh xạ giữa văn phong chat tự nhiên của người dùng và các kỹ năng chuyên biệt:

### 🎨 A. Giao diện, Màu sắc, Visual & Cảm xúc (UI / UX / Frontend)
- **Từ ngữ tự nhiên**:
  *"làm giao diện", "cho đẹp hơn", "màu sắc", "animation", "hiệu ứng", "gradient", "nút bấm", "responsive", "tối ưu mobile view", "hero section", "dark mode", "nhìn phèn quá", "nhìn xịn sò", "bóng bẩy", "hover", "card", "landing page", "glassmorphism", "bento grid", "hiện đại 2026"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`ui-ux-pro-max-skill`**, **`frontend-trends-2026`**, **`tailwind-patterns`**, **`core-components`**

### ⚡ B. Tối giản, Lười, Viết ít code, YAGNI (Ponytail & Clean Code)
- **Từ ngữ tự nhiên**:
  *"làm đơn giản thôi", "lười lắm", "ngắn gọn", "viết ít code nhất", "đừng vẽ vời", "không over-engineering", "yagni", "code tối giản", "gọn ghẽ", "dùng thư viện có sẵn", "dùng native thôi", "ponytail", "tinh gọn"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`ponytail`** (chế độ lazy senior dev), **`clean-code`**, **`ponytail-audit`**

### 🐛 C. Sửa lỗi, Báo bug, Exception, Crash, Không chạy được (Debugging)
- **Từ ngữ tự nhiên**:
  *"lỗi rồi", "không chạy được", "bị crash", "500 internal error", "404", "undefined is not a function", "báo đỏ", "check log giúp tôi", "sao bấm không ăn", "fix bug này", "màn hình trắng"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`systematic-debugging`** (4-phase RCA), **`debugger`**

### 🗄️ D. Cơ sở dữ liệu, SQL, Supabase, Postgres, Prisma (Database)
- **Từ ngữ tự nhiên**:
  *"tạo bảng", "database", "supabase", "postgres", "prisma", "viết query", "quan hệ bảng", "migration", "foreign key", "lưu trữ data", "rls policy", "neon postgres"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`postgres-best-practices`**, **`prisma-expert`**, **`neon-postgres`**, **`postgresql`**

### 🔐 E. Đăng nhập, Tài khoản, Phân quyền, Clerk, NextAuth (Auth)
- **Từ ngữ tự nhiên**:
  *"tạo login", "đăng nhập bằng google", "xác thực người dùng", "phân quyền", "bảo vệ route", "clerk auth", "jwt", "session", "đăng ký tài khoản", "quên mật khẩu"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`clerk-auth`**, **`auth-implementation-patterns`**, **`nextjs-supabase-auth`**

### 💳 F. Bán hàng, Thanh toán, Stripe, SaaS, Giá cả (Monetization & CRO)
- **Từ ngữ tự nhiên**:
  *"tích hợp thanh toán", "stripe", "gói cước", "bán tài khoản", "checkout", "mua hàng", "pricing table", "tối ưu tỷ lệ mua hàng", "cro", "popup giảm giá", "landing page bán hàng"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`stripe-integration`**, **`pricing-strategy`**, **`micro-saas-launcher`**, **`cro-expert-kit`**, **`popup-cro`**

### 🚀 G. Triển khai, Hosting, Vercel, Server, Docker (DevOps & Deploy)
- **Từ ngữ tự nhiên**:
  *"đưa web lên mạng", "deploy", "vercel", "cấu hình domain", "docker", "dockerfile", "docker-compose", "vps", "server", "chạy ngầm", "ci/cd"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`vercel-deployment`**, **`docker-expert`**, **`server-management`**, **`cicd-automation-workflow-automate`**

### 📱 H. Ứng dụng di động, Mobile App, Flutter, React Native (Mobile)
- **Từ ngữ tự nhiên**:
  *"làm app điện thoại", "mobile app", "flutter", "react native", "ios", "android", "giao diện app", "widget", "màn hình điện thoại"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`flutter-expert`**, **`react-native-architecture`**, **`react-native-best-practices`**, **`mobile-design`**

### 🤖 I. AI, Prompt, Chatbot, RAG, Hỏi đáp tài liệu, LLM (AI Engineering)
- **Từ ngữ tự nhiên**:
  *"tạo chatbot", "viết prompt", "rag", "hỏi đáp file pdf", "tích hợp gemini / gpt / claude", "openai", "embeddings", "vector search", "ai assistant"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`prompt-engineering`**, **`rag-implementation`**, **`llm-app-patterns`**, **`ai-engineer`**

### 🌐 J. Cào dữ liệu, Duyệt web, Crawl, Scrape (Web Scraping & Browser)
- **Từ ngữ tự nhiên**:
  *"cào web", "lấy dữ liệu từ trang", "scrape data", "tải nội dung url", "tự động bấm web", "crawl", "firecrawl", "tavily"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`firecrawl-scraper`**, **`browser-automation`**, **`tavily-web`**, **`puppeteer-mcp`**

### 🧪 K. Viết Test, Kiểm thử tự động (TDD & Quality)
- **Từ ngữ tự nhiên**:
  *"viết test", "kiểm thử", "tdd", "unit test", "e2e test", "jest", "playwright", "chạy test thử xem"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`tdd-master-workflow`**, **`e2e-testing-patterns`**, **`testing-automation-mcp`**

### 📈 L. SEO, Lên Top Tìm Kiếm, AI Search (SEO / GEO)
- **Từ ngữ tự nhiên**:
  *"lên top google", "tối ưu seo", "meta tags", "sitemap", "tìm kiếm trên chatgpt / perplexity", "geo", "ranking"*
- **Kỹ năng tự động kích hoạt**:
  👉 **`seo-expert-kit`**, **`geo-fundamentals`**

---

## 🚫 3. NHỮNG ĐIỀU TUYỆT ĐỐI KHÔNG LÀM
1. **KHÔNG** bắt người dùng nhớ tên kỹ năng hoặc gõ `/lệnh`.
2. **KHÔNG** từ chối thực hiện vì thiếu cú pháp đặc biệt; chỉ cần hiểu ý là triển khai ngay.
3. **KHÔNG** load ồ ạt kiến thức không liên quan gây tràn bộ nhớ token; chỉ kích hoạt đúng kỹ năng khớp với câu chat hiện tại.
