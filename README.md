# Dinh Dưỡng & Sức Khoẻ

Ứng dụng web **tra cứu thành phần dinh dưỡng thực phẩm Việt Nam**, kèm **MCP server** để các trợ lý AI
(Claude, …) truy vấn cùng bộ dữ liệu. Chỉ để tra cứu: không đăng nhập, không backend lưu trữ, dữ liệu
đóng gói sẵn trong code.

- Web: Angular 22 (standalone, signals, zoneless), deploy tĩnh lên **GitHub Pages**.
- MCP server: Node.js, `@modelcontextprotocol/sdk`, chạy **stdio** (máy cá nhân) hoặc **Streamable HTTP** (host bất kỳ).
- Dữ liệu: *Bảng thành phần thực phẩm Việt Nam (VTN_FCT_2007) – Viện Dinh dưỡng Quốc gia*, giá trị trên 100 g phần ăn được.

> Thông tin chỉ mang tính tham khảo, không thay thế tư vấn của bác sĩ hoặc chuyên gia dinh dưỡng.

## Tính năng

| Trang | Mô tả |
| --- | --- |
| Thực phẩm (`/`) | Tìm theo tên (có/không dấu, tiếng Anh), lọc theo nhóm. URL chia sẻ được (`?q=ca&group=THUY_SAN`). |
| Chi tiết (`/foods/:id`) | 87 chỉ số theo nhóm chất, quy đổi theo gram, tỉ lệ năng lượng protein/béo/glucid. |
| Chất dinh dưỡng (`/nutrients`) | Xếp hạng thực phẩm giàu/ít một chất nhất (`?n=vitaminC&order=asc`). |
| So sánh (`/compare`) | Tối đa 6 thực phẩm cạnh nhau, tô màu giá trị cao nhất. |
| Bữa ăn (`/meal`) | Cộng dồn dinh dưỡng theo khối lượng; ghi rõ thực phẩm thiếu số liệu. Lưu trên trình duyệt. |
| Giới thiệu & AI (`/about`) | Nguồn dữ liệu, hướng dẫn kết nối MCP. |

“—” nghĩa là bảng gốc **không có số liệu** (không phải bằng 0); các phép tính không coi nó là 0.

## Cấu trúc

```
data/                 Master data (JSON) – nguồn dữ liệu duy nhất cho web và MCP
  foods.json            41 thực phẩm, giá trị/100 g (null = không có số liệu)
  nutrients.json        87 chỉ số: key, tên Việt/Anh, đơn vị, nhóm chất
  food-groups.json      11 nhóm thực phẩm
  nutrient-categories.json
libs/nutrition/       Logic dùng chung, không phụ thuộc framework (tìm kiếm, xếp hạng, so sánh, tính bữa ăn)
src/                  Web app Angular
mcp-server/           MCP server (stdio + HTTP), đóng gói thành 1 file .mjs
.github/workflows/    CI + deploy GitHub Pages
```

Web và MCP server cùng import `@nutrition/core` (`libs/nutrition`), nên luôn trả lời giống nhau.

## Phát triển

Yêu cầu Node.js 24 (`nvm use` đọc `.nvmrc`).

```bash
npm install
npm start               # web dev server: http://localhost:4200
npm test                # test thư viện + MCP server (Vitest/Node) và web (ng test)
npm run build           # build MCP server + web vào dist/nutrition-health/browser
```

### Sửa dữ liệu

Sửa trực tiếp các file trong `data/`. Mỗi thực phẩm phải có đủ mọi key trong `nutrients.json`
(dùng `null` khi không có số liệu) — `npm test` kiểm tra điều này.

## Deploy lên GitHub Pages

Workflow `.github/workflows/ci-cd.yml`:

- **Pull request**: chạy test + build.
- **Push lên `main`** (hoặc chạy tay): test, build với `base-href` đúng của repo, tạo `404.html`
  (fallback cho deep link của SPA), deploy lên GitHub Pages. Bản build kèm:
  - `/<repo>/data/*.json` – dữ liệu thô, dùng như API tĩnh chỉ đọc.
  - `/<repo>/mcp/nutrition-health-mcp.mjs` – MCP server tải về dùng ngay.

Thiết lập một lần trên GitHub:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Môi trường `github-pages` mặc định chỉ cho deploy từ **default branch**. Hãy đặt `main` làm default
   branch (**Settings → General → Default branch**), hoặc thêm `main` vào
   **Settings → Environments → github-pages → Deployment branches**.

Sau đó mỗi lần merge vào `main` sẽ tự deploy tới `https://<user>.github.io/<repo>/`.
Đổi tên repo hay dùng custom domain cũng không cần sửa code: base path lấy từ `actions/configure-pages`.

## MCP server cho AI

Các tool (đều chỉ đọc):

| Tool | Chức năng |
| --- | --- |
| `search_foods` | Tìm thực phẩm theo tên/nhóm, kèm năng lượng và chất chính. |
| `get_food` | Toàn bộ chỉ số của một thực phẩm, quy đổi theo gram, lọc theo nhóm chất. |
| `rank_foods_by_nutrient` | Thực phẩm giàu/ít một chất nhất. |
| `compare_foods` | So sánh 2–10 thực phẩm. |
| `calculate_meal` | Tổng dinh dưỡng của bữa ăn (thực phẩm + gram). |
| `list_food_groups`, `list_nutrients` | Danh mục nhóm thực phẩm và chỉ số. |

Thực phẩm nhận id (`"5040"`) hoặc tên (`"ổi"`, `"oi"`, `"guava"`); chất dinh dưỡng nhận key
(`"vitaminC"`) hoặc tên (`"vitamin C"`, `"canxi"`, `"iron"`).

### Chạy trên máy (stdio)

```bash
npm run build:mcp       # -> mcp-server/dist/nutrition-health-mcp.mjs (tự chứa, không cần node_modules)
```

Hoặc tải file đã build từ trang Pages: `https://<user>.github.io/<repo>/mcp/nutrition-health-mcp.mjs`.

Claude Code:

```bash
claude mcp add nutrition-health -- node /duong-dan/toi/nutrition-health-mcp.mjs
```

Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "nutrition-health": {
      "command": "node",
      "args": ["/duong-dan/toi/nutrition-health-mcp.mjs"]
    }
  }
}
```

Kiểm tra bằng MCP Inspector: `npm run inspect -w mcp-server`.

### Chạy dạng HTTP (remote)

GitHub Pages chỉ phục vụ file tĩnh nên không chạy được server. Chế độ HTTP là stateless (không lưu
phiên), deploy được lên bất kỳ host Node/Docker nào (Render, Fly.io, Cloud Run, VPS…):

```bash
npm run mcp:http                          # http://127.0.0.1:3000/mcp, health check ở /health
# hoặc
docker build -f mcp-server/Dockerfile -t nutrition-health-mcp .
docker run -p 3000:3000 nutrition-health-mcp
```

Biến môi trường: `PORT` (3000), `HOST` (127.0.0.1; image Docker dùng 0.0.0.0), `MCP_PATH` (`/mcp`).

```bash
claude mcp add --transport http nutrition-health https://<host>/mcp
```
