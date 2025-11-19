/// <reference types="vite/client" />
import type { AppConfig } from "./contexts/ConfigContext";

declare global {
  interface Window {
    APP_CONFIG: AppConfig;
  }
}

export {};