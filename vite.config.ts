import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/GameAssessmentTool/',  // 添加 base 配置
  plugins: [react()],
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    // 确保包含所有源文件
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        // 确保所有源文件被正确打包
        manualChunks(id) {
          // 包含所有 src 下的文件
          if (id.includes('/src/')) {
            const parts = id.split('/src/')[1];
            const firstDir = parts.split('/')[0];
            return firstDir || 'main';
          }
        },
        // 确保资源文件路径正确
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const extType = assetInfo.name.split('.').pop()?.toLowerCase() || '';
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (extType === 'css') {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        // 确保 JS 文件路径正确
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // 复制额外的资源文件
    copyPublicDir: true,
  },
  // 配置路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
    }
  }
})
