const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["mylife-mylifeec9c13f2-4wjqz7vves1y.s3.eu-west-2.amazonaws.com"]
  },
};