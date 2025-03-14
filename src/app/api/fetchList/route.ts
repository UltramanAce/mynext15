import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

import { fetchAndSaveListData } from '../../utils/fetchList';

const OUTPUT_FILE = path.resolve('src/app/lib/data/list.json');

// GET 请求处理
export async function GET(req: NextRequest) {
  try {
    // 调用抓取和保存列表数据的函数
    await fetchAndSaveListData();

    // 读取本地 JSON 文件并返回数据
    const listData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));

    return NextResponse.json(listData, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error111' }, { status: 500 });
  }
}

// POST 请求处理
export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}