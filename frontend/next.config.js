/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },

  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "images.unsplash.com" },
      { hostname: "plus.unsplash.com" },
      { hostname: "b.zmtcdn.com" },
      { hostname: "media.istockphoto.com" },
      { hostname: "media-assets.swiggy.com" },
      { hostname: "angansweets.com" },
      { hostname: "media.trisaranepal.com" },
      { hostname: "garden.laviehospitality.com.np" },
      { hostname: "jasperrestaurant.com" },
      { hostname: "shorturl.at" },
    ],
  },
};

module.exports = nextConfig;