import { promisePool } from "@/lib/db"; // 引入数据库连接池

export async function GET(request) {
  try {
    // 使用 promisePool 查询数据库
    const [rows] = await promisePool.query("SELECT * FROM users");
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("数据库查询失败:", error);
    return new Response(JSON.stringify({ error: "数据库查询失败" }), { status: 500 });
  }
}