const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["mylife-mylifebucket7be1b902-gbsda8v43maj.s3.eu-west-2.amazonaws.com"]
  }
};
