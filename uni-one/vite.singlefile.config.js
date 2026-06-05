import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Сборка в один самодостаточный HTML-файл (JS+CSS инлайнятся внутрь),
// чтобы прототип можно было открыть прямо с телефона без сервера.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: "dist-single" },
});
