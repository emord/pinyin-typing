var assert = require('assert'),
    pinyinArea = require('../index');

describe('pinyinArea', function () {
    it("should change er2 to er", function () {
        assert.deepEqual(pinyinArea.changeWord("er", 3, '2'), ["e\u0301r", 4]);
    });

    it("should change tiao1 to tiao", function () {
        assert.deepEqual(pinyinArea.changeWord("tiao", 4, '1'), ["tiāo", 5]);
    });

    it("should change tiao1 to tiao2", function () {
        assert.deepEqual(pinyinArea.changeWord("tiāo", 4, '1'), ["tiáo", 4]);
    });
});
