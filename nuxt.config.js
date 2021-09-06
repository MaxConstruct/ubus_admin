const webpack = require('webpack')

export default {

  build: {
    // plugins:[
    //   new webpack.ProvidePlugin({
    //     $: 'jquery',
    //     jQuery: 'jquery',
    //     'window.jQuery': 'jquery'
    //   })
    // ]
  },

  server: {
    host: '25.68.166.78', // default: localhost,
    port: '3000'
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'data.token' },
          user: { url: 'me', method: 'get', propertyName: 'data' },
          logout: false
        }
      }
    },
    redirect: {
      login: '/login'
    }
  },

  axios: {
    proxy: true,
  },
  proxy: {
    '/api/': { target: 'https://ubus.scotty1944.net', pathRewrite: {'^/api/': ''}, changeOrigin: true }
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ubus_admin',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@assets/css/bootstrap/bootstrap.min.css',
    '@assets/css/custom.css',
    '@assets/css/animate.min.css',
  ],

  loaders: {
    color: '#0d6efd',
    height: '3px',
    vue: {
      compilerOptions: {
        preserveWhitespace: false
      }
    }
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src:'~/plugins/js/bootstrap.bundle.js', mode:'client'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'vue-sweetalert2/nuxt',
    [
      'nuxt-fontawesome', {
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas']
        },
        {
          set:'@fortawesome/free-brands-svg-icons',
          icons: ['fab']
        }
      ]
    }
    ]
  ],

}
