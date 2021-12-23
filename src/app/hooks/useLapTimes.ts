import { ref, provide } from "vue";

const key = Symbol("laps");
const lapTimes = ref([] as number[]);
export const setLapTimes = (laptime: number) => lapTimes.value.push(laptime);

export default provide(key, [lapTimes, setLapTimes]);
