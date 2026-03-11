import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // slug = mdFile 이름 (e.g. "my-project.md")
  // 경로는 항상 /content/projects/ 안으로 제한 (경로 탈출 방지)
  const safeName = path.basename(slug)  // 디렉토리 탈출 방지
  const filePath = path.join(process.cwd(), 'content', 'projects', safeName)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
