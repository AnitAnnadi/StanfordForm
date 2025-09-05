// server/utils/generateCertificatePDF.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate a certificate PDF with background image + overlaid text.
 * @param {Object} opts
 * @param {string} opts.name - Recipient full name
 * @param {string} opts.date - YYYY-MM-DD string to print
 * @param {string} opts.outputDir - Directory to write the file into
 * @param {string} opts.backgroundPath - Absolute path to the PNG/JPG background
 * @param {string} [opts.fontPath] - Optional absolute path to a .ttf font
 * @returns {Promise<string>} absolute file path to the generated PDF
 */
export function generateCertificatePDF({
  name,
  date,
  outputDir,
  backgroundPath,
  fontPath,
}) {
  return new Promise((resolve, reject) => {
    const safeName = name.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_');
    const filename = `certificate_${safeName}_${date}.pdf`;
    const filePath = path.join(outputDir, filename);

    // LETTER landscape = 792 x 612 points (1pt = 1/72 inch)
    const doc = new PDFDocument({ size: 'LETTER', layout: 'landscape' });

    const stream = fs.createWriteStream(filePath);
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);

    doc.pipe(stream);

    // Background full-bleed
    doc.image(backgroundPath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    if (fontPath) {
      doc.font(fontPath);
    } else {
      doc.font('Helvetica'); // fallback
    }

    doc.fillColor('black');

    // Positions translated from your React inline styles:
    // name at ~50% vertical, centered
    const centerX = doc.page.width / 2;
    const nameY = doc.page.height * 0.50;
    const dateY = doc.page.height * 0.64;
    const dateX = doc.page.width * 0.56; // left ~56%

    // Name
    doc.fontSize(30);
    const nameWidth = doc.widthOfString(name);
    doc.text(name, centerX - nameWidth / 2, nameY, { lineBreak: false });

    // Date (YYYY-MM-DD)
    doc.fontSize(20);
    doc.text(date, dateX, dateY, { lineBreak: false });

    doc.end();
  });
}
