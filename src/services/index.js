function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * This function simulates persisting data
 * to network storage by using localStorage
 * and some random delay.
 *
 * This function also simulates failures by
 * flipping a biased coin.
 *
 * @param string key The localStorage key. If
 *  not provided then this call will silently
 *  successful
 * @param any state
 */
async function persistState(key, state) {
  return new Promise((resolve, reject) => {
    if (!key) resolve();
    // random delay from 200 to 4000 ms
    const delay = getRandomInt(200, 4000);
    // flip a biased coin to determine if this call will fail
    const isFailed = getRandomInt(1, 100) < 10;
    console.debug(
      `persistState() This call will resolve in ${delay} ms and it will ${
        isFailed ? "fail" : "succeed"
      }`
    );
    // Actually do the persisting after random delay
    setTimeout(() => {
      if (isFailed) {
        reject(
          new Error("Failed persisting data. Caused by 'simulated reason'.")
        );
      } else {
        localStorage.setItem(key, JSON.stringify(state));
        resolve();
      }
    }, delay);
  });
}

/**
 * This function simulates loading state
 * from the networkby using localStorage
 * and some random delay.
 *
 * This function also simulates failures
 * by flipping a biased coin.
 *
 * @param string key The localStorage key.
 *  If not provided then this call will resolve
 * @param any state The object to be persisted
 */
async function loadState(key) {
  return new Promise((resolve, reject) => {
    if (!key) resolve();
    // random delay from 200 to 4000 ms
    const delay = getRandomInt(200, 4000);
    // flip a biased coin to determine if this call will fail
    const isFailed = getRandomInt(1, 100) < 10;
    console.debug(
      `loadState() This call will resolve in ${delay} ms and it will ${
        isFailed ? "fail" : "succeed"
      }`
    );
    // Actually do the loading after random delay
    setTimeout(() => {
      if (isFailed)
        return reject(
          new Error("Failed loading data. Caused by 'simulated reason'.")
        );

      let state = localStorage.getItem(key);
      if (state === null)
        return reject(new Error("Failed loading data. Invalid key was used."));
      try {
        state = JSON.parse(state);
      } catch (err) {
        return reject(
          new Error("Failed loading data. Invalid format. " + err.message)
        );
      }

      return resolve(state);
    }, delay);
  });
}

export default { persistState, loadState };
