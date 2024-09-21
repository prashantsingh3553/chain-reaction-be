const redis = require('./resources/redis');
const container = require('./container');

module.exports = async () => {
  await redis.load();
  console.log('Resources booted successfully');
}