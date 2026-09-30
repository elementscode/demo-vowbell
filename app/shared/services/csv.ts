/** One CSV field, quoted when it has to be. */
export function csvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function csvRow(values: string[]): string {
  return values.map(csvField).join(",");
}

/** Rows of fields. Handles quotes, escaped quotes, and CRLF. */
export function parseCsv(text: string): string[][] {
  let rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    let c = text[i];

    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }

      continue;
    }

    switch (c) {
      case '"':
        quoted = true;
        break;

      case ",":
        row.push(field);
        field = "";
        break;

      case "\r":
        break;

      case "\n":
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        break;

      default:
        field += c;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((f) => f.trim() !== ""));
}
