import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
  {
    // Tudo, menos o ads.txt (ele precisa continuar respondendo no domínio raiz)
    source: '/:path((?!ads\\.txt$).*)',
    destination: 'https://learn-with-histories.devdantas.com.br/:path',
    permanent: false, // temporário (307): o Google não transfere o portfólio de vez
  },
],
};

export default nextConfig;
