import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Blog",
  description: "Blog by Ibrahim",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      {
        text: 'Dropdown Menu',
        items: [
          { text: 'Item A', link: '/item-1' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' }
        ]
      },
    ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   },
    // ],

    //siteTitle: 'Hello World',

    outline: {
      label: 'Nessa Página'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ibrabeicker' },
      { icon: 'youtube', link: 'https://youtube.com/ibrabeicker' },
    ]
  },

  srcDir: 'src'
})
