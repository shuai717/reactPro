const  {createProxyMiddleware}  = require("http-proxy-middleware");
 
module.exports = function(app) {
  app.use(
    createProxyMiddleware("/3000", {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "^/3000": ""
        }
    })
  )
  app.use(
    createProxyMiddleware("/163", {
      "target": "https://m.you.163.com",
      "changeOrigin": true,
      "pathRewrite": {
        "^/163": ""
      }
    })
  )

};