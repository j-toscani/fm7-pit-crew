import suggestIpAdresses from "./suggestIpAdresses";
import udp from "./udp";

const UDP_PORT = 4400;

export default function startUdp() {
  udp.bind(UDP_PORT, () => {
    console.log("Server bound to port:", UDP_PORT);
    suggestIpAdresses();
    console.log(
      "Enter",
      UDP_PORT,
      "as the Port in the Forza Motorsport HUD options \n"
    );
  });
}
