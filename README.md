<p align="center">
  <strong>📄 Profile</strong><br/>
  <sub>Next.js 16 · Tailwind CSS 4 · OCI Object Storage</sub>
</p>

<p align="center">
  JSON 기반 개인 프로필 · 포트폴리오 웹사이트
</p>

---

## ✨ Features

| | |
|---|---|
| 🌗 **Dark / Light** | `next-themes` 자동 테마 전환 |
| 🌐 **KO / EN** | 한국어 · 영어 실시간 토글 |
| 📝 **Markdown Detail** | 프로젝트별 `.md` 파일 사이드 패널 렌더링 |
| 🖥️ **Code Highlight** | `react-syntax-highlighter` + 복사 버튼 |
| 📐 **LaTeX** | `remark-math` + `rehype-katex` 수식 지원 |
| 🔒 **Password Lock** | 미들웨어 기반 비밀번호 보호 |
| ☁️ **OCI Bucket** | 프로필 JSON · 이미지 · MD 파일 외부 저장소 연동 |

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local   # 환경변수 설정
npm run dev                   # http://localhost:3000
```

## ⚙️ Environment Variables

| Variable | Description |
|---|---|
| `OCI_DATA_URL` | `profile.json` 주소 (미설정 시 `public/profile.json`) |
| `OCI_BUCKET_URL` | OCI 버킷 쓰기 URL |
| `OCI_BUCKET_READ_URL` | OCI 버킷 읽기 URL |
| `SITE_PASSWORD` | 사이트 비밀번호 (기본값: `1234`) |

## 📁 Structure

```
app/
├── layout.tsx          # 메타데이터 · 글로벌 설정
├── page.tsx            # 메인 페이지
└── actions.ts          # Server Actions (업로드 등)
components/
├── ProfileEditor.tsx   # 프로필 편집 · 뷰어
├── ProfileSections.tsx # 섹션별 UI 컴포넌트
└── ProjectDetailPanel.tsx  # MD 사이드 패널
types/
└── profile.ts          # TypeScript 인터페이스
```

## 📄 License

MIT
