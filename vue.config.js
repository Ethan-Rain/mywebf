module.exports = {
  devServer: {
    host: '0.0.0.0', // 允许所有IP访问
    port: 8080,      // 指定端口（可选）
    https: false,    // 关闭HTTPS（如需HTTPS可设为true）
    allowedHosts: "all", // 允许所有host
    proxy: {
      '/api': {
        target: 'http://192.168.31.107:58080',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
