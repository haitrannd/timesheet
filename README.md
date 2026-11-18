# Ứng dụng chấm công

Ứng dụng Next.js hiển thị bảng chấm công nhiều tháng từ các file JSON tĩnh. Giao diện ưu tiên điện thoại, người xem chỉ cần mở đường link. Không cần database, không có chức năng sửa dữ liệu trên website.

## Chạy local

Yêu cầu Node.js 20.9 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

## Cấu trúc dữ liệu nhiều tháng

Dữ liệu nằm trong `public/data/timesheets/`:

```text
public/data/timesheets/
  index.json
  2026-11.json
  2026-12.json
  2027-01.json
```

`index.json` khai báo tên bảng chấm công và những tháng sẽ xuất hiện trong bộ chọn:

```json
{
  "owner": "Bảng chấm công",
  "months": ["2026-11", "2026-12", "2027-01"]
}
```

Mỗi tháng là một file riêng, tên file theo định dạng `YYYY-MM.json`. Ví dụ `2026-11.json`:

```json
{
  "owner": "Bảng chấm công",
  "year": 2026,
  "month": 11,
  "days": [
    { "date": "2026-11-13", "shift1": "08:30 - 11:30", "shift2": "14:00 - 19:30" },
    { "date": "2026-11-14", "shift1": "08:00 - 12:00" }
  ]
}
```

- `year`: năm; `month`: tháng từ 1 đến 12.
- `date`: ngày theo định dạng `YYYY-MM-DD` và phải thuộc đúng tháng/năm của file.
- `shift1`, `shift2`: chuỗi `HH:mm - HH:mm`. Có thể chỉ nhập một ca.
- Ngày không có ca làm hoặc không có bản ghi sẽ tự động ẩn khỏi giao diện. Nếu tháng chưa có dữ liệu, app hiển thị thông báo thay vì danh sách ngày trống.
- Thứ tự tháng trong bộ chọn tự sắp xếp mới nhất lên đầu; thêm tháng vào `index.json` để tháng đó xuất hiện.
- Tổng giờ tự tính, không cần nhập tổng thủ công. Ca qua nửa đêm được hỗ trợ, ví dụ `22:00 - 02:00` tính 4 giờ.

## Thêm tháng mới

1. Tạo file mới trong `public/data/timesheets/`, ví dụ `2026-12.json`.
2. Nhập `year`, `month` và các ngày có dữ liệu.
3. Thêm chuỗi `"2026-12"` vào mảng `months` trong `public/data/timesheets/index.json`.
4. Commit và push lên GitHub. Nếu repo đã kết nối Vercel, website tự deploy lại.

Không cần sửa code khi sang tháng mới. Giữ các file tháng cũ để có thể xem lại lịch sử.

## Deploy Vercel

1. Push toàn bộ source lên GitHub.
2. Import repository vào Vercel (hoặc để Vercel tự deploy nếu repo đã kết nối).
3. Giữ cấu hình Next.js mặc định và deploy.

## Lưu ý

Đây là website chỉ xem. Các file JSON trong `public` được phục vụ công khai cho người có đường link; không đưa thông tin bí mật vào đó. Mỗi lần cập nhật dữ liệu cần commit lên GitHub và chờ Vercel deploy xong.
