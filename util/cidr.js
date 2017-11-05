// TODO: add a descriptive heading to this page
const IPv4 = require('ip-address').Address4;
function ipStringToZeroPad(ipString, prefixLength) {
    // TODO: code duplication move to utils once repos are merged
    return new IPv4(ipString)
        .binaryZeroPad()
        .slice(0, prefixLength);
}

function formPrefixArray(ipString) {
    // TODO: extend to be configurable and remove magic number
    const binaryString = ipStringToZeroPad(ipString);
    let temp = Array(32)
        .fill()
        .map((x, i) => i + 1)
        .map(length => binaryString.slice(0, length));
    return temp;
}

function checkRanges(address, table) {
    const addressPrefixes = formPrefixArray(address);
    let found = false;

    // TODO: mourn having to use a for loop (RIP)
    for (let i = 0; i < addressPrefixes.length; i++) {
        let prefix = addressPrefixes[i];
        if (table["ranges"][prefix]) {
            found = table["ranges"][prefix];
            break;
        }
    }
    return found;
}

module.exports = {
    // exports for unit testing
    checkRanges

}