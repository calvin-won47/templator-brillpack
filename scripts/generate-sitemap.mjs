// Node ESM script to generate sitemap.xml and robots.txt into ./dist
// Inputs via env:
// - SITE_URL (required): e.g. https://example.com
// - strapi_url (optional): e.g. https://cms.example.com
// - strapi_site_slug (optional): e.g. example-com
// - STRAPI_API_TOKEN (optional): Bearer token for Strapi API

import fs from 'node:fs/promises';
import path from 'node:path';

function normalizeBaseUrl(url) {
  if (!url) return '';
  return url.replace(/\/+$/, '');
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function readLocalPublicConfig() {
  try {
    const raw = await fs.readFile(path.resolve('public', 'config.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchRemoteConfigByHttp(siteUrl) {
  try {
    const base = normalizeBaseUrl(siteUrl);
    const res = await fetch(`${base}/config.json`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function pickStrapiConfig(env, remoteCfg, localCfg) {
  const remoteBasic = remoteCfg?.basic ?? remoteCfg?.Basic ?? {};
  const localBasic = localCfg?.basic ?? localCfg?.Basic ?? {};
  const strapiUrl = env.strapi_url || remoteBasic.strapi_url || localBasic.strapi_url;
  const siteSlug = env.strapi_site_slug || remoteBasic.strapi_site_slug || localBasic.strapi_site_slug;
  return { strapiUrl, siteSlug };
}

async function fetchBlogPage({ strapiUrl, siteSlug, page, pageSize }) {
  const u = new URL('/api/blog-posts', strapiUrl);
  u.searchParams.set('fields[0]', 'slug');
  u.searchParams.set('fields[1]', 'updatedAt');
  u.searchParams.set('fields[2]', 'publishedAt');
  u.searchParams.set('fields[3]', 'createdAt');
  u.searchParams.set('filters[site][slug][$eq]', siteSlug);
  u.searchParams.set('pagination[page]', String(page));
  u.searchParams.set('pagination[pageSize]', String(pageSize));
  u.searchParams.set('sort', 'createdAt:desc');

  const headers = { Accept: 'application/json' };
  if (process.env.STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  const res = await fetch(u.href, { headers });
  if (!res.ok) {
    throw new Error(`Strapi request failed ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const data = Array.isArray(json?.data) ? json.data : [];
  const items = data
    .map((it) => {
      const attrs = it?.attributes || it;
      return {
        slug: attrs?.slug,
        updatedAt: attrs?.updatedAt || attrs?.publishedAt || attrs?.createdAt || null,
      };
    })
    .filter((x) => !!x.slug);

  const pageCount = json?.meta?.pagination?.pageCount;
  const next = pageCount ? page < pageCount : data.length === pageSize;
  return { items, next };
}

async function fetchAllBlogPosts(strapiUrl, siteSlug) {
  const results = [];
  const pageSize = 100;
  let page = 1;
  while (true) {
    const { items, next } = await fetchBlogPage({ strapiUrl, siteSlug, page, pageSize });
    results.push(...items);
    if (!next) break;
    page += 1;
    if (page > 1000) break; // safety
  }
  return results;
}

function buildSitemapXml(siteUrl, posts) {
  const base = normalizeBaseUrl(siteUrl);
  const urls = [];
  urls.push({ loc: `${base}/`, changefreq: 'daily', priority: 1.0 });
  urls.push({ loc: `${base}/blog`, changefreq: 'daily', priority: 0.8 });
  for (const p of posts) {
    const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined;
    urls.push({ loc: `${base}/blog/${encodeURIComponent(p.slug)}`, lastmod, changefreq: 'weekly', priority: 0.6 });
  }

  const body = urls
    .map((u) => {
      return (
        '<url>' +
        `<loc>${escapeXml(u.loc)}</loc>` +
        (u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : '') +
        `<changefreq>${u.changefreq}</changefreq>` +
        `<priority>${u.priority}</priority>` +
        '</url>'
      );
    })
    .join('\n');

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    '\n</urlset>\n'
  );
}

function buildRobotsTxt(siteUrl) {
  const base = normalizeBaseUrl(siteUrl);
  return `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`;
}

async function main() {
  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    console.error('Error: SITE_URL env is required.');
    process.exit(1);
  }

  const [remoteCfg, localCfg] = await Promise.all([
    fetchRemoteConfigByHttp(siteUrl),
    readLocalPublicConfig(),
  ]);

  const { strapiUrl, siteSlug } = pickStrapiConfig(process.env, remoteCfg, localCfg);
  if (!strapiUrl || !siteSlug) {
    console.error('Error: strapi_url or strapi_site_slug is missing (env/remote/local).');
    process.exit(1);
  }

  console.log(`Generating sitemap for ${siteUrl}`);
  console.log(`Using Strapi: ${strapiUrl}, site slug: ${siteSlug}`);

  let posts = [];
  try {
    posts = await fetchAllBlogPosts(strapiUrl, siteSlug);
  } catch (err) {
    console.warn('Warn: Failed to fetch posts from Strapi:', err?.message || err);
    posts = [];
  }

  const sitemapXml = buildSitemapXml(siteUrl, posts);
  const robotsTxt = buildRobotsTxt(siteUrl);

  await fs.mkdir(path.resolve('dist'), { recursive: true });
  await fs.writeFile(path.resolve('dist', 'sitemap.xml'), sitemapXml, 'utf8');
  await fs.writeFile(path.resolve('dist', 'robots.txt'), robotsTxt, 'utf8');

  console.log(`Wrote dist/sitemap.xml (${sitemapXml.length} bytes)`);
  console.log(`Wrote dist/robots.txt (${robotsTxt.length} bytes)`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});