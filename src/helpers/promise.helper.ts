/**
 * waits until the condition is met
 * @param interval In ms. The default value is enough in most cases
 */
export function until(conditionFunction: () => boolean, interval = 10) {
    const poll = (resolve: (v: any) => void) => {
        if(conditionFunction()) resolve(null);
        else setTimeout(_ => poll(resolve), interval);
    }

    return new Promise(poll);
}

// wait...
export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, ms)
  })
}
