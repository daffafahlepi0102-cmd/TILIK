function escapePdfText(value: string) { return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7E]/g, ' '); }

function wrapPdfLine(value: string, width = 92) {
  const result: string[] = [];
  let current = '';
  for (const word of value.split(/\s+/)) {
    if (current && `${current} ${word}`.length > width) {
      result.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  result.push(current);
  return result;
}

export function createPdfDocument(title: string, lines: string[]) {
  const wrappedLines = lines.flatMap(line => wrapPdfLine(line));
  const pageLines = Array.from({ length: Math.max(1, Math.ceil(wrappedLines.length / 42)) }, (_, index) => wrappedLines.slice(index * 42, (index + 1) * 42));
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageLines.map((_, index) => `${4 + index * 2} 0 R`).join(' ')}] /Count ${pageLines.length} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ...pageLines.flatMap((page, index) => {
      const pageNumber = index + 1;
      const content = [
        'BT',
        '/F1 18 Tf',
        '50 790 Td',
        `(${escapePdfText(title)} (${pageNumber}/${pageLines.length})) Tj`,
        '/F1 10 Tf',
        '0 -30 Td',
        ...page.flatMap(line => ['0 -17 Td', `(${escapePdfText(line)}) Tj`]),
        'ET',
      ].join('\n');
      return [
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + index * 2} 0 R >>`,
        `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
      ];
    }),
  ];
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

export function downloadTextPdf(filename: string, title: string, lines: string[]) {
  const pdf = createPdfDocument(title, lines);
  const blob = new Blob([pdf], { type: 'application/pdf' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.style.display = 'none'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
