// sample data from firehol levels and load into load test bucket
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const CIDR = require('cidr-js');
const cidr = new CIDR();
// TODO: duplicated move to config
const FILENAME_KEY_ARRAY = ["firehol_level1|latest", "firehol_level2|latest", "firehol_level3|latest", "firehol_level4|latest"];
const IPS_SHOULD_REJECT = [
    // Taken from data file level_1.json
    "1.93.0.224",
    "5.9.253.173",
    "5.34.180.135",
    "37.235.53.18",
    "37.235.53.210"
];

const CIDRS_SHOULD_REJECT = [
    // Taken from data file level_1.json
    "195.238.252.0/24",
    "195.242.74.0/23",
    "198.50.234.210/31",
    "198.187.64.0/18"
];

const IPS_SHOULD_ACCEPT = [
    // Taken from real ips
    "8.8.8.8",
    // reddit.com
    "72.247.244.88",
    // imgur.com
    "173.231.140.219",
    // google.com
    "172.217.11.174",
    // youtube.com
    "74.125.65.91",
    // yahoo.com
    "98.137.149.56",
    // hotmail.com
    "65.55.72.135",
    // bing.com
    "65.55.175.254",
    // digg.com
    "64.191.203.30",
    // theonion.com
    "97.107.137.164",
    // hush.com
    "65.39.178.43",
    // gamespot.com
    "216.239.113.172",
    // ign.com
    "69.10.25.46",
    // cracked.com
    "98.124.248.77",
    // sidereel.com
    "144.198.29.112",
    // github.com
    "207.97.227.239"
];

const data = {
    "keys": ["address", "level"],
    "values": []
};
// get 
data.values = data.values.concat(IPS_SHOULD_ACCEPT.map(ip => [ip, 1]));
data.values = data.values.concat(IPS_SHOULD_REJECT.map(ip => [ip, 1]));
CIDRS_SHOULD_REJECT.forEach(cidrRange => {
    let newIps = cidr.list(cidrRange);
    data.values = data
        .values
        .concat(newIps.map(ip => [ip, 1]));
});
console.log(data);
    
s3.putObject({Bucket: "ipchecker-loaderio-payload", Key: "payload_data", Body: JSON.stringify(data) }).promise().then(console.log);
