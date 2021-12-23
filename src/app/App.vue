<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  data(): {
    addresses: string[];
  } {
    return {
      addresses: [],
    };
  },
  methods: {
    handleMessageEvent(event: MessageEvent) {
      const [port] = event.ports;
      let then = Date.now();
      port.onmessage = (message) => {
        if (message.data.event === "address") {
          this.addresses = message.data.data;
        } else {
          if (Date.now() - then > 1000) {
            console.log(message.data);
            then = Date.now();
          }
        }
      };
      port.postMessage("start");
    },
  },
  mounted() {
    window.addEventListener("message", this.handleMessageEvent);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.handleMessageEvent);
  },
});
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <h1>Possible connections:</h1>
    <table>
      <tbody>
        <tr v-for="address in addresses" :key="address">
          <td>IP: {{ address }}</td>
          <td>Port: 4400</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
