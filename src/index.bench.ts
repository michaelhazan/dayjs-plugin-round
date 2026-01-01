import dayjs from "dayjs";
import { bench, describe } from "vitest";
import { getTimes } from "./index.spec";
import round from "./index";

dayjs.extend(round);
const benching = (unit: dayjs.RoundableUnit) => {
  const benches = getTimes(unit, 1000000);
  bench("Benching 1000000 iterations", () =>
    benches.forEach((time) => time.round(unit)),
  );
};

describe("Round Plugin (Milliseconds)", () => {
  benching("millisecond");
});

describe("Round Plugin (Seconds)", () => {
  benching("second");
});

describe("Round Plugin (Minutes)", () => {
  benching("minute");
});

describe("Round Plugin (Hours)", () => {
  benching("hour");
});

describe("Round Plugin (Dates)", () => {
  benching("date");
});
