# dayjs-plugin-round

> [!IMPORTANT]
> This repo's structure is originally [`dayjs-plugin-time`](https://github.com/ej-shafran/dayjs-plugin-time-interval).
> go check it out!

This plugin adds the `dayjs().round` function allowing you to round specified units

For example:

```ts
import dayjs from "dayjs";
import round from "dayjs-plugin-round";

dayjs.extend(round);

const x = dayjs("2025-12-16T12:25:00");

const y = x.round("hours");

y.toISOString(); // "2025-12-16T12:00:00.000Z"

const w = dayjs("2025-12-16T12:45:00");

const z = w.round("hours");

z.toISOString(); // "2025-12-16T13:00:00.000Z"
```

or

```ts
import dayjs from "dayjs";
import round from "dayjs-plugin-round";

dayjs.extend(round);

const x = dayjs("2025-12-16T12:12:53");

const y = x.round("date");

y.toISOString(); // "2025-12-17T00:00:00.000Z"
```
