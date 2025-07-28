// This file is required for deploying React apps to GitHub Pages with client-side routing.
// It redirects all requests to index.html so that React Router can handle them.

const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, 'build');
const redirectFile = path.join(buildPath, '_redirects');

fs.writeFileSync(redirectFile, '/*    /index.html   200');
console.log('Created _redirects file for client-side routing.');
