/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://suratotomatis.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    changefreq: 'weekly',
    priority: 0.7,
    exclude: ['/admin', '/admin/*', '/api/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin', '/admin/*', '/api/*'],
            },
        ],
    },
};