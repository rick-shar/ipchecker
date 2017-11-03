const PREFIX_TABLES = Array(4).fill(null);

// TODO: force sync initial write to prefix table
const IPv4 = require('ip-address').Address4;

function ipStringToZeroPad(ipString, prefixLength) {
    // TODO: code duplication move to utils once repos are merged
    return new IPv4(ipString)
        .binaryZeroPad()
        .slice(0, prefixLength);
}

function formPrefixArray(ipString) {
    // TODO: extend to be configurable and remove magic number 
    return Array(32).fill().map((x, i) => i + 1).map(length => ipString.slice(0,length));
}

function checkRanges(address, level) {
    const addressPrefixes = formPrefixArray(address);
    const LEVEL_TABLE = PREFIX_TABLES[level];
    let found = false; 
    addressPrefixes.forEach(prefix => {
        if(LEVEL_TABLE[ranges][prefix]) {
            found = LEVEL_TABLE[ranges][prefix];
            break;
        }
    });
    return found;
}
// TODO: move updating logic out into its own files
function update() {
    // TODO: figure out tradeoffs for updating all files vs one level at a time
}

function checkUpdate() {
    // TODO: move config out to environment variables

}

function rejectIP() {
    
}

function acceptIP() {
    

}

function checkIP(request) {
    const level = request.level;
    const address = request.address;

    if(PREFIX_TABLES[level][ips][address] || checkRanges(address, level)) {
        return "REJECT_AND_CHECK_SHOULD_UPDATE";
    } else {
        return "ACCEPT_AND_CHECK_SHOULD_UPDATE";
    }

}