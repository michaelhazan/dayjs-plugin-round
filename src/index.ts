import type dayjsType from "dayjs";

// TODO: see how to handle months and years, cause of utc behavior can be kinda goofy
type InternalRoundableUnit = Exclude<
  dayjsType.UnitType,
  "M" | "month" | "months" | "y" | "year" | "years"
>;

const plugin: dayjsType.PluginFunc = (_, Dayjs) => {
  const unitsToMax: [dayjsType.UnitTypeLong, number][] = [
    ["year", 1],
    ["month", 12],
    ["date", 31], // NOTE: This isn't actually used
    ["hour", 24],
    ["minute", 60],
    ["second", 60],
    ["millisecond", 1000],
  ] as const;

  Dayjs.prototype.round = function (unit: InternalRoundableUnit) {
    // @ts-expect-error -- inner dayjs utils
    const formattedUnit = Dayjs.prototype.$utils().p(unit);

    if (formattedUnit === "date") unitsToMax[2] = ["date", this.daysInMonth()];

    let found = false;
    let result = this.clone();
    for (let i = 0; i < unitsToMax.length; i++) {
      if (found) {
        const [measurement] = unitsToMax[i];
        result = result.set(measurement, 0);
        continue;
      } else if (i === unitsToMax.length - 1)
        return this.set(unit, Math.round(this.get(unit)));

      if (unitsToMax[i][0] === formattedUnit) {
        found = true;
        result = result.set(
          formattedUnit,
          Math.round(
            this.get(unit) +
              this.get(unitsToMax[i + 1][0]) / unitsToMax[i + 1][1],
          ),
        );
      }
    }

    return result;
  };

  Dayjs.prototype.ceil = function (unit: dayjsType.UnitType) {
    // @ts-expect-error -- inner dayjs utils
    const formattedUnit = Dayjs.prototype.$utils().p(unit);

    let shouldCeil = false;
    let found = false;
    for (let i = 0; i < unitsToMax.length; i++) {
      if (found) {
        shouldCeil = this.get(unitsToMax[i][0]) > 0;
        if (shouldCeil) break;
        continue;
      }

      if (unitsToMax[i][0] === formattedUnit) {
        found = true;
      }
    }

    if (!shouldCeil) return this;

    return this.endOf(unit).add(1, "millisecond");
  };

  Dayjs.prototype.floor = function (unit: dayjsType.UnitType) {
    return this.startOf(unit);
  };
};

export default plugin;

declare module "dayjs" {
  export interface Dayjs {
    round(unit: RoundableUnit): dayjsType.Dayjs;
    ceil(unit: dayjsType.UnitType): dayjsType.Dayjs;
    floor(unit: dayjsType.UnitType): dayjsType.Dayjs;
  }

  export type RoundableUnit = InternalRoundableUnit;
}
