import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DATA_SOURCE, NutritionCatalog } from '@nutrition/core';

export const REPOSITORY_URL = 'https://github.com/trungitnt95/game-item-comparing';
const MCP_FILE = 'mcp/nutrition-health-mcp.mjs';

const TOOLS = [
  { name: 'search_foods', description: 'Tìm thực phẩm theo tên (có/không dấu, tiếng Anh) và nhóm.' },
  { name: 'get_food', description: 'Toàn bộ thành phần dinh dưỡng của một thực phẩm, quy đổi theo gram.' },
  { name: 'rank_foods_by_nutrient', description: 'Thực phẩm giàu/ít một chất nhất (vd vitamin C, canxi).' },
  { name: 'compare_foods', description: 'So sánh 2–10 thực phẩm theo các chất dinh dưỡng.' },
  { name: 'calculate_meal', description: 'Tổng dinh dưỡng của bữa ăn từ danh sách thực phẩm + gram.' },
  { name: 'list_food_groups', description: 'Danh sách nhóm thực phẩm.' },
  { name: 'list_nutrients', description: 'Danh sách chỉ số dinh dưỡng, đơn vị, nhóm chất.' },
];

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  protected readonly catalog = inject(NutritionCatalog);
  protected readonly dataSource = DATA_SOURCE;
  protected readonly repositoryUrl = REPOSITORY_URL;
  protected readonly tools = TOOLS;
  protected readonly mcpFile = MCP_FILE;
  protected readonly mcpUrl = new URL(MCP_FILE, inject(DOCUMENT).baseURI).href;
  protected readonly dataFiles = ['foods.json', 'nutrients.json', 'food-groups.json', 'nutrient-categories.json'];

  protected readonly desktopConfig = JSON.stringify(
    {
      mcpServers: {
        'nutrition-health': { command: 'node', args: ['/duong-dan/toi/nutrition-health-mcp.mjs'] },
      },
    },
    null,
    2,
  );
}
