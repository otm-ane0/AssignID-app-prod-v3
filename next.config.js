// next.config.js
const path = require('path');

module.exports = {
    // async rewrites() {
    //   console.log('Rewrites function called');
    //   return []
    // },
    sassOptions: {
      includePaths: [path.join(__dirname, 'src/app/styles')],
    },
  };
  