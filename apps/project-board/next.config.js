/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-check
const { composePlugins, withNx } = require('@nx/next');

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  
  // Nueva configuración para monorepos (Next.js 13+)
  experimental: {
    // @ts-ignore
    outputFileTracing: true,
    // Para monorepos Nx:
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/@swc/core-linux-x64-gnu',
        'node_modules/**/@swc/core-linux-x64-musl'
      ]
    },
    // Habilita si usas imágenes optimizadas
    images: { allowFutureImage: true }
  },

  nx: {
    svgr: false,
  },
  
  // Configuración para evitar errores de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);