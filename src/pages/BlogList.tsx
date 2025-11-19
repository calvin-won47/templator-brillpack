import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { fetchBlogPosts, type BlogListItem } from "@/lib/strapi";

const formatDate = (value: string | null) => {
  if (!value) return "";
  const iso = String(value);
  const datePart = iso.includes("T") ? iso.split("T")[0] : iso.slice(0, 10);
  return datePart;
};

const BlogList = () => {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchBlogPosts()
      .then((data) => {
        if (mounted) setPosts(data);
      })
      .catch((e: any) => {
        if (mounted) setError(e?.message || "Error loading posts");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>

        {loading && <p>Loading...</p>}
        {!!error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.id} className="border rounded-lg p-4 bg-card shadow-sm">
                {post.coverImageUrl && (
                  <img
                    src={post.coverImageUrl}
                    alt={post.title ?? "Cover"}
                    className="w-full h-auto rounded mb-3"
                  />
                )}
                <h2 className="text-xl font-semibold mb-1">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <small className="text-muted-foreground">{formatDate(post.createdAt)}</small>
                {post.excerpt && <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>}
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;