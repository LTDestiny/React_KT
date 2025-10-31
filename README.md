# EXPENSE TRACKER - Ứng dụng Quản lý Chi tiêu

**Sinh viên:** Lê Thiên Định - 22716761

## Tính năng

### ✅ Câu 1: Giao diện và Cấu trúc (1đ)
- [x] Toàn bộ app được bọc trong SafeAreaProvider
- [x] Màn hình chính sử dụng SafeAreaView và View
- [x] Tiêu đề: "EXPENSE TRACKER"
- [x] Thiết kế giao diện thân thiện, dễ sử dụng

### ✅ Câu 2: Tạo Item hiển thị Thu-Chi (1đ)
- [x] Hiển thị tên khoản chi (title)
- [x] Hiển thị số tiền (amount) với format VND
- [x] Hiển thị ngày tạo (createdAt)
- [x] Hiển thị loại (Thu / Chi) với màu sắc phân biệt

### ✅ Câu 3: Thêm công việc mới vào SQLite (1đ)
- [x] Chuyển sang AddScreen khi nhấn nút Add
- [x] Form nhập liệu đầy đủ
- [x] Lưu vào SQLite khi nhấn Save
- [x] Clear form sau khi thêm (sử dụng useRef)

### ✅ Câu 4: Cập nhật công việc (1đ)
- [x] Nhấn vào item để mở EditScreen
- [x] Sửa thông tin và nhấn Save
- [x] Cập nhật vào SQLite và refresh danh sách

### ✅ Câu 5: Xóa Item (1đ)
- [x] Long press để hiển thị menu xóa
- [x] Xác nhận trước khi xóa
- [x] TrashScreen hiển thị các item đã xóa

### ✅ Câu 6: Chức năng tìm kiếm (1đ)
- [x] Tìm kiếm trong danh sách thu chi
- [x] Tìm kiếm trong thùng rác

### ✅ Câu 7: Refresh danh sách (0.5đ)
- [x] Pull to refresh với RefreshControl
- [x] Refresh gọi lại function GET

### ✅ Câu 8: Khôi phục (0.5đ)
- [x] Long press trong TrashScreen để restore
- [x] Khôi phục item về danh sách chính

### ✅ Câu 9: Đồng bộ (1đ)
- [x] Nút đồng bộ xóa toàn bộ data API
- [x] Copy dữ liệu local lên API
- [x] Cho phép paste link MockAPI

### ✅ Câu 10: Phân loại Thu/Chi (1đ)
- [x] Thanh chọn: Tất cả / Thu / Chi
- [x] Lọc danh sách theo loại đã chọn

### ✅ Câu 11: Biểu đồ thống kê (0.5đ)
- [x] StatisticsScreen với biểu đồ
- [x] Hiển thị tổng thu - chi theo tháng

### ⏳ Câu 12: EAS Build (0.5đ)
- [ ] Build preview với EAS
- [ ] File text chứa link download

## Cài đặt

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn
- Expo CLI
- Expo Go app (cho testing)

### Các bước cài đặt

1. **Cài đặt dependencies:**
```bash
cd expense-tracker
npm install
```

2. **Chạy ứng dụng:**
```bash
npm start
```

3. **Chạy trên thiết bị:**
- iOS: Quét QR code bằng Camera
- Android: Quét QR code bằng Expo Go app

## Build với EAS

1. **Cài đặt EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Login vào Expo:**
```bash
eas login
```

3. **Configure project:**
```bash
eas build:configure
```

4. **Build preview:**
```bash
eas build --platform android --profile preview
```

## Cấu trúc dự án

```
expense-tracker/
├── src/
│   ├── components/       # React components
│   │   └── ExpenseItem.tsx
│   ├── database/        # SQLite database
│   │   └── database.ts
│   ├── screens/         # Màn hình
│   │   ├── MainScreen.tsx
│   │   ├── AddExpenseScreen.tsx
│   │   ├── EditExpenseScreen.tsx
│   │   ├── TrashScreen.tsx
│   │   ├── StatisticsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── utils/           # Utilities
├── App.tsx              # Root component
├── app.json             # Expo config
├── eas.json             # EAS build config
├── package.json
└── tsconfig.json
```

## Công nghệ sử dụng

- **React Native** - Framework
- **TypeScript** - Ngôn ngữ
- **Expo** - Development platform
- **expo-sqlite** - Local database
- **React Navigation** - Navigation
- **react-native-chart-kit** - Charts
- **axios** - HTTP client
- **MockAPI.io** - API backend

## Hướng dẫn sử dụng MockAPI

1. Truy cập https://mockapi.io/
2. Tạo project mới
3. Tạo resource "expenses" với schema:
   - title (text)
   - amount (number)
   - type (text)
   - createdAt (text)
4. Copy endpoint URL
5. Paste vào Settings screen trong app
6. Nhấn "Đồng bộ lên API"

## License

MIT
