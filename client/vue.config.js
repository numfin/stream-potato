/** @type {import('@vue/cli-service').ProjectOptions} */
const config = {
  chainWebpack: (config) => {
    return config.resolve.alias.set(
      "server",
      require("path").resolve(__dirname, ".."),
    );
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/api/ws": {
        target: "ws://localhost:4000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
};
module.exports = config;
