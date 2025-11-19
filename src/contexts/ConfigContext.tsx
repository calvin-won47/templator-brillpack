import React, { createContext, useContext } from "react";

export type ExtraConfig = {
  navigation?: {
    show_quick_quote?: boolean;
  };
  contact?: {
    email?: string;
    phone?: string;
    address_lines?: string[];
  };
  footer?: {
    legal_text?: string;
  };
  about?: {
    heading?: string;
    subheading?: string;
    features?: string[];
  };
  services?: {
    items?: { title: string; description: string }[];
  };
  seo?: {
    ogImage?: string;
  };
  [key: string]: any;
};

export type AppConfig = {
  basic: {
    app_name: string;
    strapi_url: string;
    strapi_site_slug: string;
    gtmId?: string;
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
    hero: {
      slogan: string;
      description: string;
    };
  };
  extra?: ExtraConfig;
};

const ConfigContext = createContext<AppConfig | null>(null);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const config = (window as any).APP_CONFIG as AppConfig;
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === null) {
    throw new Error("useConfig 必须在 ConfigProvider 内部使用");
  }
  return context;
};