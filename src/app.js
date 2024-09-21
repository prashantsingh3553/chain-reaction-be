const boot = require('./boot');
const server = require('./server');
const bootSocket = require('./socket');

boot().then(() => {
  server.start();
  bootSocket(server);
}).catch(err => {
  console.log(err);
});