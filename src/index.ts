import type {
  PluginFunc,
  UnitTypeLongPlural,
  ConfigTypeMap,
  Dayjs as NonPrivateDayjs,
} from "dayjs";
import "dayjs/plugin/toObject";
import "dayjs/plugin/arraySupport";

export type InternalRoundableUnit =
  | Exclude<UnitTypeLongPlural, "dates" | "days" | "months" | "years">
  | "date";
declare module "dayjs" {
  export interface Dayjs {
    round(unit: RoundableUnit): NonPrivateDayjs;
  }
  export type RoundableUnit = InternalRoundableUnit;
}

/**
 * Requires `dayjs/plugin/toObject` & `dayjs/plugin/arraySupport`
 **/
const plugin: PluginFunc = (_, Dayjs, dayjs) => {
  Dayjs.prototype.round = function (unit: InternalRoundableUnit) {
    const object = this.toObject() as ReturnType<
      typeof Dayjs.prototype.toObject
    >;
    const unitsToMax = [
      ["years", 1],
      ["months", 12],
      ["date", this.daysInMonth()],
      ["hours", 24],
      ["minutes", 60],
      ["seconds", 60],
      ["milliseconds", 1000],
    ] as const;

    const entries = Object.entries(object) as [InternalRoundableUnit, number][];
    const unitIndex = entries.findIndex(([entryUnit]) => unit === entryUnit);
    if (unitIndex === -1) return this;
    if (unitIndex === unitsToMax.length - 1)
      return this.set(unit, Math.round(this.get(unit)));

    const unitNum = entries[unitIndex][1];

    const newUnitNum = Math.round(
      unitNum + entries[unitIndex + 1][1] / unitsToMax[unitIndex + 1][1],
    );

    const array = entries.map(([, timeUnit], index) =>
      index < unitIndex ? timeUnit : index === unitIndex ? newUnitNum : 0,
    );

    return dayjs(array as ConfigTypeMap["arraySupport"]);
  };
};

export default plugin;
