---
trigger: model_decision
description: "When writing, refactoring, fixing code, designing solutions, choosing dependencies, or when the user mentions ponytail, lazy mode, simplest/minimal solution, YAGNI, or avoiding over-engineering."
---

# PONYTAIL.MD - Lazy Senior Dev Mode

> **Mục tiêu**: Ép giải pháp lười nhất nhưng hoạt động hoàn hảo: ngắn nhất, đơn giản nhất, ít code nhất (YAGNI). Code tốt nhất là code không cần phải viết.

---

## 🪜 1. BẬC THANG ƯU TIÊN (The Ladder)

Dừng lại ở nấc thang đầu tiên thỏa mãn:
1. **Có cần tồn tại không?** Nếu là nhu cầu phỏng đoán cho tương lai → Bỏ qua, nói rõ trong 1 dòng (YAGNI).
2. **Đã có sẵn trong codebase chưa?** Tái sử dụng hàm helper/util/type có sẵn, không viết lại.
3. **Thư viện chuẩn (Stdlib) có không?** Ưu tiên thư viện tích hợp sẵn của ngôn ngữ/runtime.
4. **Nền tảng (Native platform) hỗ trợ không?** Dùng tính năng native (HTML5/CSS, Web API, DB constraints) thay vì cài thêm thư viện.
5. **Dependency đã cài giải quyết được không?** Dùng package hiện có trong `package.json`, tuyệt đối không cài package mới cho việc vài dòng code làm được.
6. **Có thể viết trong 1 dòng không?** Viết 1 dòng.
7. **Chỉ khi đó**: Viết lượng code tối thiểu để chạy được.

---

## 🚫 2. NGUYÊN TẮC VÀNG (Rules)

- **Không trừu tượng hóa thừa**: Không tạo Interface cho 1 class, không tạo Factory cho 1 object, không tạo config cho giá trị không bao giờ đổi.
- **Không boilerplate**: Bỏ hết code khung "để dành cho sau này".
- **Ưu tiên xóa hơn thêm**: Ít file nhất có thể. Shortest working diff wins.
- **Sửa tận gốc (Root Cause)**: Luôn tìm hàm dùng chung để sửa 1 điểm (root cause), không vá víu triệu chứng ở các hàm gọi con.
- **Đánh đổi có kiểm soát**: Nếu cố tình cắt góc để ra mắt nhanh, hãy ghi chú: `// ponytail: [giới hạn hiện tại, cách nâng cấp khi cần]`.

---

## 🛡️ 3. KHI NÀO KHÔNG ĐƯỢC LƯỜI?

- **Hiểu thấu đáo bài toán**: Phải đọc và hiểu rõ toàn bộ luồng code trước khi rút gọn. Rút gọn khi chưa hiểu là tạo thêm bug.
- **Bảo mật & Kiểm tra dữ liệu**: Không bao giờ bỏ qua xác thực dữ liệu đầu vào tại ranh giới tin cậy.
- **Phòng chống mất dữ liệu**: Luôn có xử lý lỗi tối thiểu để ngăn crash hoặc mất dữ liệu.
- **Yêu cầu rõ ràng từ người dùng**: Khi người dùng yêu cầu làm đầy đủ chi tiết, hãy tuân thủ và xây dựng theo yêu cầu.
