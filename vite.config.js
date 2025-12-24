import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        work: resolve(__dirname, "work.html"),
        project: resolve(__dirname, "project.html"),
        project1: resolve(__dirname, "project-1.html"),
        project2: resolve(__dirname, "project-2.html"),
        project3: resolve(__dirname, "project-3.html"),
        project4: resolve(__dirname, "project-4.html"),
        contact: resolve(__dirname, "contact.html"),
        education: resolve(__dirname, "education.html"),
        testimonials: resolve(__dirname, "testimonials.html"),
      },
    },
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
    ],
    copyPublicDir: true,
  },
});
