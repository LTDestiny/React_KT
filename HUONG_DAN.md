# Hướng dẫn cài đặt và chạy EXPENSE TRACKER

## Bước 1: Cài đặt dependencies

Mở PowerShell hoặc Command Prompt và chạy:

```bash
cd t:\22716761_LeThienDinh_M55\expense-tracker
npm install
```

## Bước 2: Chạy ứng dụng

```bash
npm start
```

Hoặc:

```bash
npx expo start
```

## Bước 3: Chạy trên thiết bị

### Android:
1. Cài đặt "Expo Go" từ Google Play Store
2. Quét QR code từ terminal

### iOS:
1. Cài đặt "Expo Go" từ App Store
2. Quét QR code bằng Camera app

## Bước 4: Build với EAS (Câu 12)

### Cài đặt EAS CLI:
```bash
npm install -g eas-cli
```

### Login vào Expo:
```bash
eas login
```

### Build preview:
```bash
eas build --platform android --profile preview
```

## Giải quyết lỗi thường gặp

### Lỗi "running scripts is disabled"
Chạy PowerShell với quyền Admin và thực thi:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Lỗi "Metro bundler"
```bash
npx expo start --clear
```

### Lỗi SQLite
- Đảm bảo đã cài expo-sqlite
- Restart Expo server

## Commit Git

Sau mỗi câu hoàn thành:

```bash
git add .
git commit -m "Hoàn thành Câu [số câu]: [mô tả]"
```

## Checklist

- [ ] Câu 1: Giao diện và Cấu trúc
- [ ] Câu 2: Tạo Item hiển thị Thu-Chi
- [ ] Câu 3: Thêm vào SQLite
- [ ] Câu 4: Cập nhật
- [ ] Câu 5: Xóa Item
- [ ] Câu 6: Tìm kiếm
- [ ] Câu 7: Refresh
- [ ] Câu 8: Khôi phục
- [ ] Câu 9: Đồng bộ
- [ ] Câu 10: Filter
- [ ] Câu 11: Biểu đồ
- [ ] Câu 12: EAS Build

## Chụp màn hình

Nhớ chụp màn hình sau mỗi câu với:
- Full màn hình
- Có ngày giờ hiển thị
- Chạy thử tất cả tính năng của câu đó
