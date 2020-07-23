import * as aes from 'aes-js';

// These two functions are intended to be used to transmit data over the wire.
// Values returned by uint8ArrayToOpaqueSerializedString are meant to be used
// and deserialized quickly and should NEVER be stored in a database for
// future deserialization because the implementations of both functions are
// subject to change.

// AES encryption key. This is NOT used for security purposes.
// Its only purpose is to obfuscate data during serialization
// to keep serialized data opaque and prevent callers from
// relying on implementation details.
const key = [1, 16, 3, 14, 5, 12, 7, 10, 9, 8, 11, 6, 13, 4, 15, 2];

// Produces opaque strings that can be decoded with the function below this one.
export const uint8ArrayToOpaqueSerializedString =
(data: Uint8Array): string => {
  return aes.utils.hex.fromBytes(
    new aes.ModeOfOperation.ctr(key).encrypt(data)
  );
};

// Should only ever receive values produced by the function above.
export const opaqueSerializedStringToUint8Array =
(data: string): Uint8Array => {
  try {
    return new aes.ModeOfOperation.ctr(key)
      .decrypt(aes.utils.hex.toBytes(data.trimRight()));
  } catch (err) {
    throw new Error('Value is not properly encoded.');
  }
};
