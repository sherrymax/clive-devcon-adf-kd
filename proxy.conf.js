const host='http://ec2-54-81-2-222.compute-1.amazonaws.com';

module.exports = {
  "/alfresco": {
    "target": host,
    "secure": false,
    "changeOrigin": true
  }
};
