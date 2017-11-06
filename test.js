const assert = require('assert');
const LEVEL1_TABLE = require('./data/level_1.json');
const checkRanges = require('./util/cidr').checkRanges;
const CIDR = require('cidr-js');
const cidr = new CIDR();

// TODO: move test utils and data out to new file
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

describe("local firehol_level1 blocking", (done) => {
    it("should reject ips listed in local firehol_level1 ips", () => {
        IPS_SHOULD_REJECT.forEach(ip => assert.equal(LEVEL1_TABLE.ips[ip], ip));
    });
    it("should accept ips from 'whitelist' ips", () => {
        IPS_SHOULD_ACCEPT.forEach(ip => assert.equal(LEVEL1_TABLE.ips[ip], undefined));
    });
    it("should reject all ips in cidr ranges", () => {
        CIDRS_SHOULD_REJECT.forEach(rangeString => {
          const ips = cidr.list(rangeString);
          ips.forEach(ip => {
              assert.equal(checkRanges(ip, LEVEL1_TABLE), rangeString);
          })
        })
    })
});

