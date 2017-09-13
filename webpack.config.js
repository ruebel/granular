const path = require('path');
const reactScriptsConfig = require('react-scripts/config/webpack.config.prod');

// Customize Facebook Webpack configuration
reactScriptsConfig.resolve = {
  alias: {
    grainular: path.resolve(__dirname, 'src/index')
  }
};

module.exports = reactScriptsConfig;
