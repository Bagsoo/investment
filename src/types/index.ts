export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "user";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyInfo {
  id: string;
  company_name: string;
  slogan: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  business_number: string | null;
  ceo_name: string | null;
  founded_year: number | null;
  logo_url: string | null;
  og_image_url: string | null;
  kakao_url: string | null;
  youtube_url: string | null;
  blog_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PerformanceStat {
  id: string;
  label: string;
  value: string;
  description: string | null;
  order_index: number;
  updated_at: string;
}

export interface Board {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  is_visible: boolean;
  allow_comments: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  board_id: string;
  author_id: string | null;
  title: string;
  content: Record<string, unknown>;
  excerpt: string | null;
  thumbnail_url: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  is_published: boolean;
  is_pinned: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  board?: Board;
  author?: Profile;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  career: string[];
  photo_url: string | null;
  order_index: number;
  is_visible: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_title: string | null;
  content: string;
  rating: number;
  profit_rate: string | null;
  is_visible: boolean;
  order_index: number;
  created_at: string;
}
