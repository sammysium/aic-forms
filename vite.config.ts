import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import tsconfigPaths from "vite-tsconfig-paths";
import * as packageJson from './package.json'
import { resolve } from "node:path";
import tailwindcss from "tailwindcss";
import { libInjectCss } from 'vite-plugin-lib-inject-css';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(),
    libInjectCss(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      //include: ['src/hooks/', 'src/contexts', 'src/ui/', 'src/utils', 'src/styles', 'src/data', 'src/@', 'src/interfaces'],
    }),
  
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },

  resolve: {
    alias: {
      // here add the absolute paths that you wanna add
      "@hooks/*": "./src/hooks/*",
      "@interfaces/*": "./src/interfaces/*",
      "@contexts/*": "./src/contexts/*",
      "@ui/*": "./src/ui/web/*",
      "@utils/*": "./src/utils/*",
      "@styles/*": "./src/styles/*",
      "@data/*": "./src/data/*",
      "@/*": "./src/@/*"
    },
  },
  build: {
    lib: {
      entry: resolve('src', 'index.ts'),
      name: 'AiCollectForms',
      formats: ['es', 'umd'],
      fileName: (format) => `aic-forms.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies), 
        "react", "react-dom", "tailwindcss"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            tailwindcss: "tailwindcss",
          },
        },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})




