import { CSV } from "https://js.sabae.cc/CSV.js";

const fns = [
  "fukui-event-conference.csv",
  "fukui-event-sports.csv",
  "fukui-event-tradefair.csv",
];

const parseMD = (md) => {
  const m = md.match(/(\d+)月(\d+)日/);
  if (!m) return null;
  return m[1].padStart(2, "0") + "-" + m[2].padStart(2, "0");
};

const format = (item) => {
  const y = item["開催年"];
  const start = item["開催日"];
  const end = item["開催終了日"];
  delete item["開催年"];
  const s1 = parseMD(start);
  if (s1) {
    item["開催日"] = y + "-" + s1;
  } else {
    item["開催日"] = y + "年" + start;
  }
  const e1 = parseMD(end);
  if (e1) {
    item["開催終了日"] = y + "-" + e1;
  }
  item["参加者予定数"] = item["参加者予定数"].replace(/\,/g, "").trim();
  delete item["ID"];
  return item;
};

const list = [];
for (const fn of fns) {
  const data = await CSV.fetchJSON(fn);
  data.forEach(i => list.push(format(i)));
}
await Deno.writeTextFile("fukui-event-all.csv", CSV.stringify(list));
