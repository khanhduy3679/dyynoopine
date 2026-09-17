# ĐẶC TẢ YÊU CẦU — MODULE ĐẶT LỊCH (Booking + OTP + QR Check-in)

> Dùng file này làm prompt gửi cho AI agent. Copy toàn bộ phần "PROMPT" bên dưới.
> Phần "GHI CHÚ CHO NHÓM" ở cuối là để bạn tham khảo, **không cần gửi cho agent**.

---

## PROMPT (copy từ đây)

### Bối cảnh dự án

Tôi đang xây dựng **hệ thống đặt lịch salon tóc** (hair salon booking) theo **MERN stack**:

- **Frontend**: React (JavaScript, không dùng TypeScript)
- **Backend**: Node.js + Express (REST API)
- **Database**: MongoDB + Mongoose
- **Auth**: JWT

Dự án chạy ở môi trường **local development** (FE: `localhost:3000`, BE: `localhost:5000`). Đây là đồ án môn học, ưu tiên code **rõ ràng, dễ đọc, dễ giải thích** hơn là tối ưu hiệu năng. Module Authentication (đăng ký/đăng nhập) đã có sẵn, phát hành JWT token và thông tin user (id, fullName, email, role, phone).

Hệ thống có 3 vai trò: `customer`, `staff`, `admin`.

### Nhiệm vụ

Xây dựng **module Đặt lịch (Booking)** đầy đủ Backend + Frontend, gồm 3 phần:
1. Luồng đặt lịch cơ bản (chọn dịch vụ → stylist → giờ → xác nhận)
2. **Xác nhận đặt lịch qua OTP** (gửi mã xác nhận trước khi lịch hẹn chính thức được tạo)
3. **QR check-in** (khách quét mã QR khi đến salon để tự động chuyển trạng thái lịch hẹn)

### Yêu cầu chức năng

**1. Data model — Appointment**

```
Appointment {
  _id
  customerId       -> ref User
  staffId           -> ref User (nullable nếu khách chọn "bất kỳ")
  serviceId         -> ref Service
  startTime         Date
  endTime           Date  (tính từ startTime + service.duration)
  status            enum: "pending_otp" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "expired"
  otpCode           String (hash, không lưu plain text)
  otpExpiresAt      Date
  qrToken           String (unique, sinh khi status = confirmed)
  checkedInAt       Date (nullable)
  createdAt / updatedAt
}
```

**2. Luồng đặt lịch (Booking flow)**

Bước 1 — Khách chọn dịch vụ, stylist (hoặc "bất kỳ"), khung giờ trống.
Bước 2 — Hệ thống kiểm tra slot còn trống (không trùng với lịch hẹn khác của cùng stylist trong khung giờ đó).
Bước 3 — Nếu hợp lệ: tạo `Appointment` với `status = "pending_otp"`, sinh mã OTP 6 số, gửi cho khách (email hoặc hiển thị trực tiếp trên UI nếu chưa tích hợp email thật — xem phần "Giả lập gửi OTP" bên dưới).
Bước 4 — Khách nhập OTP trong vòng **5 phút**. Nếu đúng → `status = "confirmed"`, sinh `qrToken` duy nhất, trả về mã QR cho khách. Nếu sai quá 3 lần hoặc hết hạn → `status = "expired"`, giải phóng slot.
Bước 5 — Khách có thể xem lại mã QR trong trang "Lịch hẹn của tôi" bất cứ lúc nào trước giờ hẹn.

**3. QR Check-in**

- Mỗi `Appointment` ở trạng thái `confirmed` có 1 `qrToken` duy nhất, encode thành QR code hiển thị trên UI (dùng thư viện tạo QR phía frontend, không cần gọi API tạo ảnh).
- Nhân viên lễ tân có màn hình **"Quét check-in"**: nhập/quét `qrToken` → gọi API xác thực.
- Backend kiểm tra: token hợp lệ, đúng ngày hẹn, chưa check-in trước đó → chuyển `status = "checked_in"`, lưu `checkedInAt`.
- Trường hợp lỗi cần xử lý: token không tồn tại, lịch hẹn đã bị hủy, quét check-in quá sớm (trước giờ hẹn quá xa) hoặc quá trễ (quá giờ hẹn X phút), đã check-in rồi (quét lại lần 2).

**4. Quản lý lịch hẹn (các trạng thái tiếp theo)**

- Nhân viên/Admin có thể chuyển `checked_in` → `in_progress` → `completed`.
- Khách hoặc Admin có thể `cancel` lịch hẹn ở trạng thái `pending_otp` hoặc `confirmed` (không hủy được khi đã `checked_in` trở đi).

**5. Giả lập gửi OTP (vì chạy local, chưa tích hợp email/SMS thật)**

- Tạo 1 cờ cấu hình `OTP_MODE=console | email`.
- Nếu `console`: log mã OTP ra terminal backend VÀ trả kèm trong response API (chỉ khi `NODE_ENV=development`) để dễ demo/test — **không trả OTP trong response ở môi trường production**.
- Nếu `email`: dùng Nodemailer với SMTP giả lập (VD: Mailtrap hoặc Ethereal Email) — phần này có thể để agent tự chọn thư viện, miễn dễ cấu hình qua `.env`.

### Hợp đồng API

```
POST /api/appointments
Body: { serviceId, staffId (optional), startTime }
Response 201:
{
  "success": true,
  "appointmentId": "...",
  "status": "pending_otp",
  "otpExpiresAt": "..."
}
Response 409 (trùng slot):
{ "success": false, "message": "Khung giờ này đã có người đặt" }
```

```
POST /api/appointments/:id/verify-otp
Body: { otp: "123456" }
Response 200:
{
  "success": true,
  "status": "confirmed",
  "qrToken": "..."
}
Response 400 (sai OTP / hết hạn):
{ "success": false, "message": "Mã OTP không đúng hoặc đã hết hạn", "attemptsLeft": 2 }
```

```
POST /api/appointments/check-in
Body: { qrToken: "..." }
Response 200:
{
  "success": true,
  "appointment": { customerName, serviceName, startTime, status: "checked_in" }
}
Response 400/404:
{ "success": false, "message": "Mã QR không hợp lệ hoặc đã được sử dụng" }
```

```
PATCH /api/appointments/:id/status
Body: { status: "in_progress" | "completed" | "cancelled" }
```

```
GET /api/appointments/my       -> danh sách lịch hẹn của khách đang đăng nhập
GET /api/appointments?date=&staffId=&status=   -> danh sách cho admin/staff (có filter)
```

### Yêu cầu kỹ thuật

**Backend (Node.js/Express):**
- Cấu trúc: `routes/`, `controllers/`, `services/`, `models/`, `middlewares/`
- Dùng `bcrypt` để hash OTP trước khi lưu DB (không lưu OTP dạng plain text)
- Middleware kiểm tra JWT + role cho các route quản trị (`checked_in`, filter theo staffId...)
- Có cron job hoặc scheduled check (dùng `node-cron` hoặc kiểm tra ngay khi query) để tự động chuyển các `pending_otp` quá hạn 5 phút thành `expired`

**Frontend (React):**
- Trang **Đặt lịch**: wizard 3 bước (chọn dịch vụ → chọn giờ → xác nhận), có thể dùng React state đơn giản, không cần thư viện wizard ngoài
- Trang **Nhập OTP**: countdown timer hiển thị thời gian còn lại (5 phút), nút "Gửi lại mã" (disable trong 30 giây sau khi gửi)
- Trang **Lịch hẹn của tôi**: liệt kê lịch hẹn, hiển thị mã QR cho lịch `confirmed` (dùng thư viện `qrcode.react` hoặc tương đương)
- Trang **Check-in** (dành cho nhân viên lễ tân): ô nhập/quét mã, hiển thị kết quả ngay (dùng thư viện `html5-qrcode` nếu muốn quét bằng camera, hoặc chỉ cần ô nhập text nếu không có thời gian làm quét camera thật)

**Yêu cầu về Design Pattern (đồ án môn Mẫu thiết kế phần mềm) — bắt buộc thể hiện rõ, có comment giải thích:**

1. **State Pattern** — vòng đời `Appointment` (`pending_otp → confirmed → checked_in → in_progress → completed`, hoặc → `cancelled`/`expired`) triển khai bằng 1 class/module quản lý các chuyển trạng thái hợp lệ, từ chối chuyển trạng thái không hợp lệ (VD: không thể từ `completed` quay lại `pending_otp`).

2. **Chain of Responsibility** — validate khi tạo lịch hẹn, đi qua các bước kiểm tra tuần tự: (1) dịch vụ có tồn tại/đang active không → (2) stylist có làm được dịch vụ này không → (3) slot có trống không → (4) trong giờ làm việc của salon không. Mỗi bước là 1 "handler" riêng, dừng lại và trả lỗi ngay khi 1 bước fail.

3. **Strategy Pattern** — 2 chiến lược gửi OTP (`console` / `email`) implement chung 1 interface `sendOtp(destination, code)`, chọn chiến lược theo config `OTP_MODE`.

4. **Observer Pattern** — khi `Appointment` đổi trạng thái, bắn event nội bộ (`EventEmitter` của Node.js là đủ, không cần message queue) để module Notification lắng nghe và xử lý (log/gửi thông báo), tách rời logic đặt lịch khỏi logic thông báo.

### Đầu ra mong muốn

1. Code đầy đủ Backend (routes/controllers/services/models/middlewares liên quan) và Frontend (các trang/component liên quan).
2. Comment tiếng Việt tại vị trí áp dụng từng Design Pattern.
3. File `.env.example` liệt kê các biến cần thiết (`OTP_MODE`, `OTP_EXPIRES_MINUTES`, SMTP config nếu dùng email...).
4. Hướng dẫn ngắn gọn cách test luồng: tạo lịch → xem OTP (console) → xác nhận → lấy QR → check-in.
5. Nêu rõ các giả định đã dùng nếu có phần chưa rõ trong đặc tả này.

*(kết thúc phần PROMPT)*

---

## GHI CHÚ CHO NHÓM (không gửi cho agent)

### Vì sao thêm OTP + QR check-in

Đây là 2 tính năng lấy ý tưởng từ 1 dự án thực tế (hệ thống tuyển sinh dùng OTP xác nhận đăng ký, và nhiều hệ thống dịch vụ dùng QR check-in). Áp dụng vào salon giúp:
- OTP: tránh đặt lịch ảo/spam, tạo cảm giác "thật" hơn cho đồ án
- QR check-in: là điểm nhấn trực quan dễ demo trước lớp — quét QR trên điện thoại là hình ảnh ấn tượng hơn nhiều so với chỉ bấm nút

### Việc cần thống nhất trước khi đưa cho agent code

| Vấn đề | Quyết định gợi ý |
|---|---|
| Gửi OTP qua đâu | Nên chọn `OTP_MODE=console` cho toàn bộ quá trình phát triển/demo — không cần tích hợp email thật, đỡ mất thời gian setup SMTP |
| Thời gian hết hạn OTP | 5 phút là hợp lý, có thể chỉnh trong `.env` |
| Quét QR bằng camera thật hay chỉ nhập tay | Nếu thời gian gấp, làm **ô nhập tay mã QR** trước (copy code từ dưới QR), phần quét camera thật (`html5-qrcode`) làm sau nếu còn dư thời gian — không bắt buộc phải quét camera để đồ án chạy đúng logic |

### Liên kết với tài liệu SEP

Sau khi có code, cập nhật các tài liệu sau cho khớp:

- **FunctionList**: thêm rõ 2 mục con "Xác nhận OTP" và "Check-in QR" dưới nhóm "Đặt lịch"/"Quản lý lịch hẹn"
- **BusinessRule**: ghi rõ luật OTP hết hạn 5 phút, tối đa 3 lần nhập sai, luật check-in (không cho check-in quá sớm/quá trễ)
- **Sequence Diagram**: nên vẽ thêm 1 sequence diagram riêng cho luồng OTP + check-in (khác với sequence diagram Đặt lịch cơ bản đã làm trước đó)
- **TestCase**: đây là luồng phức tạp nhất hệ thống — nên đưa vào nhóm chức năng làm test đầy đủ (Pending/Bắt buộc theo bảng phân loại 3 mức độ đã thống nhất trước đó)
