export const removeAdjacentDuplicateCharacters =
(input: string, character: string) => {
  if (character.length !== 1) {
    throw Error('Character must have a length of 1');
  }

  const outCharArray: string[] = [];

  for (let i = 0; i < input.length; i++) {
    if (!(input[i] === input[i - 1] && input[i] === character)) {
      outCharArray.push(input[i]);
    }
  }

  return outCharArray.join('');
};
