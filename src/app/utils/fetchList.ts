import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const BASE_URL = 'https://www.techpowerup.com'
const DATA_URL = BASE_URL + '/gpu-specs/?mfgr=NVIDIA&released=2025&sort=name';
const DATA_FILE_PATH = path.resolve('src/app/lib/data/list.json');
/**
 * 获取并解析指定 URL 的 HTML，提取表格数据并保存为 JSON 文件
 * 此函数应在服务器端环境中运行
 */
export async function fetchAndSaveListData(): Promise<void> {
  try {
    // console.log('开始获取数据...');

    // 获取 HTML 内容
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`无法获取数据，状态码：${response.status}，原因：${response.statusText}`);
    }

    const html = await response.text();
    // console.log('成功获取 HTML 内容');

    // 使用 JSDOM 解析 HTML
    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
    const document = dom.window.document;

    // 获取 id 为 "list" 的表格
    const table = document.getElementById('list');
    if (!table) {
      throw new Error('未找到 id 为 "list" 的表格');
    }

    // console.log('成功找到表格');

    // 提取表头
    const headerRow = table.querySelector('thead.colheader')?.querySelector('tr');
    if (!headerRow) {
      throw new Error('未找到表头行');
    }

    const headers = Array.from(headerRow.children)
      .map((th) => (th as HTMLElement).textContent?.trim() || '')
      .filter((header) => header !== ''); // 过滤空表头

    // 确保第一列的表头名称为 "Product Name"
    if (headers[0] !== 'Product Name') {
      throw new Error('表头顺序或名称不正确');
    }

    // console.log('成功提取表头:', headers);

    // 提取表格数据
    const rows = Array.from(table.querySelectorAll('tbody tr')).map((row) => {
      const cells = Array.from((row as HTMLElement).children);

      // 确保单元格数量与表头数量一致
      if (cells.length < headers.length) {
        console.warn(`行数据不足，跳过此行: ${row.outerHTML}`);
        return null;
      }

      const rowData: Record<string, string> = {};
      cells.forEach((cell, index) => {
        const header = headers[index];
        if (header) {
          rowData[header] = cell.textContent?.trim() || '';
        }
      });

      // 获取第一列的 <a> 标签的 href 属性值
      const productNameCell = row.querySelector('td:first-child a') as HTMLAnchorElement;
      if (productNameCell) {
        rowData['Product Name Url'] = BASE_URL + productNameCell.href;
      }

      // 获取第二列的 <a> 标签的 href 属性值
      const gpuChipCell = row.querySelector('td:nth-child(2) a') as HTMLAnchorElement;
      if (gpuChipCell) {
        rowData['GPU Chip Url'] = BASE_URL + gpuChipCell.href;
      }

      return rowData;
    }).filter((row) => row !== null); // 过滤掉无效行


    console.log('成功提取表格数据:', rows);

    // 构建 JSON 数据
    const jsonData = rows;

    // 确保目录存在
    const dirPath = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`创建目录：${dirPath}`);
    }

    // 写入 JSON 文件
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(jsonData, null, 2), 'utf-8');
    // console.log(`数据已成功保存到 ${DATA_FILE_PATH}`);

  } catch (error) {
    console.error('获取并保存列表数据时出错:', error);
    throw error; // 抛出错误以便调用者处理
  }
}