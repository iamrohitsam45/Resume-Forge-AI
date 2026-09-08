import puppeteer from 'puppeteer';
import ApiError from '../utils/ApiError.js';
import { resumeToHtml } from './htmlResumeService.js';

let browserPromise = null;

async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer
      .launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      .catch((err) => {
        browserPromise = null;
        throw err;
      });
  }
  return browserPromise;
}

// Renders the resume to a real, text-selectable PDF by having headless Chromium
// print the same ATS-safe HTML the live preview uses - not a screenshot, so fonts,
// spacing, margins, page size, and links are preserved exactly.
export async function generateResumePdf(resume) {
  const html = resumeToHtml(resume, { forPrint: true });
  let browser;
  try {
    browser = await getBrowser();
  } catch (err) {
    throw new ApiError(
      503,
      'Server-side PDF rendering is unavailable in this environment. Use "Print / Save as PDF" from the resume preview instead.'
    );
  }
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: resume.pageSize === 'Letter' ? 'Letter' : 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });
    return pdfBuffer;
  } finally {
    await page.close();
  }
}

export async function closePdfEngine() {
  if (browserPromise) {
    const browser = await browserPromise.catch(() => null);
    if (browser) await browser.close();
    browserPromise = null;
  }
}

export default { generateResumePdf, closePdfEngine };
