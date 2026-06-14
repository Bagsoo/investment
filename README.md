# 앤써인베스트먼트 홈페이지

유사투자자문업체 앤써인베스트먼트의 공식 홈페이지입니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **스타일**: Tailwind CSS
- **애니메이션**: Framer Motion
- **에디터**: Tiptap
- **DB / Auth / Storage**: Supabase
- **SEO**: next-sitemap
- **배포**: Vercel

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local.example`을 복사해서 `.env.local`을 만들고 값을 채우세요.

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://answerinvestment.co.kr
```

### 3. Supabase 마이그레이션 실행

Supabase 대시보드 → SQL Editor에서 아래 파일 내용을 실행하세요.

```
supabase/migrations/001_initial_schema.sql
```

또는 Supabase CLI 사용 시:

```bash
supabase db push
```

### 4. 관리자 계정 생성

Supabase 대시보드 → Authentication → Users에서 유저를 생성한 후,
SQL Editor에서 해당 유저를 관리자로 변경하세요.

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
```

### 5. 개발 서버 실행

```bash
npm run dev
```

---

## 페이지 구조

### 사용자 페이지
| 경로 | 설명 |
|------|------|
| `/` | 메인 랜딩 페이지 |
| `/about` | 회사소개 |
| `/services` | 서비스 안내 |
| `/board/[slug]` | 게시판 목록 |
| `/board/[slug]/[postId]` | 게시글 상세 |
| `/contact` | 무료 상담 |

### 관리자 페이지 (`/admin`)
| 경로 | 설명 |
|------|------|
| `/admin` | 대시보드 |
| `/admin/posts/new` | 새 글 작성 |
| `/admin/posts/[id]` | 게시글 수정 |
| `/admin/boards` | 게시판 관리 |
| `/admin/stats` | 통계 관리 |
| `/admin/team` | 팀 관리 |
| `/admin/settings` | 사이트 설정 |

---

## 배포 (Vercel)

```bash
# Vercel CLI
npm i -g vercel
vercel

# 또는 GitHub 연동 후 자동 배포
```

배포 후 `next-sitemap` 실행:
```bash
npm run build  # sitemap 자동 생성
```

---

## 디자인 시스템

| 컬러 | 값 |
|------|-----|
| Gold | `#C9A84C` |
| Gold Light | `#E8C97A` |
| Navy | `#0A0F1E` |
| Navy Light | `#111827` |
| Slate | `#8892A4` |

---

## 주의사항

- 본 서비스는 **유사투자자문업** 관련 사이트입니다.
- 수익률 관련 표현은 실제 데이터 기반으로 업데이트하세요.
- 금융 관련 법적 고지 문구를 반드시 포함해야 합니다.
