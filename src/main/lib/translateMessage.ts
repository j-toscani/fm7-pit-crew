import options from "./options";

export default function translateMessage(message: Buffer) {
  return options.map((option) => decode(message, option));
}

function decode(message: Buffer, option: typeof options[number]) {
  const { byteToRead, encoding } = option;
  switch (encoding) {
    case "f32":
      return message.readFloatLE(byteToRead);
    case "u32":
      return message.readUInt32LE(byteToRead);
    case "u16":
      return message.readUInt16LE(byteToRead);
    case "s8":
      return message.readInt8(byteToRead);
    case "u8":
      return message.readUInt8(byteToRead);
    case "s32":
      return message.readInt32LE(byteToRead);
    default:
      throw Error("Unknown decoding");
  }
}
