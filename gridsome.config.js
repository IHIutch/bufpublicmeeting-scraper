// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const tailwind = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const purgecss = require("@fullhuman/postcss-purgecss");

const postcssPlugins = [tailwind, autoprefixer];

if (process.env.NODE_ENV === "production") postcssPlugins.push(purgecss());

module.exports = {
  siteName: "BufPublicMeetings",
  siteUrl: "http://openmeetings.jbhutch.com",
  templates: {
    Meeting: [
      {
        path: "/:meetingGroupUrlify/:meetingTypeUrlify/:meetingId",
        component: "./src/templates/MeetingTemplate.vue",
      },
    ],
  },
  plugins: [
    {
      use: "@gridsome/plugin-sitemap",
    },
  ],
  css: {
    loaderOptions: {
      postcss: {
        plugins: postcssPlugins,
      },
    },
  },
};
