// TODO: migrate to typescript

const http = require('http');
const fs = require('fs');
const { checkIP, update } = require('./util/ipcheck');
const port = process.env.PORT || 3000;

const runServer = () => {
  const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
      let body = '';
      let response = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        if (req.url === '/ipcheck') {
            // TODO: validate body types, valid ip, valid level
          body = JSON.parse(body);
          const request = {
            address: body.address,
            level: body.level,
          };
          response = checkIP(request);
          // TODO: parse body for needed values
        } else {
          // TODO: figure out what should be done in this case
        }
        res.writeHead(200, 'OK', { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(response));
        res.end();
      });
    } else {
      // TODO: send some useful message here for non load testing case
      // loadtest.io verification file
      const loaderio = fs.readFileSync('./loaderio.txt');
      res.write(loaderio);
      res.end();
    }
  });

    // Listen on port 3000, IP defaults to 127.0.0.1
  server.listen(port);
};
update().then(runServer);
