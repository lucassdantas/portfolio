import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:{
          blue:'#1D94E3',
          darkBlue:'#020B18',
          purple:'#1E1D3F',
        },
        base_1:{
          a0:'#E2E8F0',
          a1:'#D7DCE5',
          a2:'#C5CCD6',
          a3:'#E8EAED',
          a4:'#ACB5C3',
          a5:'#8C98AB',
          a7:'#4E5D74',
          a10:'#1F2B3D',
          a12:'#111B29',
          a13:'#0B131E',
        },
        base_2:{
          c0:'#4E5766',
          c1:'#24272D',
          b0:'#222A36',
          b8:'#141A23',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
