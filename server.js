// TODO: lint!
const PREFIX_TABLES = Array(4).fill(null);
// TODO: read filename array from env
const FILENAME_KEY_ARRAY = [
    "firehol_level1|latest",
    "firehol_level2|latest",
    "firehol_level3|latest",
    "firehol_level4|latest"
];

// TODO: force sync write to prefix table for initial setup
const IPv4 = require('ip-address').Address4;
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
const s3 = new AWS.S3();

// TODO: move all ip checking logic to another file

function ipStringToZeroPad(ipString, prefixLength) {
    // TODO: code duplication move to utils once repos are merged
    return new IPv4(ipString)
        .binaryZeroPad()
        .slice(0, prefixLength);
}

function formPrefixArray(ipString) {
    // TODO: extend to be configurable and remove magic number
    const binaryString = ipStringToZeroPad(ipString); 
    let temp = Array(32).fill().map((x, i) => i + 1).map(length => binaryString.slice(0,length));
    return temp;
}

function checkRanges(address, table) {
    const addressPrefixes = formPrefixArray(address);
    let found = false;

    // TODO: mourn having to use a for loop (RIP)
    for(let i = 0; i < addressPrefixes.length; i++) {
        let prefix = addressPrefixes[i];
        if (table["ranges"][prefix]) {
            found = table["ranges"][prefix];
            break;
        }
    }
    return found;
}
// TODO: move updating logic out into its own files
function processUpdates(jsonArray) {
    // TODO: make this more cautious of failures
    Array(4).fill(null).forEach((x,i) => PREFIX_TABLES[i] = JSON.parse(jsonArray[i].Body));
}
function update() {
    // TODO: figure out tradeoffs for updating all files vs one level at a time
    // TODO: remove magic strings
    const s3 = new AWS.S3();
    const promises = FILENAME_KEY_ARRAY.map(key => 
        s3.getObject({
            Bucket: process.env.BUCKET,
            Key: key
        }).promise()
    );
    return Promise.all(promises).then(processUpdates);
}

function checkUpdate() {
    // TODO: move config out to environment variables
    // TODO: handle failures and remove strange method to check last updated time
    // TODO: remove magic number for timecheck
    const now = new Date().getTime();
    const lastUpdateTime = new Date(PREFIX_TABLES[0].timestamp).getTime();
    if(now - lastUpdateTime > 60 * 1000 * 5) {
        update(now);
    }

}

function rejectIP() {
    checkUpdate();
    return {
        valid: false,
        // TODO: have "reason" be a url containing more information for the user
        reason: null
    };
}

function acceptIP() {
    checkUpdate();
    return {
        valid: true,
        // TODO: have reason be a url containing more information for the user
        reason: null
    };
}

function checkIP(request) {
    // TODO: Enforce types here!
    // TODO: Will need to check token if not AWS
    // TODO: levels are not nested! need to apply n-1 table checks for level n
    const table = PREFIX_TABLES[request.level - 1];
    const address = request.address;

    if(table["ips"][address] || checkRanges(address, table)) {
        return rejectIP();
    } else {
        return acceptIP();
    }

}

const port = process.env.PORT || 3000;
const http = require('http');
    
const runServer = () => {
    let server = http.createServer(function (req, res) {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                if (req.url === '/ipcheck') {
                    console.log(body);
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
            // TODO: send some useful message here
            res.end();
        }
    });

    // Listen on port 3000, IP defaults to 127.0.0.1
    server.listen(port);
    console.log('Server running at http://127.0.0.1:' + port + '/');
}

update().then(runServer);


// TODO: handle dev enviroment more elegantly
process.env.LOADED_MOCHA_OPTS === 'true' || update();

module.exports = {
    // exports for unit testing
    checkRanges

}