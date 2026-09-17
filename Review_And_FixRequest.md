# ĐÁNH GIÁ CODE HIỆN TẠI & ĐỀ XUẤT SỬA — Salon Booking (MERN)

> File này tổng hợp review code trong `PhanMem.zip` bạn gửi. Phần "YÊU CẦU SỬA" ở dưới có thể copy gửi thẳng cho agent.

---

## 1. Đánh giá tổng quan

Code hiện tại đã triển khai đúng theo 2 đặc tả trước đó (`Spec_Auth_UI_React.md`, `Spec_Booking_OTP_QR.md`):

- **Backend**: Express + Mongoose, cấu trúc `controllers/services/models/routes/middlewares` rõ ràng, tách riêng `services/patterns/` cho 4 pattern.
- **Frontend**: React + React Router, có `AuthContext`, `apiClient` (axios instance), các trang Booking/OTP/CheckIn/MyAppointments.
- **4 Design Pattern đã lên đúng chỗ**:
  - `appointmentState.js` — **State Pattern**, có bảng `allowedTransitions` chặn chuyển trạng thái sai, đúng tinh thần pattern.
  - `bookingValidationChain.js` — **Chain of Responsibility**, 4 handler nối tiếp (`ServiceActive → StaffCanDoService → SlotAvailable → WorkingHours`), code sạch, dễ giải thích trong báo cáo.
  - `otpStrategies.js` — **Strategy Pattern**, `ConsoleOtpStrategy`/`EmailOtpStrategy` cùng interface `sendOtp()`.
  - `appointmentEvents.js` — **Observer Pattern**, dùng `EventEmitter` của Node, tách notification khỏi logic đặt lịch.
  - Frontend: `apiClient.js` (**Singleton**), `useAuth()` trong `AuthContext.js` (**Facade** + **Observer**) — đều có comment giải thích rõ, rất tốt cho phần báo cáo pattern.

→ Nhìn chung code **chất lượng tốt hơn mức trung bình đồ án sinh viên**, đáng khen. Dưới đây là các vấn đề cần sửa trước khi mở rộng thêm.

## 2. Lỗi/thiếu sót cần sửa (ưu tiên cao)

### 🔴 Bug 1 — Không check trùng lịch khi khách chọn "Bất kỳ stylist"

Trong `bookingValidationChain.js`, `SlotAvailableHandler` chỉ kiểm tra trùng giờ **khi có `ctx.staff`**:
```js
async handle(ctx) {
  if (!ctx.staff) return super.handle(ctx);   // ← bỏ qua hoàn toàn việc check trùng lịch
  ...
}
```
Nếu khách không chọn stylist cụ thể (chọn "Bất kỳ"), hệ thống **không kiểm tra gì cả** — có thể nhận vô số lịch hẹn trùng giờ nhau. Đây là lỗi nghiệp vụ nghiêm trọng nhất trong code hiện tại, cần sửa gấp vì đây chính là luồng lõi của đồ án.

**Hướng sửa**: khi không chọn stylist, cần kiểm tra tổng số lịch hẹn trùng khung giờ không vượt quá số stylist đang rảnh (hoặc đơn giản hơn cho đồ án: giới hạn số lịch "bất kỳ" tối đa trùng giờ theo 1 config `MAX_CONCURRENT_ANY = N`).

### 🔴 Bug 2 — Thiếu kiểm soát quyền khi đổi trạng thái lịch hẹn

Trong `appointmentController.js`, hàm `updateStatus` chỉ kiểm tra quyền khi `status === 'cancelled'`:
```js
if (req.body.status === 'cancelled' && !isOwner && req.user.role !== 'admin') { ... }
// các status khác (confirmed, checked_in, in_progress, completed) không hề bị chặn
```
Nghĩa là **khách hàng tự đăng nhập có thể gọi API tự chuyển lịch hẹn của mình thành `completed`** mà không cần nhân viên xác nhận gì cả. Đây là lỗ hổng phân quyền.

**Hướng sửa**: chỉ cho phép `customer` thực hiện `cancelled`; các trạng thái còn lại (`checked_in`, `in_progress`, `completed`) chỉ `staff`/`admin` mới được đổi — dùng `requireRole('staff', 'admin')` cho các trường hợp đó, hoặc kiểm tra role ngay trong controller.

### 🟡 Bug 3 — Nút "Gửi lại mã OTP" không hoạt động thật

Trong `OtpPage.jsx`, nút gửi lại chỉ reset đồng hồ đếm ngược trên UI:
```js
onClick={()=>setResendLeft(30)}
```
Không hề gọi API để backend sinh mã OTP mới. Nếu khách hết hạn OTP và bấm "Gửi lại", họ sẽ không nhận được mã mới nào — chỉ thấy đồng hồ chạy lại.

**Hướng sửa**: thêm endpoint `POST /api/appointments/:id/resend-otp` ở backend (tái sử dụng logic sinh OTP trong `appointmentService.js`), và gọi API đó thật sự trong `OtpPage.jsx`.

### 🟡 Bug 4 — WorkingHoursHandler chỉ kiểm tra giờ bắt đầu

```js
const h = ctx.startTime.getHours();
if (h < 8 || h >= 20) throw ...
```
Nếu khách đặt dịch vụ dài (VD: uốn tóc 90 phút) lúc 19h30, giờ bắt đầu vẫn hợp lệ nhưng lịch sẽ **kết thúc sau giờ đóng cửa**. Nên kiểm tra thêm `ctx.endTime`.

## 3. Chưa triển khai (đúng như kế hoạch, chỉ để bạn theo dõi tiến độ)

Các nhóm chức năng sau mới chỉ là trang placeholder (`AdminPlaceholder` trong `App.js`), chưa có logic thật:
- Quản lý dịch vụ, nhân viên, khách hàng, phân quyền
- Báo cáo doanh thu
- Thanh toán, Đánh giá, Thông báo (mới có console.log giả lập trong Observer)

→ Đúng theo timeline đã bàn (Auth + Booking/OTP/QR làm trước), không phải lỗi — chỉ nêu để bạn theo dõi việc còn lại.

## 4. Vài điểm nhỏ nên chỉnh khi rảnh

| Vấn đề | Đề xuất |
|---|---|
| `JWT_SECRET` có fallback cứng `'dev_secret'` trong code (`authController.js`, `authMiddleware.js`) | Không ảnh hưởng lúc chạy local, nhưng nên luôn đọc từ `.env` — nếu ai quên set biến môi trường sẽ không báo lỗi rõ ràng |
| Response field không đồng nhất (chỗ trả `appointments`, chỗ trả `data`) | Frontend đang phải viết `res.appointments || res.data` ở nhiều nơi để phòng hờ — nên thống nhất 1 kiểu response duy nhất cho toàn bộ API |
| `checkIn()` giới hạn cứng "sớm 60 phút / trễ 120 phút" trong code | Nên đưa ra `.env` (`CHECKIN_EARLY_MINUTES`, `CHECKIN_LATE_MINUTES`) để dễ chỉnh khi demo mà không cần sửa code |

---

## YÊU CẦU SỬA (copy gửi agent)

Dự án hiện tại (MERN, cấu trúc `backend/` + `src/` React) có các vấn đề sau cần sửa, giữ nguyên toàn bộ cấu trúc và pattern hiện có, chỉ sửa đúng phần liên quan:

1. **Sửa `backend/services/patterns/bookingValidationChain.js`**: `SlotAvailableHandler` hiện bỏ qua kiểm tra trùng lịch khi `ctx.staff` là null (trường hợp khách chọn "Bất kỳ stylist"). Cần bổ sung logic: khi không chọn stylist cụ thể, đếm số lịch hẹn đang ở trạng thái `pending_otp/confirmed/checked_in/in_progress` trùng khung giờ (`startTime < endTime` và `endTime > startTime` của lịch mới) mà cũng không có `staffId` cụ thể, và so sánh với số lượng stylist đang active (`User.countDocuments({ role: 'staff', isActive: true })`) — nếu số lịch trùng giờ ≥ số stylist rảnh thì từ chối với lỗi "Khung giờ này đã kín, vui lòng chọn giờ khác hoặc chọn stylist cụ thể".

2. **Sửa `backend/controllers/appointmentController.js`**, hàm `updateStatus`: hiện chỉ kiểm tra quyền khi `status === 'cancelled'`. Cần bổ sung: các trạng thái `checked_in`, `in_progress`, `completed` chỉ cho phép `req.user.role` là `staff` hoặc `admin` thực hiện, trả lỗi 403 nếu không đủ quyền. Trạng thái `cancelled` giữ nguyên logic hiện tại (chủ lịch hẹn hoặc admin).

3. **Thêm endpoint resend OTP**:
   - Backend: thêm hàm `resendOtp(id)` trong `appointmentService.js` (tái sử dụng logic sinh OTP mới, cập nhật `otpCode`, `otpExpiresAt`, reset `otpAttempts` về 0, chỉ cho phép khi `status === 'pending_otp'`), thêm route `POST /api/appointments/:id/resend-otp` (có `requireAuth`) và controller tương ứng.
   - Frontend: trong `src/services/appointmentService.js` thêm hàm gọi endpoint trên; trong `OtpPage.jsx`, nút "Gửi lại mã" gọi hàm này thật sự thay vì chỉ reset state `resendLeft`, và hiển thị `demoOtp` mới nếu backend trả về (môi trường development).

4. **Sửa `WorkingHoursHandler`** trong `bookingValidationChain.js`: kiểm tra thêm giờ kết thúc `ctx.endTime.getHours()` (và trường hợp kết thúc đúng lúc `20:00` thì hợp lệ, sau đó thì không), không chỉ kiểm tra giờ bắt đầu.

5. Giữ nguyên toàn bộ comment giải thích Design Pattern đã có trong code, cập nhật/bổ sung comment nếu logic mới ảnh hưởng đến cách pattern đó hoạt động.

6. Sau khi sửa xong, liệt kê ngắn gọn các thay đổi đã thực hiện ở cuối câu trả lời.
