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
        manualChunks(id) {
          // 根据文件路径动态确定 chunk
          if (id.includes('/src/components/')) {
            return 'components';
          }
          if (id.includes('/src/contexts/')) {
            return 'contexts';
          }
          if (id.includes('/src/styles/')) {
            return 'styles';
          }
        }
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
