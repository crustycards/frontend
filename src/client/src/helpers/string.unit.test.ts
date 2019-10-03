import {removeAdjacentDuplicateCharacters} from './string';

describe('time', () => {
  it('should process strings correctly', () => {
    expect(removeAdjacentDuplicateCharacters('Hello _____ world _.', '_')).toEqual('Hello _ world _.');
    expect(removeAdjacentDuplicateCharacters('Hello world.', '_')).toEqual('Hello world.');
    expect(removeAdjacentDuplicateCharacters('_ __ ___ ____ _____ ______ _______ ________ _________ __________', '_'))
                                    .toEqual('_ _ _ _ _ _ _ _ _ _');
    expect(removeAdjacentDuplicateCharacters('_ __ ___ ____ _____ ______ _______ ________ _________ __________', 'a'))
                                    .toEqual('_ __ ___ ____ _____ ______ _______ ________ _________ __________');
  });

  it('should process strings correctly', () => {
    expect(() => removeAdjacentDuplicateCharacters('', '')).toThrowError('Character must have a length of 1');
    expect(() => removeAdjacentDuplicateCharacters('', 'foo')).toThrowError('Character must have a length of 1');
  });
});
