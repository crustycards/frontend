// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
const specialCharsRegex = /[.*+?^${}()|[\]\\]/g;

// http://www.ecma-international.org/ecma-262/5.1/#sec-15.10.2.6
const wordCharacterRegex = /[a-z0-9_]/i;

const whitespacesRegex = /\s+/;

const escapeRegexCharacters = (str: string) => (str.replace(specialCharsRegex, '\\$&'));

const match = (text: string, query: string): number[][] => (
  query
    .trim()
    .split(whitespacesRegex)
    .filter((word) => (word.length > 0))
    .reduce((result, word) => {
      const wordLen = word.length;
      const prefix = wordCharacterRegex.test(word[0]) ? '\\b' : '';
      const regex = new RegExp(prefix + escapeRegexCharacters(word), 'i');
      const index = text.search(regex);

      if (index > -1) {
        result.push([index, index + wordLen]);

        // Replace what we just found with spaces so we don't find it again.
        text =
          text.slice(0, index) +
          new Array(wordLen + 1).join(' ') +
          text.slice(index + wordLen);
      }

      return result;
    }, [])
    .sort((match1, match2) => match1[0] - match2[0])
);

interface HighlightObject {
  text: string;
  highlight: boolean;
}

const parse = (text: string, matches: number[][]): HighlightObject[] => {
  const result: HighlightObject[] = [];

  if (matches.length === 0) {
    result.push({
      text,
      highlight: false
    });
  } else {
    if (matches[0][0] > 0) {
      result.push({
        text: text.slice(0, matches[0][0]),
        highlight: false
      });
    }
  }

  matches.forEach((match, i) => {
    const startIndex = match[0];
    const endIndex = match[1];

    result.push({
      text: text.slice(startIndex, endIndex),
      highlight: true
    });

    if (i === matches.length - 1) {
      if (endIndex < text.length) {
        result.push({
          text: text.slice(endIndex, text.length),
          highlight: false
        });
      }
    } else if (endIndex < matches[i + 1][0]) {
      result.push({
        text: text.slice(endIndex, matches[i + 1][0]),
        highlight: false
      });
    }
  });

  return result;
};

export default (text: string, query: string) => parse(text, match(text, query));
