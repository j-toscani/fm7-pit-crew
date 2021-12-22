<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  mounted() {
    window.addEventListener("message", (event) => {
      const [port] = event.ports;
      port.onmessage = handleMessage;
      port.postMessage("start");
      function handleMessage(message: any) {
        console.log(message);
      }
    });
  },
});
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <div>
    <h1>Hello World!</h1>
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
