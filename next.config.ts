import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.0.21'],
  
  // Configuraciones para mejorar la hidratación
  reactStrictMode: true,
  
  // Configuración experimental
  experimental: {
    // Optimizar la hidratación
    optimizePackageImports: ['@/components', '@/modules'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      }
    ]
  },
  
  // Configuración del compilador
  compiler: {
    // Remover console.log en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;