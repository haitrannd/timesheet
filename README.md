# Ứng dụng chấm công

Ứng dụng Next.js hiển thị bảng chấm công theo tháng từ JSON tĩnh. Giao diện mobile-first, người xem chỉ cần mở đường link, không cần cài Google Sheets.

## Chạy local

Yêu cầu Node.js 20.9 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

## Cập nhật dữ liệu

Chỉnh `data/timesheet.json`, commit và push lên GitHub. Nếu repository đã kết nối Vercel, Vercel sẽ tự build/deploy lại.

```json
{
  "owner": "Bảng chấm công",
  "year": 2026,
  "month": 11,
  "days": [
    { "date": "2026-11-13", "shift1": "08:30 - 11:30", "shift2": "14:00 - 19:30" }
  ]
}
```

- `year`: năm; `month`: tháng 1–12.
- `date`: ngày theo `YYYY-MM-DD`.
- `shift1`, `shift2`: chuỗi `HH:mm - HH:mm`.
- Có thể bỏ trống ca hoặc bỏ ngày không có dữ liệu; giao diện vẫn hiển thị đủ số ngày trong tháng.
- Tổng giờ tự tính, không lưu tổng thủ công trong JSON.
- Ca qua nửa đêm được hỗ trợ, ví dụ `22:00 - 02:00` tính 4 giờ.

## Deploy Vercel

1. Tạo repository GitHub mới và upload toàn bộ thư mục dự án.
2. Đăng nhập Vercel → Add New → Project → Import repository.
3. Giữ cấu hình Next.js mặc định và chọn Deploy.
4. Gửi URL `*.vercel.app` cho người xem.

## Cập nhật hàng tháng

1. Mở `data/timesheet.json` trên GitHub.
2. Sửa `year`, `month` và các bản ghi trong `days`.
3. Commit changes; Vercel tự deploy phiên bản mới.

## Lưu ý

Đây là website chỉ xem. Dữ liệu JSON được đóng gói trong bản deploy; người xem không sửa được. Mỗi lần cập nhật cần commit lên GitHub và chờ Vercel deploy xong. Không đưa thông tin bí mật vào JSON vì dữ liệu hiển thị công khai cho bất kỳ ai có link.
