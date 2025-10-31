# Hướng dẫn EAS Build - EXPENSE TRACKER

## Bước 1: Chuẩn bị

Đã hoàn thành:
- ✅ Cấu hình app.config.js với projectId
- ✅ Cấu hình eas.json với appVersionSource
- ✅ Thêm ITSAppUsesNonExemptEncryption cho iOS

## Bước 2: Build lại chỉ Android (Preview)

```bash
cd t:\22716761_LeThienDinh_M55\expense-tracker
eas build --profile preview --platform android
```

## Bước 3: Theo dõi build

Build sẽ chạy trên cloud của Expo. Thời gian: ~10-20 phút.

### Links theo dõi:
- Android: https://expo.dev/accounts/ltdestiny/projects/expense-tracker/builds
- Project: https://expo.dev/accounts/ltdestiny/projects/expense-tracker

## Bước 4: Download APK

Sau khi build thành công, link download APK sẽ xuất hiện trong:
1. Terminal
2. Email thông báo từ Expo
3. Expo dashboard: https://expo.dev/accounts/ltdestiny/projects/expense-tracker/builds

## Lỗi đã sửa

### ❌ Lỗi 1: Invalid UUID appId
**Nguyên nhân:** Chưa có projectId hợp lệ  
**Giải pháp:** Chạy `eas build:configure` để tạo project

### ❌ Lỗi 2: cli.appVersionSource not set
**Nguyên nhân:** Thiếu config trong eas.json  
**Giải pháp:** Thêm `"appVersionSource": "remote"` vào cli section

### ❌ Lỗi 3: ITSAppUsesNonExemptEncryption
**Nguyên nhân:** iOS yêu cầu khai báo encryption  
**Giải pháp:** Thêm vào ios.infoPlist trong app.config.js

## Lưu ý

- Profile "preview" build APK (Android) và simulator build (iOS)
- APK có thể cài trực tiếp trên thiết bị Android
- Không cần Google Play Store để cài APK preview

## Alternative: Build chỉ Android

Nếu không cần iOS, chỉ build Android:

```bash
eas build --profile preview --platform android
```

Sẽ nhanh hơn và tiết kiệm tài nguyên.
