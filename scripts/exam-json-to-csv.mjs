import fs from "node:fs";
import path from "node:path";

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const root = process.cwd();
const inputPath = path.join(root, "exam_questions.json");
const outputPath = path.join(root, "exam_questions.csv");

if (!fs.existsSync(inputPath)) {
  console.error(`Missing file: ${inputPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, "utf8");
const sets = JSON.parse(raw);

if (!Array.isArray(sets)) {
  console.error("Expected exam_questions.json to be an array");
  process.exit(1);
}

// Flatten into rows for Supabase table `exam_phrases`
const rows = [];
for (const set of sets) {
  const difficulty = String(set?.difficulty ?? "").toLowerCase();
  const phrases = Array.isArray(set?.phrases) ? set.phrases : [];

  for (let i = 0; i < phrases.length; i++) {
    const p = phrases[i] ?? {};
    rows.push({
      difficulty,
      question_number: i + 1,
      telugu: p.telugu ?? "",
      pronunciation: p.pronunciation ?? "",
      english: p.english ?? "",
      sort_order: i + 1,
    });
  }
}

const header = ["difficulty", "question_number", "telugu", "pronunciation", "english", "sort_order"];
const lines = [header.join(",")];
for (const r of rows) {
  lines.push(
    [
      csvEscape(r.difficulty),
      csvEscape(r.question_number),
      csvEscape(r.telugu),
      csvEscape(r.pronunciation),
      csvEscape(r.english),
      csvEscape(r.sort_order),
    ].join(",")
  );
}

fs.writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(`Wrote ${rows.length} rows to ${outputPath}`);

