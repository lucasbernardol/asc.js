import { ratio } from './lib/asc';

const x = ratio({
  width(...args) {
    return 1920 * 4;
  },
  height() {
    return 1080 * 4;
  },
});

console.log(x);
