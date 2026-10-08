export type Lang = "sw" | "en";

export interface Bilingual {
  sw: string;
  en: string;
}

export interface ServicePackage {
  name: Bilingual;
  price: number;
}

export interface Service {
  id: string;
  slug: string;
  name: Bilingual;
  description: Bilingual;
  packages: ServicePackage[];
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: Bilingual;
  description: Bilingual | null;
  category: "fertilizer" | "pesticide" | "other";
  price: number;
  unit: string;
  stock: number;
  image_url: string | null;
  videos: string[];
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  farmer_name: string;
  phone: string;
  region: string | null;
  district: string | null;
  farm_size_acres: number | null;
  crop: string | null;
  service_id: string | null;
  package_name: string | null;
  notes: string | null;
  photo_urls: string[] | null;
  status: "pending" | "confirmed" | "in_progress" | "done" | "cancelled";
  amount: number | null;
  payment_status: "unpaid" | "paid" | "failed";
  payment_provider: string | null;
  payment_reference: string | null;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  region: string | null;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_status: "unpaid" | "paid" | "failed";
  payment_provider: string | null;
  payment_reference: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: Bilingual;
  body: Bilingual;
  cover_image_url: string | null;
  videos: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface HomeHeroContent {
  headline: string;
  subheadline: string;
}

export interface AboutContent {
  intro: string;
  philosophy: string;
}

export interface SiteContentRow<T> {
  key: string;
  content: { sw: T; en: T };
  updated_at: string;
}

export interface ContactContent {
  phone: string;
  whatsapp: string;
  email: string;
  location: Bilingual;
}

export interface EventItem {
  id: string;
  title: Bilingual;
  description: Bilingual | null;
  event_date: string | null;
  photos: string[];
  videos: string[];
  is_published: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  name: Bilingual;
  price: number;
  unit: string;
  qty: number;
  image_url: string | null;
}

export interface PaymentMethod {
  name: string;
  number: string;
  account_name: string;
}

export interface PaymentSettings {
  methods: PaymentMethod[];
  note: Bilingual;
}

export interface Credential {
  title: Bilingual;
  org: Bilingual;
  year: string;
  image_url: string;
}

export interface AboutStat {
  value: string;
  label: Bilingual;
}

export interface AboutProfile {
  photo_url: string;
  name: string;
  role: Bilingual;
  credentials: Credential[];
  stats: AboutStat[];
}
