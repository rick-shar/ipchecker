// TODO: migrate to typescript

const {checkIP, update} = require('./util/ipcheck');
const port = process.env.PORT || 3000;
const http = require('http');
const fs = require('fs');
    
const runServer = () => {
    let server = http.createServer(function (req, res) {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                if (req.url === '/ipcheck') {
                    body = JSON.parse(body);
                    const request = {
                        address: body.address,
                        level: body.level
                    }
                    body = checkIP(request);
                    // TODO: parse body for needed values
                } else {
                    // TODO: figure out what should be done in this case
                }
                res.writeHead(200, 'OK', {'Content-Type': 'application/json'});
                res.write(JSON.stringify(body));
                res.end();
            });
        } else {
            // TODO: send some useful message here for non load testing case
            // loadtest.io permission file
            const loaderio = fs.readFileSync('./loaderio.txt');
            res.write(loaderio);
            res.end();
        }
    });

    // Listen on port 3000, IP defaults to 127.0.0.1
    server.listen(port);
}

// TODO: handle dev enviroment more elegantly
process.env.LOADED_MOCHA_OPTS === 'true' || update().then(runServer);
