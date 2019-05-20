const asyncPlugin = require("preact-cli-plugin-fast-async");

export default (config, env, helpers) => {
  asyncPlugin(config);
  if(config.devServer) {
    config.devServer.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }
}
