export default function createHandleMessage() {
  return (newMessage: Buffer) => {
    console.log(newMessage);
  };
}
