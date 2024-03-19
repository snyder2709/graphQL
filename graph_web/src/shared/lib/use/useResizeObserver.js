import { useRefNumber } from "@/shared/lib/use/base/useRefNumber";
import { throttle } from "@/shared/lib/utils/throttle";

export function useResizeObserver(el, ms = 1000) {
  const { value: screenWidth, setValue } = useRefNumber(0);

  const throttled = throttle(setScreenWidth, ms);
  const observer = new ResizeObserver(throttled);
  observer.observe(el);

  function setScreenWidth(entries) {
    const width = entries[0].contentRect.width;
    setValue(width);
  }

  return {
    screenWidth,
  };
}
