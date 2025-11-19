// Read Strapi endpoint and site slug from the injected APP_CONFIG
export const API_URL =
  (typeof window !== "undefined" && (window as any).APP_CONFIG?.basic?.strapi_url) || "https://2amcreations.com";
export const SITE_SLUG =
  (typeof window !== "undefined" && (window as any).APP_CONFIG?.basic?.strapi_site_slug) || "xmyxyswkj";

export function buildUrl(path: string) {
  return `${API_URL}${path}`;
}

function normalizeImage(media: any): string | null {
  if (!media) return null;
  // Strapi v5 flattened media
  if (media.url) return buildUrl(media.url);
  // Strapi v4 nested media
  const url = media?.data?.attributes?.url;
  return url ? buildUrl(url) : null;
}

function normalizeField(item: any, key: string): any {
  // Prefer flattened (v5), fallback to attributes (v4)
  return item?.[key] ?? item?.attributes?.[key] ?? null;
}

export type BlogListItem = {
  id: number;
  slug: string | null;
  title: string | null;
  createdAt: string | null;
  coverImageUrl: string | null;
  excerpt: string | null;
};

export type BlogDetail = {
  id: number;
  slug: string | null;
  title: string | null;
  createdAt: string | null;
  contentMarkdown: string;
  coverImageUrl: string | null;
};

export async function fetchBlogPosts(): Promise<BlogListItem[]> {
  const query = `/api/blog-posts?populate=coverImage&filters[site][slug][$eq]=${SITE_SLUG}&sort=createdAt:desc`;
  const res = await fetch(buildUrl(query));
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  const json = await res.json();
  const data = json?.data ?? [];
  return data.map((item: any) => ({
    id: item.id,
    slug: normalizeField(item, "slug"),
    title: normalizeField(item, "title"),
    createdAt: normalizeField(item, "createdAt"),
    coverImageUrl: normalizeImage(normalizeField(item, "coverImage")),
    excerpt: normalizeField(item, "excerpt"),
  }));
}

export async function fetchBlogBySlug(slug: string): Promise<BlogDetail | null> {
  const query = `/api/blog-posts?populate=*&filters[slug][$eq]=${slug}&filters[site][slug][$eq]=${SITE_SLUG}`;
  const res = await fetch(buildUrl(query));
  if (!res.ok) throw new Error("Failed to fetch blog detail");
  const json = await res.json();
  const item = json?.data?.[0];
  if (!item) return null;
  return {
    id: item.id,
    slug: normalizeField(item, "slug"),
    title: normalizeField(item, "title"),
    createdAt: normalizeField(item, "publishedAt") || normalizeField(item, "createdAt"),
    contentMarkdown: normalizeField(item, "contentMarkdown") || "",
    coverImageUrl: normalizeImage(normalizeField(item, "coverImage")),
  };
}