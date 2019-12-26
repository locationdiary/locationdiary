export default (config, env, helpers) => {
  if (config.devServer) {
    config.devServer.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    };
  }

  // Help blockstack.js understand it is running in a browser
  config.node.process = 'mock';
  config.node.Buffer = true;
};
