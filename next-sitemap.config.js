/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://answerinvestment.co.kr",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/admin" },
    ],
  },
  exclude: ["/admin/*", "/admin/login"],
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 7000,
};
