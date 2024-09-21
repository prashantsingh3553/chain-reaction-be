const { createClient } = require('redis');
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
  client;

  getRedisAddress() {
    return `redis://${config.redis.host}:${config.redis.port}`
  }

  async load() {
    this.client = createClient({
      url: this.getRedisAddress(),
      socket: {
        reconnectStrategy: retryStrategy,
      },
    });

    this.registerHooks();
    await this.client.connect();
    container.add('redis', this.client);
  }

  registerHooks() {
    this.client.on('connect', () => {
      console.log(`[REDIS]: Connected`);
    });
    this.client.on('error', err => console.log('Redis Client Error', err));
    this.client.on('close', () => {
      throw new Error('[REDIS]: Closed');
    });
    this.client.on('reconnecting', (time) => {
      console.log(`[REDIS]: Reconnecting`);
    });
    this.client.on('end', () => {
      throw new Error('[REDIS]: Ended');
    });
  }
}

module.exports = new Redis();