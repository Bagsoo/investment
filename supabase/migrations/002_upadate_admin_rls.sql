-- 기존 정책 전부 삭제
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_read_all" ON profiles;

-- 단순하게 다시 생성
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- boards
DROP POLICY IF EXISTS "boards_admin_all" ON boards;
CREATE POLICY "boards_admin_all" ON boards
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- posts
DROP POLICY IF EXISTS "posts_admin_all" ON posts;
CREATE POLICY "posts_admin_all" ON posts
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- services
DROP POLICY IF EXISTS "services_admin_all" ON services;
CREATE POLICY "services_admin_all" ON services
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- performance_stats
DROP POLICY IF EXISTS "performance_stats_admin_all" ON performance_stats;
CREATE POLICY "performance_stats_admin_all" ON performance_stats
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- team_members
DROP POLICY IF EXISTS "team_members_admin_all" ON team_members;
CREATE POLICY "team_members_admin_all" ON team_members
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- testimonials
DROP POLICY IF EXISTS "testimonials_admin_all" ON testimonials;
CREATE POLICY "testimonials_admin_all" ON testimonials
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- company_info
DROP POLICY IF EXISTS "company_info_admin_all" ON company_info;
CREATE POLICY "company_info_admin_all" ON company_info
  FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );