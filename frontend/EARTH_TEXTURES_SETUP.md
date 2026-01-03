# Earth Textures Setup

Để sử dụng texture 8K thực tế, hãy làm theo các bước sau:

## 1. Tạo thư mục
```bash
mkdir -p public/textures
```

## 2. Download ảnh
Download 2 file từ Solar System Scope:
- Day map: https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg
  → Lưu vào: `public/textures/earth_daymap.jpg`

- Night map: https://www.solarsystemscope.com/textures/download/8k_earth_nightmap.jpg
  → Lưu vào: `public/textures/earth_nightmap.jpg`

## 3. Xong!
App sẽ tự load ảnh từ thư mục local. Không còn CORS error.

**Lưu ý:** File 8K khá nặng (~10MB each). Nếu muốn file nhẹ hơn, có thể dùng 4K version.
