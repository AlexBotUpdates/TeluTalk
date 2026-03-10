import fs from "node:fs";
import path from "node:path";

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const root = process.cwd();
const inputPath = path.join(root, "phrases.json");
const outputPath = path.join(root, "phrases.csv");

if (!fs.existsSync(inputPath)) {
  console.error(`Missing file: ${inputPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
const days = JSON.parse(raw);

if (!Array.isArray(days)) {
  console.error("Expected phrases.json to be an array");
  process.exit(1);
}

/** Flatten into rows for Supabase table `phrases` */
const rows = [];
for (const dayObj of days) {
  const day = Number(dayObj?.day);
  const topic = (dayObj?.topic ?? "").toString();
  const phrases = Array.isArray(dayObj?.phrases) ? dayObj.phrases : [];

  for (let i = 0; i < phrases.length; i++) {
    const p = phrases[i] ?? {};
    rows.push({
      day,
      topic,
      telugu: p.telugu ?? "",
      pronunciation: p.pronunciation ?? "",
      english: p.english ?? "",
      sort_order: i + 1,
    });
  }
}

const header = ["day", "topic", "telugu", "pronunciation", "english", "sort_order"];
const lines = [header.join(",")];
for (const r of rows) {
  lines.push(
    [
      csvEscape(r.day),
      csvEscape(r.topic),
      csvEscape(r.telugu),
      csvEscape(r.pronunciation),
      csvEscape(r.english),
      csvEscape(r.sort_order),
    ].join(",")
  );
}

fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${rows.length} rows to ${outputPath}`);

