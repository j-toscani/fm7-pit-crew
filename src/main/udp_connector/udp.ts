import dgram from "dgram";
import createHandleMessage from "./handleUdpMessage";

const udp = dgram.createSocket("udp4");
const handleMessage = createHandleMessage();

udp.on("connect", handleConnect);
udp.on("close", handleClose);
udp.on("message", handleMessage);

export default udp;

function handleClose() {
    console.log("Connection closed @ ", new Date());
}

function handleConnect() {
    console.log("Connection established @ ", new Date())
}