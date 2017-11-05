const assert = require('assert');
const LEVEL2_TABLE = require('./data/level_1.json');
const checkRanges = require('./util/cidr').checkRanges;
const cidrTool = require('cidr-js');

// TODO: move test utils out to new file

function getValidIp()

describe("checkRanges on local firehol_level1", (done) => {
    it("It should reject ip 5.9.25.66", () => {
        assert.equal(checkRanges("5.9.25.66", LEVEL2_TABLE), '5.9.25.66/31');
        // TODO: remove these checks to their own it statements
        assert.equal(checkRanges("5.9.25.67", LEVEL2_TABLE), '5.9.25.66/31');
        assert.equal(checkRanges("5.9.25.68", LEVEL2_TABLE), '5.9.25.68/30');
        assert.equal(checkRanges("5.9.25.69", LEVEL2_TABLE), '5.9.25.68/30');
        assert.equal(checkRanges("5.9.250.79", LEVEL2_TABLE), false);
    });
});

