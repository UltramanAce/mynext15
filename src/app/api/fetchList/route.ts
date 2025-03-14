// api/fetchList.ts

import fs from 'fs';
import path from 'path';
import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

import { fetchAndSaveList } from '../../../utils/fetchList';

const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'list.json');

// GET 请求处理
export async function GET(req: NextApiRequest) {
  try {
    // 调用抓取和保存列表数据的函数
    // await fetchAndSaveList();

    // 读取本地 JSON 文件并返回数据
    // const listData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));

    // NextResponse.json(listData, { status: 200 });
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST 请求处理
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}