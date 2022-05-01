require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
    siteMetadata: {
        author: "Cannon Lock",
        description: "Get your thoughts our of your head",
        image: "src/assets/images/WebsiteFavicon.png",
        siteUrl: "https://brainstorm.takingdrake.com",
        title: "Brainstorm",
    },
    plugins: [
        "gatsby-plugin-theme-ui",
        "gatsby-plugin-image",
        {
            resolve: "gatsby-plugin-google-analytics",
            options: {
                trackingId: "G-6G26W7PW7Z",
            },
        },
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-sitemap",
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                icon: "src/assets/images/WebsiteFavicon.png",
            },
        },
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp"
    ],
};
