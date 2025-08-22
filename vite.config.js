import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: { MODE: 3 } // Compatibilidad Vue 2 en Vue 3
        }
      }
    }),
    vuetify({
      autoImport: true
    })
  ],

  resolve: {
    alias: {
      'vue$': '@vue/compat', // Alias a Vue compat
      '@': path.resolve(__dirname, './src')
    }
  },

  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  },
  
  optimizeDeps: {
    include: ['epic-spinners']
  },

  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler'
      },
      scss: {
        api: 'modern-compiler'
      }
    }
  },

  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/images': {
        target: 'http://www.imagenes.titansolucionescloud.ovh',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/images/, ''),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        }
      }
    }
  }
});
