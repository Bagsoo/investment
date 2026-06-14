-- ============================================
-- 앤써인베스트먼트 초기 스키마
-- ============================================

-- extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- profiles (사용자 프로필 + 관리자 여부)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

create policy "profiles_admin_all" on profiles
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 신규 유저 가입 시 자동 프로필 생성
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- company_info (회사 기본 정보)
-- ============================================
create table company_info (
  id uuid primary key default gen_random_uuid(),
  company_name text not null default '앤써인베스트먼트',
  slogan text,
  description text,
  phone text,
  email text,
  address text,
  business_number text,
  ceo_name text,
  founded_year int,
  logo_url text,
  og_image_url text,
  kakao_url text,
  youtube_url text,
  blog_url text,
  meta_title text,
  meta_description text,
  meta_keywords text,
  updated_at timestamptz not null default now()
);

alter table company_info enable row level security;

create policy "company_info_select_all" on company_info
  for select using (true);

create policy "company_info_admin_all" on company_info
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 초기 데이터
insert into company_info (
  company_name, slogan, description, phone, email, address,
  meta_title, meta_description, meta_keywords
) values (
  '앤써인베스트먼트',
  '당신의 자산에 정답을 드립니다',
  '앤써인베스트먼트는 고객의 수익률 극대화를 최우선으로 하는 유사투자자문업체입니다. 데이터 기반 분석과 전문가의 통찰력으로 최적의 투자 전략을 제시합니다.',
  '02-0000-0000',
  'info@answerinvestment.co.kr',
  '서울특별시 강남구',
  '앤써인베스트먼트 | 당신의 자산에 정답을 드립니다',
  '앤써인베스트먼트는 데이터 기반 분석과 전문 투자 전략으로 고객의 수익률을 극대화합니다.',
  '투자자문, 주식투자, 수익률, 투자전략, 앤써인베스트먼트'
);

-- ============================================
-- services (서비스 소개)
-- ============================================
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  description text,
  icon text,
  image_url text,
  order_index int default 0,
  is_visible bool default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table services enable row level security;

create policy "services_select_visible" on services
  for select using (is_visible = true);

create policy "services_admin_all" on services
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 초기 서비스 데이터
insert into services (title, subtitle, description, icon, order_index) values
(
  '프리미엄 종목 추천',
  'AI 분석 + 전문가 검증',
  '수백만 개의 데이터 포인트를 실시간 분석하여 최적의 투자 종목을 선별합니다. 단순한 추천이 아닌, 진입 타이밍과 목표가까지 제시합니다.',
  'TrendingUp',
  1
),
(
  '포트폴리오 컨설팅',
  '개인 맞춤 자산 배분 전략',
  '고객의 투자 성향과 목표 수익률에 맞춘 최적의 포트폴리오를 설계합니다. 리스크 관리와 수익 극대화를 동시에 추구합니다.',
  'PieChart',
  2
),
(
  '실시간 시장 분석',
  '24시간 마켓 모니터링',
  '글로벌 시장의 흐름을 실시간으로 분석하여 투자 기회를 포착합니다. 기술적 분석과 펀더멘털 분석을 결합한 입체적 시각을 제공합니다.',
  'Activity',
  3
),
(
  'VIP 전용 서비스',
  '소수 정예 프라이빗 자문',
  '제한된 인원만 참여 가능한 VIP 서비스로 최고 수준의 투자 자문을 제공합니다. 담당 전문가와 1:1 직접 소통으로 맞춤형 전략을 수립합니다.',
  'Crown',
  4
);

-- ============================================
-- performance_stats (수익률 통계 - 메인 표시용)
-- ============================================
create table performance_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  description text,
  order_index int default 0,
  updated_at timestamptz not null default now()
);

alter table performance_stats enable row level security;

create policy "performance_stats_select_all" on performance_stats
  for select using (true);

create policy "performance_stats_admin_all" on performance_stats
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

insert into performance_stats (label, value, description, order_index) values
('누적 수익률', '+847%', '2019년 서비스 시작 이후 누적', 1),
('평균 월 수익률', '+12.3%', '최근 12개월 평균 기준', 2),
('추천 종목 적중률', '91.2%', '목표가 달성 기준', 3),
('회원 만족도', '98.7%', '2024년 설문조사 기준', 4);

-- ============================================
-- boards (게시판)
-- ============================================
create table boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  order_index int default 0,
  is_visible bool default true,
  allow_comments bool default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table boards enable row level security;

create policy "boards_select_visible" on boards
  for select using (is_visible = true);

create policy "boards_admin_all" on boards
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

insert into boards (name, slug, description, order_index) values
('공지사항', 'notice', '앤써인베스트먼트의 공지사항입니다.', 1),
('투자 인사이트', 'insight', '전문가의 시장 분석과 투자 전략을 공유합니다.', 2),
('수익 인증', 'profit', '회원들의 실제 수익 인증 게시판입니다.', 3),
('Q&A', 'qna', '투자 관련 궁금한 점을 질문하고 답변 받으세요.', 4);

-- ============================================
-- posts (게시글)
-- ============================================
create table posts (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  title text not null,
  content jsonb not null default '{}',
  excerpt text,
  thumbnail_url text,
  tags text[] default '{}',
  meta_title text,
  meta_description text,
  meta_keywords text,
  is_published bool default false,
  is_pinned bool default false,
  view_count int default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "posts_select_published" on posts
  for select using (is_published = true);

create policy "posts_admin_all" on posts
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- 조회수 증가 함수
create or replace function increment_view_count(post_id uuid)
returns void language sql security definer as $$
  update posts set view_count = view_count + 1 where id = post_id;
$$;

-- ============================================
-- post_media (게시글 미디어)
-- ============================================
create table post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  url text not null,
  type text not null check (type in ('image', 'video')),
  filename text,
  size_bytes int,
  order_index int default 0,
  created_at timestamptz not null default now()
);

alter table post_media enable row level security;

create policy "post_media_select_all" on post_media
  for select using (true);

create policy "post_media_admin_all" on post_media
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- team_members (팀 소개)
-- ============================================
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  bio text,
  career text[],
  photo_url text,
  order_index int default 0,
  is_visible bool default true,
  created_at timestamptz not null default now()
);

alter table team_members enable row level security;

create policy "team_members_select_visible" on team_members
  for select using (is_visible = true);

create policy "team_members_admin_all" on team_members
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================
-- testimonials (고객 후기)
-- ============================================
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  content text not null,
  rating int check (rating between 1 and 5) default 5,
  profit_rate text,
  is_visible bool default true,
  order_index int default 0,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "testimonials_select_visible" on testimonials
  for select using (is_visible = true);

create policy "testimonials_admin_all" on testimonials
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

insert into testimonials (author_name, author_title, content, rating, profit_rate, order_index) values
('김**', '직장인 투자자', '앤써인베스트먼트 덕분에 6개월 만에 원금 대비 230% 수익을 달성했습니다. 처음에는 반신반의했지만 지금은 전적으로 신뢰합니다.', 5, '+230%', 1),
('이**', '프리랜서', '종목 추천의 적중률이 정말 놀랍습니다. 3개월 연속 수익 중이고 포트폴리오가 눈에 띄게 성장했어요.', 5, '+89%', 2),
('박**', '자영업자', 'VIP 서비스 가입 후 담당 전문가와 직접 소통하며 맞춤 전략을 받고 있습니다. 자산이 두 배가 됐네요.', 5, '+114%', 3);

-- ============================================
-- updated_at 자동 갱신 트리거
-- ============================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger trg_company_info_updated_at before update on company_info
  for each row execute function update_updated_at();
create trigger trg_services_updated_at before update on services
  for each row execute function update_updated_at();
create trigger trg_boards_updated_at before update on boards
  for each row execute function update_updated_at();
create trigger trg_posts_updated_at before update on posts
  for each row execute function update_updated_at();

-- ============================================
-- Storage buckets
-- ============================================
insert into storage.buckets (id, name, public) values
  ('post-images', 'post-images', true),
  ('company-assets', 'company-assets', true),
  ('team-photos', 'team-photos', true)
on conflict do nothing;

create policy "post_images_select" on storage.objects
  for select using (bucket_id = 'post-images');
create policy "post_images_admin_insert" on storage.objects
  for insert with check (
    bucket_id = 'post-images' and
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
create policy "post_images_admin_delete" on storage.objects
  for delete using (
    bucket_id = 'post-images' and
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "company_assets_select" on storage.objects
  for select using (bucket_id = 'company-assets');
create policy "company_assets_admin_all" on storage.objects
  for all using (
    bucket_id = 'company-assets' and
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
