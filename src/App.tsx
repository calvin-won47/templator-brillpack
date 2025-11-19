import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogList from "@/pages/BlogList";
import BlogDetail from "@/pages/BlogDetail";

const queryClient = new QueryClient();

const App = () => {
  const { basic } = useConfig();

  useEffect(() => {
    // 更新标题
    if (basic?.seo?.title || basic?.app_name) {
      document.title = basic?.seo?.title || basic?.app_name;
    }

    // 更新 meta 标签
    const setMeta = (name: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", basic?.seo?.description || "");
    setMeta("keywords", basic?.seo?.keywords || "");
    setMeta("author", basic?.app_name || "");
  }, [basic]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
