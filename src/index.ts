import type dayjsType from "dayjs";

// TODO: see how to handle months and years, cause of utc behavior can be kinda goofy
type InternalRoundableUnit = Exclude<
  dayjsType.UnitType,
  "M" | "month" | "months" | "y" | "year" | "years"
>;

const plugin: dayjsType.PluginFunc = (_, Dayjs) => {
  Dayjs.prototype.round = function (unit: InternalRoundableUnit) {
    const formattedUnit = Dayjs.prototype.$utils().p(unit);
    const unitsToMax: [dayjsType.UnitTypeLong, number][] = [
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
        ]) as [dayjsType.UnitTypeLong, number][]
    ).reduce((instance, [measurement, timeUnit]) => {
      return instance.set(measurement, timeUnit);
    }, this.clone());
  };
};

export default plugin;

declare module "dayjs" {
  export interface Dayjs {
    round(unit: RoundableUnit): dayjsType.Dayjs;
    // Expose internal utils
    $utils(): {
      p(unit: string): dayjsType.UnitTypeLong;
    };
  }

  export type RoundableUnit = InternalRoundableUnit;
}
