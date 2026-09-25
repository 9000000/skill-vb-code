# 🚀 Hướng Dẫn Chi Tiết Phát Hành & Cập Nhật Gói Lên NPX (`skill-vb-code`)

> **Tài liệu chuẩn dành cho:** Quản trị viên dự án `skill-vb-code` (`matrix37`).  
> **Package URL:** [https://www.npmjs.com/package/skill-vb-code](https://www.npmjs.com/package/skill-vb-code)  
> **Lệnh thực thi người dùng cuối:** `npx skill-vb-code`

---

## 🧭 1. Cơ Chế Hoạt Động Của NPX

Khi người dùng gõ `npx skill-vb-code`:
1. `npx` truy vấn registry của **npm** để tải gói `skill-vb-code` mới nhất về bộ nhớ đệm tạm thời.
2. `npx` đọc mục `"bin"` trong file `package.json`:
   ```json
   "bin": {
     "skill-vb-code": "./cli/index.js",
     "antigravity-setup": "./setup.js",
     "antigravity-update": "./update.js"
   }
   ```
3. File `./cli/index.js` được thực thi trực tiếp bằng Node.js nhờ dòng shebang đầu file (`#!/usr/bin/env node`), kích hoạt giao diện dòng lệnh (CLI Wizard).

---

## 🔄 2. Quy Trình Chuẩn Mỗi Khi Cập Nhật (3 Bước)

Mỗi khi bạn thêm kỹ năng mới, sửa code hoặc tối ưu cấu hình, chỉ cần thực hiện 3 bước sau:

### Bước 1: Tăng số phiên bản (Version Bump)
> ⚠️ **Quy tắc bất biến của NPM:** NPM không bao giờ cho phép ghi đè lên số phiên bản đã tồn tại. Mỗi lần publish bắt buộc phải tăng version.

Có 2 cách tăng:
* **Cách 1 (Tự động & Khuyên dùng):**
  ```bash
  # Tăng bản vá lỗi / sửa nhỏ: 1.1.1 -> 1.1.2
  npm version patch --no-git-tag-version

  # Tăng tính năng mới / thêm nhiều skill: 1.1.1 -> 1.2.0
  npm version minor --no-git-tag-version

  # Bản phát hành lớn / thay đổi kiến trúc: 1.1.1 -> 2.0.0
  npm version major --no-git-tag-version
  ```
* **Cách 2 (Thủ công):**
  Mở [`package.json`](file:///f:/MyGithub/skill-vb-code/package.json) và sửa thủ công dòng `"version"`:
  ```json
  "version": "1.1.2"
  ```

---

### Bước 2: Đóng gói kiểm tra (Prepublish Build)
Chạy lệnh kiểm tra và đóng gói bundle:
```bash
npm run prepublishOnly
```
**Hệ thống sẽ tự động:**
- Quét toàn bộ thư mục `.agent/skills/`.
- Tự động phân loại 104+ skills vào các danh mục (`webdev`, `ai`, `testing`, `research`, v.v.).
- Đóng gói toàn bộ file cấu hình vào [`assets/skills-bundle.json`](file:///f:/MyGithub/skill-vb-code/assets/skills-bundle.json).

*(Lưu ý: Nếu bạn quên chạy bước này, npm cũng sẽ tự động gọi lệnh này trước khi upload).*

---

### Bước 3: Đẩy lên NPM Registry
Chạy lệnh publish chính thức:
```bash
npm publish --access public
```
> Nếu npm yêu cầu OTP / 2FA (mã xác thực 6 số từ ứng dụng Authenticator hoặc email), hãy nhập mã khi được hỏi.

---

## 🧪 3. Kiểm Tra & Trải Nghiệm Sau Khi Publish

### A. Kiểm tra thông tin trên mạng
Sau khoảng 30 giây đến 1 phút, kiểm tra phiên bản mới nhất đã lên registry chưa:
```bash
npm view skill-vb-code version
```

### B. Chạy thử nghiệm bằng npx
Để tránh việc npx lưu cache phiên bản cũ trên máy, luôn dùng thẻ `@latest`:

```bash
# Chạy trực tiếp CLI khởi tạo
npx skill-vb-code@latest

# Hoặc tạo thư mục dự án mới
npx skill-vb-code@latest my-awesome-project
```

---

## 🛠️ 4. Bảng Tra Cứu Sự Cố (Troubleshooting)

| Lỗi gặp phải | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **`403 Forbidden - You cannot publish over the previously published versions`** | Số phiên bản trong `package.json` đã có trên npm rồi. | Chạy `npm version patch --no-git-tag-version` để tăng số version rồi publish lại. |
| **`404 Not Found` hoặc `Not logged in`** | Máy chưa đăng nhập tài khoản npm. | Chạy `npm login` và làm theo hướng dẫn trên trình duyệt. Kiểm tra lại bằng `npm whoami`. |
| **`npx` vẫn chạy code của version cũ** | Bộ nhớ cache của npx trên máy còn giữ bản cũ. | Thêm `@latest`: `npx skill-vb-code@latest` hoặc xóa cache npx bằng lệnh: `npx clear-npx-cache` (hoặc xóa thư mục `_npx` trong AppData). |
| **`EOTP` / Cần mã 2FA** | Tài khoản npm đã bật bảo mật 2 lớp. | Nhập mã OTP từ ứng dụng Authenticator trên điện thoại khi terminal yêu cầu. |

---

## 📋 5. Tóm Tắt Cheatsheet 1 Lệnh (Copy & Run)

Mỗi lần muốn đẩy phiên bản vá lỗi mới:
```bash
npm version patch --no-git-tag-version && npm run prepublishOnly && npm publish --access public
```

Mỗi lần muốn đẩy phiên bản tính năng mới (Minor):
```bash
npm version minor --no-git-tag-version && npm run prepublishOnly && npm publish --access public
```
