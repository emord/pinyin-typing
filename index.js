(function () {
    var root = this,
        pinyinArea = function () {};

    const MODIFIERS = {
            ":": "\u0308",
            "1": "\u0304",
            "2": "\u0301",
            "3": "\u030C",
            "4": "\u0300"
        },
        ACCENTS = /[\u0304\u0301\u030C\u0300]/g,
        VOWELS = /[aeiou\u00fc]/;

    function insertIntoString(str1, str2, pos) {
        return str1.slice(0, pos-1) + str2 + str1.slice(pos);
    }

    function stripCurrentAccents(value) {
        return value.replace(ACCENTS, '');
    }

    function indexOfVowelToChange(word) {
        var firstVowelIndex = word.search(VOWELS),
            secondVowelIndex = -1;

        if (firstVowelIndex !== -1 && /[iu\u00fc]/.test(word[firstVowelIndex])) {
            secondVowelIndex = word.slice(firstVowelIndex+1).search(VOWELS);
        }

        if (secondVowelIndex !== -1) {
            return secondVowelIndex + firstVowelIndex + 1;
        }

        return firstVowelIndex;
    }

    pinyinArea.changeWord = function (value, cursor, key) {
        // todo search for other word separators
        var valueTilCursor = value.slice(0, cursor),
            lastSpace = valueTilCursor.lastIndexOf(" "),
            lastNewline = valueTilCursor.lastIndexOf("\n"),
            beginningOfLastWord = Math.max(lastSpace, lastNewline) + 1,
            word = value.slice(beginningOfLastWord, cursor),
            strippedWord = stripCurrentAccents(word),
            idx = indexOfVowelToChange(strippedWord),
            newValue = "", newWord= "";
        if (idx !== -1) {
            newWord += strippedWord.slice(0, idx+1);
            newWord += MODIFIERS[key];
            newWord += strippedWord.slice(idx+1);
        } else {
            newWord += word + key;
        }
        newValue += value.slice(0, beginningOfLastWord);
        newValue += newWord;
        newValue += value.slice(cursor);
        if (newWord.length !== word.length) {
            // advances cursor when adding accent
            cursor += 1;
        }
        return [newValue, cursor];
    };

    pinyinArea.pinyinify = function (textarea) {
        textarea.onkeypress = function (oEvent) {
            var key = oEvent.key,
                cursorPosition = this.selectionStart,
                textvalue = this.value,
                prevCharacter = textvalue[cursorPosition - 1];

            if (!MODIFIERS.hasOwnProperty(key)) {
                return;
            }

            if (key == ":" && prevCharacter == "u") {
                this.value = insertIntoString(this.value, "\u00fc", cursorPosition);
                this.setSelectionRange(cursorPosition, cursorPosition);
                return false;
            } else if (key !== ":") {
                var ret = pinyinArea.changeWord(this.value, cursorPosition, key);
                this.value = ret[0];
                this.setSelectionRange(ret[1], ret[1]);
                return false;
            }
        };
    };

    if( typeof exports !== 'undefined' ) {
        if( typeof module !== 'undefined' && module.exports ) {
            exports = module.exports = pinyinArea
        }
        exports.pinyinArea = pinyinArea
    }
    else {
        root.pinyinArea = pinyinArea
    }
}).call(this);
