# ĐẶC TẢ YÊU CẦU — GIAO DIỆN ĐĂNG NHẬP & ĐĂNG KÝ (React / MERN)

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

Dự án chạy ở môi trường **local development** (FE: `localhost:3000`, BE: `localhost:5000`). Đây là đồ án môn học, ưu tiên code **rõ ràng, dễ đọc, dễ giải thích** hơn là tối ưu hiệu năng.

Hệ thống có **3 vai trò người dùng**: `customer` (khách hàng), `staff` (nhân viên/stylist), `admin` (quản lý).

### Nhiệm vụ

Xây dựng **module Authentication phía Frontend (React)** gồm 2 màn hình: **Đăng ký** và **Đăng nhập**. Chỉ làm phần Frontend, giả định Backend API đã có sẵn theo hợp đồng API mô tả bên dưới.

### Yêu cầu chức năng

**1. Màn hình Đăng ký (`/register`)**

Form gồm các trường:

| Trường | Kiểu | Bắt buộc | Ràng buộc |
|---|---|---|---|
| Họ và tên | text | Có | 2–50 ký tự |
| Email | email | Có | Đúng định dạng email |
| Số điện thoại | tel | Có | 10 chữ số, bắt đầu bằng `0` |
| Mật khẩu | password | Có | Tối thiểu 6 ký tự, có ít nhất 1 chữ và 1 số |
| Xác nhận mật khẩu | password | Có | Phải trùng với Mật khẩu |

- Tài khoản đăng ký từ màn hình này **mặc định có role là `customer`** (không cho người dùng tự chọn role).
- Có nút hiện/ẩn mật khẩu (toggle icon con mắt).
- Có link chuyển sang trang Đăng nhập.
- Đăng ký thành công → hiển thị thông báo và **tự động chuyển hướng sang trang Đăng nhập**.

**2. Màn hình Đăng nhập (`/login`)**

Form gồm:

| Trường | Kiểu | Bắt buộc |
|---|---|---|
| Email | email | Có |
| Mật khẩu | password | Có |

- Có checkbox "Ghi nhớ đăng nhập".
- Có nút hiện/ẩn mật khẩu.
- Có link chuyển sang trang Đăng ký.
- Có link "Quên mật khẩu?" (chỉ cần để placeholder, **chưa cần implement chức năng**).
- Đăng nhập thành công → lưu JWT token + thông tin user, sau đó **điều hướng theo role**:
  - `customer` → `/` (trang chủ khách hàng)
  - `staff` → `/admin/appointments` (trang quản lý lịch hẹn)
  - `admin` → `/admin/dashboard`

**3. Validation**

- Validate **phía client** trước khi gửi request (không để gửi request rỗng/sai định dạng lên server).
- Hiển thị lỗi **ngay dưới từng trường** tương ứng, bằng **tiếng Việt**.
- Validate khi người dùng rời khỏi trường (`onBlur`) và khi submit.
- Nút Submit **bị disable** khi form chưa hợp lệ hoặc đang trong quá trình gửi request.

**4. Xử lý trạng thái**

- Hiển thị trạng thái **loading** trên nút submit khi đang gọi API (VD: spinner + chữ "Đang xử lý...").
- Hiển thị **lỗi từ server** (VD: "Email đã tồn tại", "Sai email hoặc mật khẩu") ở đầu form dưới dạng alert.
- Xử lý trường hợp **mất kết nối mạng / server không phản hồi** với thông báo phù hợp.

### Hợp đồng API (giả định Backend đã có)

```
POST /api/auth/register
Request body:
{
  "fullName": "Nguyễn Văn A",
  "email": "a@example.com",
  "phone": "0901234567",
  "password": "abc123"
}

Response 201:
{
  "success": true,
  "message": "Đăng ký thành công"
}

Response 400/409:
{
  "success": false,
  "message": "Email đã được sử dụng"
}
```

```
POST /api/auth/login
Request body:
{
  "email": "a@example.com",
  "password": "abc123"
}

Response 200:
{
  "success": true,
  "token": "<jwt_token>",
  "user": {
    "id": "...",
    "fullName": "Nguyễn Văn A",
    "email": "a@example.com",
    "role": "customer"
  }
}

Response 401:
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng"
}
```

### Yêu cầu kỹ thuật

**Stack & thư viện được phép dùng:**
- React 18+ với **function component + hooks** (không dùng class component)
- `react-router-dom` cho routing
- `axios` cho gọi API
- **Tailwind CSS** cho styling
- Context API cho quản lý trạng thái đăng nhập (**không dùng Redux**)

**Cấu trúc thư mục yêu cầu:**

```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   ├── LoginForm.jsx
│       │   ├── RegisterForm.jsx
│       │   └── PasswordInput.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       ├── hooks/
│       │   └── useAuth.js
│       └── validators/
│           └── authValidators.js
├── components/
│   └── common/
│       ├── Button.jsx
│       ├── Input.jsx
│       └── Alert.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   ├── apiClient.js        (axios instance + interceptor gắn JWT)
│   └── authService.js      (hàm register, login)
└── App.jsx
```

**Yêu cầu về Design Pattern (quan trọng — đây là đồ án môn Mẫu thiết kế phần mềm):**

Code cần thể hiện rõ các pattern sau, kèm **comment giải thích ngắn gọn** tại vị trí áp dụng:

1. **Facade Pattern** — custom hook `useAuth()` đóng gói toàn bộ logic xác thực (gọi API, lưu token, cập nhật context, điều hướng) thành interface đơn giản cho component sử dụng. Component chỉ cần gọi `login(email, password)` mà không cần biết bên trong làm gì.

2. **Strategy Pattern** — file `authValidators.js` định nghĩa các hàm validate độc lập (validateEmail, validatePhone, validatePassword...), mỗi hàm là một "chiến lược" kiểm tra riêng, có thể thay thế/thêm mới mà không sửa code form.

3. **Observer Pattern** — `AuthContext` đóng vai trò subject, các component subscribe vào trạng thái đăng nhập và tự động re-render khi trạng thái thay đổi.

4. **Singleton Pattern** — `apiClient.js` export một **instance axios duy nhất** dùng chung toàn app, đã cấu hình sẵn `baseURL` và interceptor gắn JWT vào header.

### Yêu cầu giao diện

- **Phong cách**: hiện đại, sạch sẽ, phù hợp ngành làm đẹp/salon — tông màu ấm (VD: hồng pastel / nâu / kem) hoặc tối giản đen-trắng-vàng đồng.
- **Bố cục**: form căn giữa màn hình, có card bo góc, đổ bóng nhẹ. Có thể chia đôi màn hình (bên trái ảnh minh họa salon, bên phải form) trên desktop.
- **Responsive**: hoạt động tốt trên mobile (≥320px), tablet và desktop.
- **Tiếng Việt** cho toàn bộ label, placeholder, thông báo lỗi.
- Có logo/tên thương hiệu đơn giản ở đầu form (dùng text placeholder, VD: "Salon Booking").

### Đầu ra mong muốn

1. Code đầy đủ cho **tất cả các file** trong cấu trúc thư mục ở trên.
2. Code có **comment tiếng Việt** giải thích các phần quan trọng, đặc biệt là vị trí áp dụng Design Pattern.
3. Hướng dẫn ngắn gọn cách cài đặt và chạy (các package cần `npm install`).
4. Nếu có phần nào chưa rõ hoặc cần giả định, hãy **nêu rõ giả định đã dùng** ở cuối câu trả lời.

*(kết thúc phần PROMPT)*

---

## GHI CHÚ CHO NHÓM (không gửi cho agent)

### Cách dùng file này

- Copy toàn bộ phần **PROMPT** ở trên gửi cho agent (Claude Code, Cursor, v.v.).
- Nếu agent trả về code quá dài bị cắt giữa chừng, chia nhỏ yêu cầu: lần 1 yêu cầu `AuthContext` + `apiClient` + `authService`, lần 2 yêu cầu các component form.

### Những chỗ cần thống nhất với backend trước khi code

| Vấn đề | Cần hỏi backend |
|---|---|
| Tên field trong request/response | `fullName` hay `name`? `phone` hay `phoneNumber`? |
| Format response | Có bọc trong `{ success, data }` không, hay trả thẳng object? |
| Mã lỗi | Email trùng trả 400 hay 409? |
| Token | Thời hạn bao lâu? Có refresh token không? (khuyến nghị: **chưa cần refresh token** cho đồ án) |

Nếu backend chưa xong, cứ code FE theo hợp đồng API ở trên trước, rồi điều chỉnh sau — đây là cách làm chuẩn để FE và BE chạy song song, không chờ nhau.

### Lưu ý về bảo mật (để trả lời khi thầy hỏi)

- Lưu JWT trong `localStorage` là cách **đơn giản nhất** và đủ dùng cho đồ án, nhưng có rủi ro XSS. Cách an toàn hơn là dùng `httpOnly cookie`.
- Nếu thầy hỏi, cứ trả lời thẳng: chọn `localStorage` vì phạm vi đồ án chạy local, và nêu rõ đã biết trade-off này. Đây là câu trả lời tốt hơn là giả vờ không biết.

### Liên kết với tài liệu SEP

Sau khi có code, nhớ cập nhật các tài liệu sau cho **khớp**:

- **FunctionList**: F1.1 Đăng ký, F1.2 Đăng nhập
- **TestCase**: viết test case cho 2 chức năng này (đây là 2 chức năng nên làm test đầy đủ vì đơn giản, dễ viết)
- **ArchitectureDesign**: bổ sung mô tả luồng xác thực (React → AuthContext → authService → API)
- **TraceabilityMatrix**: nối F1.1/F1.2 với test case tương ứng
