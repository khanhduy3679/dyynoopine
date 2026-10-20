# YÊU CẦU SỬA — Khôi phục Check-in QR + Chuẩn hóa thiết kế UI

> Copy toàn bộ nội dung bên dưới gửi cho agent. Đây là 2 việc độc lập, gộp chung 1 lần gửi.

---

## PHẦN 1 — Khôi phục tính năng Check-in QR và dọn dẹp code thừa

Hiện tại `src/pages/CheckInPage.jsx` vẫn còn trong source nhưng **không được import ở bất kỳ đâu** trong `App.jsx` — tính năng quét mã QR check-in đang không thể truy cập được từ giao diện. Cần sửa:

1. Mở `src/pages/Appointments.jsx` (trang quản lý lịch hẹn khu vực admin/staff), thêm 1 khu vực/tab mới tên **"Check-in"**, chuyển logic từ `CheckInPage.jsx` vào đây: ô nhập/dán mã `qrToken`, nút xác nhận gọi `appointmentService.checkIn(qrToken)`, hiển thị kết quả (tên khách, dịch vụ, giờ hẹn) hoặc lỗi tương ứng (mã không hợp lệ, chưa đến giờ, đã check-in rồi...) — giữ nguyên toàn bộ logic xử lý lỗi đã có trong `CheckInPage.jsx` cũ, chỉ chuyển vị trí hiển thị.
2. Sau khi chuyển xong và xác nhận `Appointments.jsx` đã có đầy đủ chức năng check-in, xóa file `src/pages/CheckInPage.jsx` (không còn cần thiết vì đã gộp vào Appointments).
3. Xóa file thừa `src/index.css.bak`.
4. (Tùy chọn, không bắt buộc) Nếu muốn giữ đúng cấu trúc đã thống nhất trước đó, có thể tách phần đăng ký trong `Login.jsx` ra thành `src/components/Register.jsx` riêng — nhưng không bắt buộc nếu logic đăng ký hiện tại (gọi `register()` thật qua `useAuth()`) đã chạy đúng, vì đây chỉ là khác biệt về tổ chức file, không phải lỗi chức năng.

## PHẦN 2 — Chuẩn hóa thiết kế UI theo quy tắc đã thống nhất

Rà soát toàn bộ file CSS (`src/index.css`) và các component có style inline trong dự án, sửa lại theo đúng quy tắc thiết kế: **không gradient, không glassmorphism, không card lồng card, hạn chế tối đa box-shadow, chỉ dùng 1 font-family duy nhất**. Cụ thể:

1. **Xóa toàn bộ gradient** (`linear-gradient`/`radial-gradient`) ở mọi nơi, thay bằng màu đặc (solid color) tương ứng — giữ tông màu nâu/vàng đồng hiện tại của salon nhưng không dùng hiệu ứng chuyển màu. Các vị trí cần sửa: `src/index.css` (dòng ~70, 90, 96, 612, 945, 956), `src/components/Login.jsx` (class `auth-hero-gradient`), `src/pages/Reports.jsx` (màu cột biểu đồ doanh thu).

2. **Xóa hiệu ứng `backdrop-filter: blur()`** đang dùng cho phần hero ở trang đăng nhập (`src/index.css`, khoảng dòng 925) — thay bằng nền màu đặc có độ mờ (opacity) nếu cần lớp phủ, không dùng hiệu ứng kính mờ.

3. **Sửa hiện tượng card lồng card**: các trang `Booking.jsx`, `Customers.jsx`, `Services.jsx`, `Staff.jsx` đang dùng class `.auth-card` làm modal đặt chồng lên cấu trúc card đã có sẵn của trang. Tách phần modal này ra thành 1 component `Modal.jsx` dùng chung (`src/components/Modal.jsx`), hiển thị dạng lớp phủ (overlay) phía trên toàn trang thay vì lồng trực tiếp vào cấu trúc card hiện có. Áp dụng component `Modal.jsx` này cho tất cả các chỗ đang dùng `.auth-card` làm modal.

4. **Giảm box-shadow về tối đa 1 mức dùng chung**: định nghĩa 1 biến CSS duy nhất, ví dụ:
   ```css
   :root {
     --shadow-soft: 0 1px 2px rgba(0,0,0,0.06);
   }
   ```
   Chỉ áp dụng `var(--shadow-soft)` cho các phần tử thực sự cần nổi lên (modal vừa tách ở mục 3, dropdown nếu có). Toàn bộ các khai báo `box-shadow` còn lại trong `src/index.css` (hiện có ở khoảng dòng 216, 369, 420, 438, 521, 793, 824, 986, 1029) chuyển sang dùng `border: 1px solid` với màu border phù hợp theo tông màu hiện tại, bỏ hẳn shadow.

5. **Thống nhất 1 font-family duy nhất cho toàn bộ ứng dụng**: giữ lại `'Be Vietnam Pro'` (đã khai báo ở gốc `body`/`:root`, dòng 37), xóa toàn bộ khai báo `font-family` riêng dùng `Georgia`/`Cambria`/`Times New Roman` (class `.font-display` và các nơi lặp lại ở dòng ~123, 139, 165, 226, 636, 797, 935, 960) và `'DM Mono'` (class `.font-mono` và các nơi lặp lại ở dòng ~135, 539, 647, 663) — để toàn bộ heading, số liệu, nội dung đều kế thừa font gốc từ `body`. Có thể xóa luôn 2 class `.font-display`/`.font-mono` nếu không còn nơi nào dùng tới.

### Sau khi sửa

- Kiểm tra lại toàn bộ giao diện không bị vỡ layout (các card vẫn phân tách rõ ràng bằng border/spacing dù không còn shadow/gradient).
- Liệt kê rõ: file nào đã sửa, file nào đã xóa, file nào tạo mới (`Modal.jsx` nếu có).
- Nếu phần nào trong yêu cầu chưa rõ hoặc cần giả định thêm, nêu rõ giả định đã dùng.
