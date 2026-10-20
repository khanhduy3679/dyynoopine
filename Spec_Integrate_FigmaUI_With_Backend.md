# ĐẶC TẢ YÊU CẦU — TÍCH HỢP GIAO DIỆN FIGMA MAKE VỚI BACKEND THẬT

> Dùng file này làm prompt gửi cho AI agent. Copy toàn bộ phần "PROMPT" bên dưới.
> Phần "GHI CHÚ CHO NHÓM" ở cuối là để bạn tham khảo, **không cần gửi cho agent**.

---

## PROMPT (copy từ đây)

### Bối cảnh — ĐỌC KỸ TRƯỚC KHI SỬA

Dự án MERN hiện tại đang ở trạng thái **xung đột giữa 2 phiên bản frontend**:

1. **Bản cũ (đã hoạt động thật)**: `src/contexts/AuthContext.js` (Facade + Observer pattern), `src/App.js` dùng `react-router-dom`, các trang `src/pages/BookingPage.jsx`, `OtpPage.jsx`, `CheckInPage.jsx`, `MyAppointmentsPage.jsx`, `src/components/Register.jsx` — các trang này gọi API thật qua `src/services/authService.js`, `appointmentService.js`, `catalogService.js`, có JWT, có OTP, có QR check-in.

2. **Bản mới (giao diện từ Figma Make, chỉ là UI tĩnh)**: `src/App.jsx` (chú ý: đuôi `.jsx`, khác file `.js` cũ), `src/components/Sidebar.jsx`, `Header.jsx`, `Login.jsx` (đã bị ghi đè), và các trang `src/pages/Dashboard.jsx`, `Booking.jsx`, `Appointments.jsx`, `Customers.jsx`, `Staff.jsx`, `Services.jsx`, `Payments.jsx`, `Notifications.jsx`, `Reviews.jsx`, `Account.jsx`, `Reports.jsx`. Các trang này **chỉ đọc dữ liệu giả từ `src/data/mockData.js`**, không gọi API thật. `Login.jsx` hiện tại bấm nút là đăng nhập được ngay, không kiểm tra gì cả. `AuthContext.js` đã bị xóa, không còn được import ở đâu.

**Nhiệm vụ của bạn**: giữ lại **giao diện/bố cục đẹp** của bản Figma Make (Sidebar, Header, các trang quản lý), nhưng **nối nó vào hệ thống backend thật** đã hoạt động, đồng thời khôi phục lại phần Auth + Router + Pattern đã mất. Không được giữ nguyên trạng thái mock hiện tại.

### Cấu trúc ứng dụng sau khi sửa

Ứng dụng có **2 khu vực** dùng chung 1 hệ thống đăng nhập (JWT, 3 role: `customer`/`staff`/`admin`):

**A. Khu vực khách hàng (public, không có Sidebar/Header quản trị)**
- `/` — Trang chủ
- `/login`, `/register` — dùng layout đẹp của `Login.jsx` (Figma) nhưng **gọi API thật**
- `/booking` — wizard đặt lịch (dùng lại logic thật của `BookingPage.jsx` cũ — có thể làm lại giao diện đẹp hơn theo phong cách Figma, nhưng giữ nguyên logic gọi API + validate)
- `/appointments/:id/otp` — xác nhận OTP (dùng lại logic của `OtpPage.jsx`)
- `/my-appointments` — lịch hẹn của tôi, hiện mã QR (dùng lại logic của `MyAppointmentsPage.jsx`)

**B. Khu vực quản trị (protected, bắt buộc đăng nhập role `staff` hoặc `admin`, dùng Sidebar + Header của Figma làm layout chung)**
- `/admin/dashboard` — Dashboard
- `/admin/appointments` — Quản lý lịch hẹn (gồm cả chức năng check-in — tích hợp logic của `CheckInPage.jsx` cũ vào đây dưới dạng 1 tab/nút "Check-in bằng mã QR")
- `/admin/booking` — Tạo lịch hẹn nhanh tại quầy (trang `Booking.jsx` hiện tại — nhân viên lễ tân nhập SĐT khách, tạo lịch trực tiếp)
- `/admin/customers` — Quản lý khách hàng
- `/admin/staff` — Quản lý nhân viên
- `/admin/services` — Quản lý dịch vụ
- `/admin/payments` — Thanh toán
- `/admin/notifications` — Thông báo
- `/admin/reviews` — Đánh giá
- `/admin/reports` — Báo cáo doanh thu
- `/admin/account` — Tài khoản cá nhân

### Việc cần làm — chia theo thứ tự ưu tiên

**BƯỚC 1 — Khôi phục nền tảng (bắt buộc làm trước tiên)**

1. Khôi phục `src/contexts/AuthContext.js` y như bản cũ (Facade pattern qua `useAuth()`, Observer pattern qua Context), đảm bảo `login()` gọi `authService.login()` thật, lưu JWT, điều hướng theo role.
2. Sửa `src/index.js` để bọc `<BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>`.
3. Viết lại `src/App.jsx` dùng `<Routes>`/`<Route>` của `react-router-dom` theo đúng cấu trúc route ở trên, thay vì cơ chế `useState('dashboard')` hiện tại.
4. Tạo component `ProtectedRoute.jsx` trong `src/components/`: chặn truy cập `/admin/*` nếu chưa đăng nhập hoặc role không phải `staff`/`admin`, redirect về `/login`.
5. Tạo layout component `AdminLayout.jsx`: render `<Sidebar />` + `<Header />` + `<Outlet />` (dùng `react-router-dom` nested routes), để mọi trang `/admin/*` dùng chung layout mà không phải lặp code.
6. Khôi phục `src/components/Register.jsx` (bản cũ), nối route `/register`.
7. Sửa `Login.jsx`: xóa cơ chế giả (`onLogin()` không điều kiện), nối vào `useAuth().login(email, password, rememberMe)` thật — giữ nguyên giao diện/CSS hiện có, chỉ thay phần logic submit. Tab "Đăng ký" trong `Login.jsx` nên được tách ra dùng lại component `Register.jsx` đã khôi phục thay vì tự xử lý riêng.
8. Xóa các file thừa: `src/index.css.bak`, và sau khi xác nhận các trang `BookingPage.jsx`/`OtpPage.jsx`/`CheckInPage.jsx`/`MyAppointmentsPage.jsx` đã được dùng lại đúng route (bước A ở trên) thì không cần xóa — chúng chính là nguồn logic cho khu vực khách hàng, chỉ cần đảm bảo được `App.jsx` import và dùng tới.

**BƯỚC 2 — Nối các trang Figma UI đang mock vào API thật (theo đúng dữ liệu backend đã có)**

9. `Dashboard.jsx`: thay dữ liệu từ `mockData` bằng dữ liệu tổng hợp từ API thật đang có — số lịch hẹn hôm nay, theo trạng thái (gọi `GET /api/appointments` rồi tự tính toán ở frontend, chưa cần thêm endpoint thống kê riêng).
10. `Appointments.jsx` (trang quản lý lịch hẹn): nối vào `appointmentService.getAppointments()` thật (có filter theo ngày/trạng thái/nhân viên), các nút đổi trạng thái gọi `appointmentService.updateStatus()` thật. Thêm 1 khu vực "Check-in bằng mã QR" tái sử dụng logic từ `CheckInPage.jsx` cũ (ô nhập/quét `qrToken`, gọi `appointmentService.checkIn()`).
11. `Services.jsx`: nối vào `catalogService.getServices()` thật để hiển thị danh sách (ghi chú: backend hiện **chưa có** API tạo/sửa/xóa dịch vụ — xem BƯỚC 3).
12. `Booking.jsx` (đặt lịch nhanh tại quầy): giữ nguyên luồng tìm khách theo SĐT, nhưng phần tạo lịch hẹn cuối cùng phải gọi `appointmentService.createAppointment()` thật thay vì tạo object cục bộ như hiện tại (xem lưu ý về OTP trong BƯỚC 3, mục 16).
13. Các trang còn lại (`Customers.jsx`, `Staff.jsx`, `Payments.jsx`, `Notifications.jsx`, `Reviews.jsx`, `Reports.jsx`, `Account.jsx`): **tạm thời vẫn dùng `mockData`** cho bước này — vì backend chưa có API cho các nhóm này (xem BƯỚC 3). Không xóa `mockData.js`, chỉ ngừng dùng nó ở các trang đã có API thật (9-12).

**BƯỚC 3 — Bổ sung API backend còn thiếu (làm sau khi Bước 1-2 chạy ổn định)**

Các nhóm chức năng sau có giao diện nhưng **chưa có API backend tương ứng**, cần bổ sung model + route + controller (CRUD cơ bản là đủ, không cần pattern phức tạp — dùng chung 1 cấu trúc controller CRUD cho cả 4 nhóm để tiết kiệm thời gian):

14. **Customers** (`GET/PATCH /api/users?role=customer`, có thể tái dùng model `User` hiện có, không cần model riêng).
15. **Staff** (`GET/POST/PATCH/DELETE /api/users?role=staff`, dùng chung model `User`, thêm field nếu cần như `specialties`, `workSchedule`).
16. **Services** (`POST/PATCH/DELETE /api/services`, model `Service` đã có sẵn, chỉ thiếu route tạo/sửa/xóa — hiện tại `catalogRoutes.js` chỉ có `GET`).
17. **Payments**: thêm field `paymentStatus`/`paymentMethod` vào model `Appointment` (không cần model `Payment` riêng cho đồ án), route `PATCH /api/appointments/:id/payment`.
18. **Reviews**: model `Review` mới (`appointmentId`, `rating`, `comment`), route tạo review (customer, sau khi `status = completed`) + route list cho admin.
19. **Notifications**: tận dụng `appointmentEvents.js` (Observer pattern) đã có — khi có event `statusChanged`, lưu thêm 1 bản ghi vào collection `Notification` thay vì chỉ `console.log`, route `GET /api/notifications` cho admin xem danh sách.
20. **Reports**: route `GET /api/reports/revenue?from=&to=` tổng hợp từ `Appointment` (tổng doanh thu theo ngày/dịch vụ dựa trên `Service.price` của các lịch `completed`).

Khi API ở Bước 3 đã có, quay lại nối các trang `Customers.jsx`/`Staff.jsx`/`Payments.jsx`/`Notifications.jsx`/`Reviews.jsx`/`Reports.jsx` vào API thật, bỏ dần `mockData.js`.

### Lưu ý quan trọng khi sửa

- **Giữ nguyên toàn bộ 4 pattern backend đã có** (`appointmentState.js`, `bookingValidationChain.js`, `otpStrategies.js`, `appointmentEvents.js`) — không sửa trừ khi liên quan trực tiếp đến yêu cầu trên.
- **Giữ nguyên comment giải thích pattern** đã có trong code, bổ sung comment cho các pattern mới nếu Bước 3 có áp dụng (gợi ý: controller CRUD dùng chung cấu trúc là **Template Method pattern**, nên ghi chú rõ trong code).
- Giao diện (CSS/Tailwind classes) của bản Figma Make — **giữ nguyên gần như toàn bộ**, chỉ thay phần logic/data-fetching bên trong, không cần vẽ lại UI.
- Ở Bước 1 mục 16 (`Booking.jsx` tạo lịch tại quầy): vì backend hiện tại luôn bắt buộc xác nhận OTP khi tạo lịch (`createAppointment` → `status: pending_otp`), cần quyết định: nhân viên tạo lịch tại quầy có cần qua OTP không (thường là KHÔNG cần vì khách đang đứng trước mặt)? Nếu không cần, bổ sung tham số `skipOtp: true` trong `appointmentService.createAppointment()` khi người tạo (`req.user.role`) là `staff`/`admin`, bỏ qua bước OTP và tạo thẳng `status: confirmed`.

### Đầu ra mong muốn

1. Code đầy đủ cho các file cần sửa/tạo mới ở Bước 1 và Bước 2 (Bước 3 có thể làm ở lượt sau nếu khối lượng quá lớn cho 1 lần yêu cầu — agent có thể đề xuất chia nhỏ).
2. Sau khi sửa, liệt kê rõ: file nào đã sửa, file nào đã xóa, file nào giữ nguyên.
3. Nêu rõ giả định đã dùng nếu có phần chưa rõ trong đặc tả này (đặc biệt là quyết định về `skipOtp` ở trên).

*(kết thúc phần PROMPT)*

---

## GHI CHÚ CHO NHÓM (không gửi cho agent)

### Vì sao chia 3 bước thay vì làm 1 lần

Yêu cầu gộp UI Figma + backend thật + bổ sung API mới cho 6 nhóm chức năng là khối lượng rất lớn cho 1 lần prompt — agent dễ bị tràn context hoặc code lỗi rải rác khó kiểm tra. Khuyến nghị: **gửi Bước 1 trước, test chạy được (đăng nhập/đăng ký/đặt lịch/OTP/check-in thật) rồi mới gửi tiếp Bước 2, rồi Bước 3** — thay vì dán nguyên cả file cho agent làm 1 lượt.

### Việc cần làm thủ công sau khi agent sửa xong Bước 1

- Test lại đúng luồng: Đăng ký → Đăng nhập (role `customer`) → Đặt lịch → Nhập OTP (xem console backend) → Vào "Lịch hẹn của tôi" → thấy mã QR.
- Tạo thử 1 tài khoản `staff`/`admin` trực tiếp trong MongoDB (hoặc thêm tạm vào `seedData.js`) để test đăng nhập vào khu vực `/admin/*`.

### Về việc Bước 3 làm backend cho 6 nhóm còn lại

Đây đúng là phần việc đã bàn trước đó trong bảng phân loại 3 mức ưu tiên (nhóm "CRUD đơn giản" và "tối giản/giả lập") — không cần đầu tư pattern phức tạp cho các nhóm này, chỉ cần chạy được và khớp với tài liệu SEP.

### Liên kết với tài liệu SEP

Sau khi hoàn thành, cần cập nhật lại:
- **ArchitectureDesign**: bổ sung sơ đồ 2 khu vực (public/customer vs protected/admin), có `ProtectedRoute` và `AdminLayout`
- **FunctionList**: đánh dấu rõ nhóm nào đã có API thật, nhóm nào còn dùng mock (nếu nộp bài trước khi Bước 3 hoàn thành) để tránh bị hỏi khó khi demo
