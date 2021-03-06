var assert = require('assert'),
    pinyinArea = require('../index');

describe('pinyinArea', function () {
    it("should change er2 to er with accent", function () {
        assert.deepEqual(pinyinArea.changeWord("er", 3, '2'), ["e\u0301r", 4]);
    });

    it("should change tiao1 to tiao", function () {
        assert.deepEqual(pinyinArea.changeWord("tiao", 4, '1'), ["tiāo", 5]);
    });

    it("should change tiao1 to tiao2", function () {
        assert.deepEqual(pinyinArea.changeWord("tiāo", 4, '2'), ["tiáo", 4]);
    });

    it("should change dui4 to dui with accent", function () {
        assert.deepEqual(pinyinArea.changeWord("dui", 3, '4'), ["dui\u0300", 4]);
    });

    it("should change qing3 to qing with accent", function () {
        assert.deepEqual(pinyinArea.changeWord("qing", 3, '3'), ["qi\u030Cng", 4]);
    });
});
