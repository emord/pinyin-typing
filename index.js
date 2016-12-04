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
    var tmpString = word, tmpIndex, previousIndex, retIndex;

    while (!retIndex) {
        tmpIndex = tmpString.search(VOWELS);
        if (tmpIndex === -1) {
            return previousIndex || -1;
        }
        if ("iu\u00fc".includes(tmpString[tmpIndex])) {
            tmpString = tmpString.slice(tmpIndex + 1);
            previousIndex = tmpIndex;
        } else {
            if (tmpIndex !== -1) {
                if (previousIndex) {
                    retIndex = tmpIndex + previousIndex + 1;
                } else {
                    retIndex = tmpIndex;
                }
            } else {
                ret = previousIndex;
            }
        }
    }

    return retIndex;
}

function changeWord (area, cursor, key) {
    // todo search for other word separators
    var value = area.value,
        beginningOfLastWord = value.slice(0, cursor).lastIndexOf(" ") + 1,
        word = value.slice(beginningOfLastWord, cursor),
        strippedWord = stripCurrentAccents(word),
        idx = indexOfVowelToChange(strippedWord),
        newValue = "";
    newValue += value.slice(0, beginningOfLastWord);
    if (idx !== -1) {
        newValue += strippedWord.slice(0, idx+1);
        newValue += MODIFIERS[key];
        newValue += strippedWord.slice(idx+1);
    } else {
        newValue += word + key;
    }
    newValue += value.slice(cursor);
    if (strippedWord !== word) {
        cursor += 1;
    }
    area.setSelectionRange(cursor, cursor);
    return newValue;
}

function pinyinify (textarea) {
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
            this.value = changeWord(this, cursorPosition, key);
            return false;
        }
    };
}

// if (!exports) {exports = {};};

// exports.stripCurrentAccents = stripCurrentAccents;
