import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { StatusCodes } from "http-status-codes";
import { generateCertificatePDF } from "../utils/generateCertificatePDF.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- helpers ---
const isValidEmail = (s) =>
  typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

function normalizeEmails(input) {
  if (!input) return [];
  let items = [];

  if (typeof input === "string") {
    items = input.split(",");
  } else if (Array.isArray(input)) {
    items = input.flatMap((it) => {
      if (typeof it === "string") return it;
      if (it && typeof it === "object" && typeof it.email === "string") return it.email;
      return [];
    });
  } else if (typeof input === "object" && typeof input.email === "string") {
    items = [input.email];
  }

  const trimmed = items
    .map((s) => (typeof s === "string" ? s : String(s || "")))
    .map((s) => s.trim())
    .filter(Boolean);

  return [...new Set(trimmed)].filter(isValidEmail);
}

export const createCertificate = async (req, res) => {
  try {
    const { name, info, extraEmails } = req.body;
    if (!name || !info) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Missing required fields: name or info." });
    }

    // Date (YYYY-MM-DD)
    const now = new Date();
    const printedDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    // teacher email (await!)
    let teacherEmail = null;
    if (info?.teacher_id) {
      const teacher = await User.findOne({ _id: info.teacher_id }).select("email").lean();
      teacherEmail = teacher?.email || null;
    } else {
      teacherEmail = info?.teacherEmail || info?.teacher_email || info?.teacher?.email || null;
    }

    // recipients
    const teacherList = normalizeEmails(teacherEmail);
    const extrasList = normalizeEmails(extraEmails);
    const recipients = [...new Set([...teacherList, ...extrasList])];

    if (recipients.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No valid recipient emails provided." });
    }

    // asset paths (relative)
    const backgroundPath = path.join(
      __dirname,
      "..",
      "utils",
      "StanfordReachLabHealthyFuturesCert.png"
    );
    const fontPath = path.join(__dirname, "..", "assets", "fonts", "Roboto-Regular.ttf");
    const outputDir = process.env.CERT_OUTPUT_DIR || path.join(__dirname, "..", "tmp");

    if (!fs.existsSync(backgroundPath)) {
      console.error("Certificate background not found at:", backgroundPath);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Certificate background image missing on server." });
    }

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    // sanitize filename part from name
    const safeName = name.replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_");

    // generate PDF to disk
    const pdfPath = await generateCertificatePDF({
      name,
      date: printedDate,
      outputDir,
      backgroundPath,
      fontPath: fs.existsSync(fontPath) ? fontPath : undefined,
      // optionally pass custom filename if your util supports it
      // filename: `certificate_${safeName}_${printedDate}.pdf`
    });

    // SMTP transporter (uses your .env EMAIL / EMAIL_PASSWORD)
    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "Email credentials are not configured." });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // Gmail App Password
      },
    });

    // Optional: verify transport once while debugging
    // await transporter.verify();

    const subject = "Certificate of Completion — Stanford REACH Lab";
    const text = `Hello,

${name} has completed the Stanford REACH Lab course on ${printedDate}.
A PDF certificate is attached to this email.

— Stanford REACH Lab Data Dashboard
`;
    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;">
  <p>Hello,</p>
  <p><strong>${name}</strong> has completed the Stanford REACH Lab course on <strong>${printedDate}</strong>.</p>
  <p>A PDF certificate is attached to this email.</p>
  <p>— Stanford REACH Lab Data Dashboard</p>
</div>`;

    const to = recipients[0];
    const cc = recipients.slice(1);

    const infoResp = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      cc: cc.length ? cc : undefined,
      subject,
      text,
      html,
      attachments: [
        {
          filename: `certificate_${safeName || "recipient"}_${printedDate}.pdf`,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("Email sent:", infoResp.response);

    // cleanup
    if (process.env.CERT_CLEANUP !== "false") {
      fs.unlink(pdfPath, () => {});
    }

    return res.status(StatusCodes.OK).json({ msg: 'Certificate Created' });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Certificate creation failed." });
  }
};
