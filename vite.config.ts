import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/GameAssessmentTool/',  // 添加 base 配置
  plugins: [react()],
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
  }
})
