import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";

import dayjs from "dayjs";
import toObject from "dayjs/plugin/toObject";
import arraySupport from "dayjs/plugin/arraySupport";
import roundPlugin from "./index";
dayjs.extend(toObject);
dayjs.extend(arraySupport);
dayjs.extend(roundPlugin);

const unitsToMax: [dayjs.UnitTypeLong, number][] = [
  ["year", 1],
  ["month", 12],
  ["date", dayjs().daysInMonth()],
  ["hour", 24],
  ["minute", 60],
  ["second", 60],
  ["millisecond", 1000],
] as const;

export const getTimes = (unit: dayjs.RoundableUnit, amount?: number) => {
  const unitIndex = unitsToMax.findIndex(([indexUnit]) => indexUnit === unit);
  const lowerIndex =
    unitIndex === unitsToMax.length - 1 ? unitsToMax.length - 2 : unitIndex + 1;
  return Array.from({ length: amount ?? unitsToMax[unitIndex][1] }).map(
    (_, time) =>
      dayjs()
        .set(
          unit,
          amount
            ? time
            : faker.number.int({ min: 0, max: unitsToMax[unitIndex][1] }),
        )
        .set(
          unitsToMax[lowerIndex][0],
          faker.number.int({ min: 0, max: unitsToMax[unitIndex][1] }),
        ),
  );
};

const test = (
  unit: dayjs.RoundableUnit,
  toCheck: "round" | "floor" | "ceil",
  expected: dayjs.Dayjs,
  prior: dayjs.Dayjs,
) => {
  const result = prior[toCheck](unit);
  it(`${toCheck} ${unit} - ${result.toISOString()} should equal to ${expected.toISOString()} which was ${prior.toISOString()}`, () => {
    expect(prior[toCheck](unit).toISOString()).toEqual(expected.toISOString());
  });
};

describe("Round Plugin (Milliseconds)", () => {
  const milliseconds = getTimes("millisecond");
  milliseconds.forEach((millisecond) => {
    const formattedSecond =
      millisecond.millisecond() >= 500
        ? millisecond.set("milliseconds", Math.round(millisecond.millisecond()))
        : millisecond;
    test("millisecond", "round", formattedSecond, millisecond);
  });

  milliseconds.forEach((millisecond) => {
    const formattedSecond = millisecond;

    test("millisecond", "floor", formattedSecond, millisecond);
  });
  milliseconds.forEach((millisecond) => {
    const formattedSecond = millisecond;

    test("millisecond", "ceil", formattedSecond, millisecond);
  });
});

describe("Round Plugin (Seconds)", () => {
  const seconds = getTimes("second");
  seconds.forEach((second) => {
    const formattedSecond = (
      second.millisecond() >= 500 ? second.add(1, "second") : second
    ).millisecond(0);
    test("second", "round", formattedSecond, second);
  });

  seconds.forEach((second) => {
    const formattedSecond = second.millisecond(0);

    test("second", "floor", formattedSecond, second);
  });
  seconds.forEach((second) => {
    const formattedSecond = (
      second.millisecond() > 0 ? second.add(1, "second") : second
    ).millisecond(0);

    test("second", "ceil", formattedSecond, second);
  });
});

describe("Round Plugin (Minutes)", () => {
  const minutes = getTimes("minute");
  minutes.forEach((minute) => {
    const formattedMinute = (
      minute.second() >= 30 ? minute.add(1, "minute") : minute
    )
      .second(0)
      .millisecond(0);
    test("minute", "round", formattedMinute, minute);
  });

  minutes.forEach((minute) => {
    const formattedMinute = minute.second(0).millisecond(0);

    test("minute", "floor", formattedMinute, minute);
  });
  minutes.forEach((minute) => {
    const formattedMinute = (
      minute.second() + minute.millisecond() > 0
        ? minute.add(1, "minutes")
        : minute
    )
      .second(0)
      .millisecond(0);

    test("minute", "ceil", formattedMinute, minute);
  });
});

describe("Round Plugin (Hours)", () => {
  const hours = getTimes("hour");
  hours.forEach((hour) => {
    const formattedHour = (hour.minute() >= 30 ? hour.add(1, "hour") : hour)
      .minute(0)
      .second(0)
      .millisecond(0);
    test("hour", "round", formattedHour, hour);
  });
  hours.forEach((hour) => {
    const formattedHour = hour.minute(0).second(0).millisecond(0);

    test("hour", "floor", formattedHour, hour);
  });
  hours.forEach((hour) => {
    const formattedHour = (
      hour.minute() + hour.second() + hour.millisecond() > 0
        ? hour.add(1, "hour")
        : hour
    )
      .minute(0)
      .second(0)
      .millisecond(0);

    test("hour", "ceil", formattedHour, hour);
  });
});

describe("Round Plugin (Dates)", () => {
  const dates = getTimes("date");

  dates.forEach((date) => {
    const formattedDate = (date.hour() >= 12 ? date.add(1, "day") : date)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    test("date", "round", formattedDate, date);
  });
  dates.forEach((date) => {
    const formattedDate = date.hour(0).minute(0).second(0).millisecond(0);

    test("date", "floor", formattedDate, date);
  });
  dates.forEach((date) => {
    const formattedDate = (
      date.hour() + date.minute() + date.second() + date.millisecond() > 0
        ? date.add(1, "day")
        : date
    )
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);

    test("date", "ceil", formattedDate, date);
  });
});
