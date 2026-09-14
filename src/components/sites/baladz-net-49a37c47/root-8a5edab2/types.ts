export type BaladzTab = "beranda" | "kabar" | "kajian";

export interface NewsItem {
  title: string;
  date: string;
  excerpt: string;
}

export interface FeeRow {
  level: string;
  admission: string;
  monthly: string;
  boarding: string;
}
