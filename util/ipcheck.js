// TODO: lint!
// TODO: add some notes here on what this file is for
const PREFIX_TABLES = Array(4).fill(null);
// TODO: read filename array from env
const FILENAME_KEY_ARRAY = ["firehol_level1|latest", "firehol_level2|latest", "firehol_level3|latest", "firehol_level4|latest"];

// TODO: force sync write to prefix table for initial setup
const checkRanges = require('./cidr').checkRanges;
const AWS = require('aws-sdk'); 
const s3 = new AWS.S3();
// TODO: read const for update frequency from env
const UPDATE_FREQUENCY = 60 * 1000 * 5;

function processUpdates(jsonArray) {
    // TODO: make this more cautious of failures
    Array(4)
        .fill(null)
        .forEach((x, i) => PREFIX_TABLES[i] = JSON.parse(jsonArray[i].Body));
}

function update() {
    // TODO: figure out tradeoffs for updating all files vs one level at a time
    // TODO: remove magic strings
    // TODO: handle rejections
    const s3 = new AWS.S3();
    const promises = FILENAME_KEY_ARRAY.map(key => s3.getObject({Bucket: process.env.BUCKET, Key: key}).promise());
    return Promise
        .all(promises)
        .then(processUpdates);
}

function checkUpdate() {
    // TODO: move config out to environment variables
    // TODO: handle failures and remove strange method to check last updated time
    // TODO: remove magic number for timecheck
    const now = new Date().getTime();
    const lastUpdateTime = new Date(PREFIX_TABLES[0].timestamp).getTime();
    if (now - lastUpdateTime > UPDATE_FREQUENCY) {
        update(now);
    }

}

function rejectIP(reason) {
    checkUpdate();
    return {
        valid: false,
        // TODO: have "reason" be a url containing more information for the user
        reason
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
    // TODO: Enforce types and ranges here!
    // TODO: Will need to check token field if not AWS
    // TODO: levels are not nested! need to apply n-1 table checks for level n
    const table = PREFIX_TABLES[request.level - 1];
    const address = request.address;
    const reasonForReject = table["ips"][address] || checkRanges(address, table);
    if(reasonForReject) {
        return rejectIP(reasonForReject);
    } else {
        return acceptIP();
    }

}

module.exports = {
    checkIP,
    update
}