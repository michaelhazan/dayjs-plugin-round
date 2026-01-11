# dayjs-plugin-round

_This repo's structure is originally from [`dayjs-plugin-time-interval`](https://github.com/ej-shafran/dayjs-plugin-time-interval)_

This plugin adds the `dayjs().round`, `dayjs().floor` and `dayjs().ceil` functions allowing you to round, floor and ceil specified units

## Installation & Setup

```bash
npm i dayjs dayjs-plugin-plugin
# or
pnpm i dayjs dayjs-plugin-round
# etc...
```

Then, just extend the plugin:

```ts
import dayjs from "dayjs";
import round from "dayjs-plugin-round";

dayjs.extend(round);
```

## Examples

### Rounding

```ts
const x = dayjs("2025-12-16T12:25:00");

const y = x.round("hours");

y.toISOString(); // "2025-12-16T12:00:00.000Z"

const w = dayjs("2025-12-16T12:45:00");

const z = w.round("hours");

z.toISOString(); // "2025-12-16T13:00:00.000Z"

const r = dayjs("2025-12-16T12:12:53");

const v = r.round("date");

v.toISOString(); // "2025-12-17T00:00:00.000Z"
```

### Flooring

```ts
const x = dayjs("2025-12-16T12:25:00");

const y = x.floor("hours");

y.toISOString(); // "2025-12-16T12:00:00.000Z"

const w = dayjs("2025-12-16T12:45:00");

const z = w.floor("hours");

z.toISOString(); // "2025-12-16T12:00:00.000Z"

const r = dayjs("2025-12-16T12:12:53");

const v = r.floor("date");

v.toISOString(); // "2025-12-16T00:00:00.000Z"
```

### Ceiling

```ts
const x = dayjs("2025-12-16T12:25:00");

const y = x.ceil("hours");

y.toISOString(); // "2025-12-16T13:00:00.000Z"

const w = dayjs("2025-12-16T12:45:00");

const z = w.ceil("hours");

z.toISOString(); // "2025-12-16T13:00:00.000Z"

const p = dayjs("2025-12-16T12:00:00");

const b = w.ceil("hours");

z.toISOString(); // "2025-12-16T12:00:00.000Z"

const r = dayjs("2025-12-16T12:12:53");

const v = r.ceil("date");

v.toISOString(); // "2025-12-17T00:00:00.000Z"
```
