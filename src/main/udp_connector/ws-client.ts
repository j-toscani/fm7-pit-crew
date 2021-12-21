import udp from "./udp";

export default function createWsClient(url: string) {
  const ws = new WebSocket(url);
  ws.addEventListener("open", handleOpen);
  ws.addEventListener("close", handleClose);
  ws.addEventListener("error", handleError);

  return ws;
}

function handleOpen() {
  console.log("Connection opened!");
}

function handleClose() {
  udp.close();
  console.log("Connection closed!");
}

function handleError(error: any) {
  console.log(error);
}
