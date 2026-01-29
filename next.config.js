// next.config.js
const path = require('path');

module.exports = {
    // async rewrites() {
    //   console.log('Rewrites function called');
    //   return []
    // },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'src/app/styles')],
    },
  };
  