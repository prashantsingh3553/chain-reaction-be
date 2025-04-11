const { Redis: IORedis } = require('ioredis');
const container = require('../container');
const config = require('../config');

function retryStrategy(times) {
  if (times > 10) {
    return new Error('Retried 10 times');
  }
  const delay = Math.min(times * 100, 2000);
  return delay;
}

class Redis {
  _client;

  // getRedisAddress() {
  //   return `redis://${config.redis.host}:${config.redis.port}`
  // }

  async load() {
    return new Promise((resolve, reject) => {
      this._client = new IORedis({
        port: config.redis.port,
        host: config.redis.host,
        retryStrategy,
      });

      // this.client = createClient({
      //   url: this.getRedisAddress(),
      //   socket: {
      //     reconnectStrategy: retryStrategy,
      //   },
      // });

      this._client.on('connect', () => {
        console.log(`[REDIS]: Connected`);
        resolve();
      });
      this._client.on('error', err => {
        throw new Error('[REDIS]: error', err);
      });
      this._client.on('close', () => {
        throw new Error('[REDIS]: Closed');
      });
      this._client.on('reconnecting', (time) => {
        console.log(`[REDIS]: Reconnecting`);
      });
      this._client.on('end', () => {
        throw new Error('[REDIS]: Ended');
      });

      container.add('redis', this._client);
    });
  }

  registerHooks() {
    this._client.on('connect', () => {
      console.log(`[REDIS]: Connected`);
    });
    this._client.on('error', err => console.log('Redis Client Error', err));
    this._client.on('close', () => {
      throw new Error('[REDIS]: Closed');
    });
    this._client.on('reconnecting', (time) => {
      console.log(`[REDIS]: Reconnecting`);
    });
    this._client.on('end', () => {
      throw new Error('[REDIS]: Ended');
    });
  }
}

module.exports = new Redis();