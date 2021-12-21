import os from "os";

export default function suggestIpAdresses() {
  const addresses = getIpAdresses();
  const home = "- 127.0.0.1 -";
  console.log(
    "If this application and Forza Motorsport run on the same machine, enter",
    home,
    "in the FM7 HUD options. Also, open your command line as Administrator and run/type in 'CheckNetIsolation.exe LoopbackExempt -a -n=microsoft.apollobasegame_8wekyb3d8bbwe'.\n"
  );
  console.log(
    "If you play on XBOX you can use one of the following adresses. You do not need to run the above command. \n"
  );

  console.log("The addresses are: \n");
  addresses.map((address) => console.log(`- ${address} -`, "\n"));
}

function getIpAdresses() {
  const interfaces = os.networkInterfaces();
  const ip4Adresses = Object.values(interfaces)
    .flat()
    .filter(
      (entry) => entry?.family === "IPv4" && entry.address !== "127.0.0.1"
    )
    .map((entry) => entry?.address);
  return ip4Adresses;
}
