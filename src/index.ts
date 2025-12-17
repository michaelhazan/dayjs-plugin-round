import type {
  PluginFunc,
  Dayjs as NonPrivateDayjs,
  UnitTypeLong as NonPrivateUnitTypeLong,
  UnitType,
} from "dayjs";

// TODO: see how to handle months and years, cause of utc behavior can be kinda goofy
type InternalRoundableUnit = Exclude<
  UnitType,
  "M" | "month" | "months" | "y" | "year" | "years"
>;

declare module "dayjs" {
  export interface Dayjs {
    round(unit: RoundableUnit): NonPrivateDayjs;
    // Expose internal utils
    $utils(): {
      p(unit: string): NonPrivateUnitTypeLong;
    };
  }

  export type RoundableUnit = InternalRoundableUnit;
}

const plugin: PluginFunc = (_, Dayjs) => {
  Dayjs.prototype.round = function (unit: InternalRoundableUnit) {
    const formattedUnit = Dayjs.prototype.$utils().p(unit);
    const unitsToMax: [NonPrivateUnitTypeLong, number][] = [
      ["year", 1],
      ["month", 12],
      ["date", this.daysInMonth()],
      ["hour", 24],
      ["minute", 60],
      ["second", 60],
      ["millisecond", 1000],
    ] as const;

    const unitIndex = unitsToMax.findIndex(
      ([entryUnit]) => formattedUnit === entryUnit,
    );
    if (unitIndex === -1) return this;
    if (unitIndex === unitsToMax.length - 1)
      return this.set(unit, Math.round(this.get(unit)));

    const newUnitNum = Math.round(
      this.get(formattedUnit) +
        this.get(unitsToMax[unitIndex + 1][0]) / unitsToMax[unitIndex + 1][1],
    );

    return (
      unitsToMax
        .slice(unitIndex)
        .map(([measurement], index) => [
          measurement,
          index === 0 ? newUnitNum : 0,
        ]) as [NonPrivateUnitTypeLong, number][]
    ).reduce((instance, [measurement, timeUnit]) => {
      return instance.set(measurement, timeUnit);
    }, this.clone());
  };
};

export default plugin;
