import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";

import dayjs from "dayjs";
import toObject from "dayjs/plugin/toObject";
import arraySupport from "dayjs/plugin/arraySupport";
import roundPlugin from "./index";
dayjs.extend(toObject);
dayjs.extend(arraySupport);
dayjs.extend(roundPlugin);

describe("Round Plugin (Milliseconds)", () => {
  const milliseconds = Array.from({ length: 60 }).map((_, millisecond) =>
    dayjs()
      .set("milliseconds", millisecond)
      .set("seconds", faker.number.int({ min: 0, max: 59 })),
  );
  milliseconds.forEach((millisecond) => {
    const formattedSecond =
      millisecond.millisecond() >= 50
        ? millisecond.set("milliseconds", Math.round(millisecond.millisecond()))
        : millisecond;
    it(`${millisecond.round("milliseconds").toISOString()} should equal to ${formattedSecond.toISOString()} which was ${millisecond.toISOString()}`, () => {
      expect(millisecond.round("milliseconds").toISOString()).toEqual(
        formattedSecond.toISOString(),
      );
    });
  });
});

describe("Round Plugin (Seconds)", () => {
  const seconds = Array.from({ length: 60 }).map((_, second) =>
    dayjs()
      .set("seconds", second)
      .set("millisecond", faker.number.int({ min: 0, max: 1000 })),
  );
  seconds.forEach((second) => {
    const formattedSecond = (
      second.millisecond() >= 500 ? second.add(1, "second") : second
    ).millisecond(0);
    it(`${second.round("seconds").toISOString()} should equal to ${formattedSecond.toISOString()} which was ${second.toISOString()}`, () => {
      expect(second.round("seconds").toISOString()).toEqual(
        formattedSecond.toISOString(),
      );
    });
  });
});

describe("Round Plugin (Minutes)", () => {
  const minutes = Array.from({ length: 60 }).map((_, minute) =>
    dayjs()
      .set("minute", minute)
      .set("seconds", faker.number.int({ min: 0, max: 59 })),
  );
  minutes.forEach((minute) => {
    const formattedMinute = (
      minute.second() >= 30 ? minute.add(1, "minute") : minute
    )
      .second(0)
      .millisecond(0);
    it(`${minute.round("minutes").toISOString()} should equal to ${formattedMinute.toISOString()} which was ${minute.toISOString()}`, () => {
      expect(minute.round("minutes").toISOString()).toEqual(
        formattedMinute.toISOString(),
      );
    });
  });
});

describe("Round Plugin (Hours)", () => {
  const hours = Array.from({ length: 24 }).map((_, hour) =>
    dayjs()
      .set("hour", hour)
      .set("minutes", faker.number.int({ min: 0, max: 59 })),
  );
  hours.forEach((hour) => {
    const formattedHour = (hour.minute() >= 30 ? hour.add(1, "hour") : hour)
      .minute(0)
      .second(0)
      .millisecond(0);
    it(`${hour.round("hours").toISOString()} should equal to ${formattedHour.toISOString()} which was ${hour.toISOString()}`, () => {
      expect(hour.round("hours").toISOString()).toEqual(
        formattedHour.toISOString(),
      );
    });
  });
});

describe("Round Plugin (Dates)", () => {
  const dates = Array.from({ length: 31 }).map((_, date) =>
    dayjs()
      .set("date", date)
      .set("hours", faker.number.int({ min: 0, max: 24 })),
  );

  dates.forEach((date) => {
    const formattedDate = (date.hour() >= 12 ? date.add(1, "day") : date)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    it(`${date.round("date").toISOString()} should equal to ${formattedDate.toISOString()} which was ${date.toISOString()}`, () => {
      expect(date.round("date").toISOString()).toEqual(
        formattedDate.toISOString(),
      );
    });
  });
});
