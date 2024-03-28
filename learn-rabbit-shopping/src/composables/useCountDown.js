import { ref, computed, onUnmounted } from "vue"
import dayjs from 'dayjs'

export const useCountDown = (time) => {
  const countDown = ref(time);
  // 格式化时间
  const formatTime = computed(() => {
    return dayjs.unix(countDown.value).format('mm:ss')
  }
  const formatTime = 1;
  const timer = ref(null);

  const start = () => {
    timer.value = setInterval(() => {
      countDown.value--;
    }, 1000);
  };

  const stop = () => {
    clearInterval(timer.value);
  };

  // 组件卸载时清除定时器
  onUnmounted(() => {
    clearInterval(timer.value);
  });

  return { countDown, formatTime, start, stop };
}