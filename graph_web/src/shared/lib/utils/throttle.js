export function throttle(func, ms) {
  let isThrottled = false;
  let savedArgs;
  let savedThis;

  function throttleWrapper(this) {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }
    func.apply(this, arguments);

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;

      if (savedArgs) {
        throttleWrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return throttleWrapper;
}
