import puppeteer from 'puppeteer';
import { AttendanceRecord } from '../types/academic.js';
import dotenv from 'dotenv';
import Tesseract from 'tesseract.js';

dotenv.config();

export class ErpScraper {
  public async scrapeAttendance(): Promise<AttendanceRecord[]> {
    const { ERP_USERNAME, ERP_PASSWORD, ERP_LOGIN_URL } = process.env;

    if (!ERP_USERNAME || !ERP_PASSWORD || !ERP_LOGIN_URL) {
      throw new Error("ERP credentials or URL are not configured in .env");
    }

    console.error("Launching headless browser to scrape ERP automatically...");
    const browser = await puppeteer.launch({ headless: true });
    
    let page;
    try {
      page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      
      console.error(`Navigating to ERP Login: ${ERP_LOGIN_URL}`);
      await page.goto(ERP_LOGIN_URL, { waitUntil: 'networkidle2' });

      const USERNAME_SELECTOR = '#UserName'; 
      const PASSWORD_SELECTOR = '#AuthKey';
      const CAPTCHA_INPUT_SELECTOR = '#ccode';
      const LOGIN_BUTTON_SELECTOR = 'button[type="submit"]';

      console.error("Auto-filling credentials...");
      await page.type(USERNAME_SELECTOR, ERP_USERNAME);
      await page.type(PASSWORD_SELECTOR, ERP_PASSWORD);
      
      console.error("Locating Captcha Image...");
      const captchaElement = await page.$('img[src="/srmapstudentcorner/captchas"]');
      if (captchaElement) {
        console.error("Taking screenshot of Captcha for OCR processing...");
        const captchaBuffer = await captchaElement.screenshot();
        
        console.error("Running AI OCR (Tesseract) on Captcha...");
        const imageBuffer = Buffer.from(captchaBuffer);
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
        
        const cleanCaptcha = text.trim().replace(/[^A-Za-z0-9]/g, '');
        console.error(`OCR recognized Captcha as: '${cleanCaptcha}'`);
        
        await page.type(CAPTCHA_INPUT_SELECTOR, cleanCaptcha);
      } else {
        console.error("Warning: Captcha image not found, proceeding anyway.");
      }

      console.error("Clicking Login button...");
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => console.error("Navigation timeout, but might have succeeded.")),
        page.click(LOGIN_BUTTON_SELECTOR)
      ]);

      console.error("Logged in! Clicking 'Academic' dropdown...");
      await page.waitForSelector('::-p-text(Academic)', { timeout: 10000 }).catch(() => {});
      await page.click('::-p-text(Academic)');

      console.error("Waiting 2 seconds for dropdown animation...");
      await new Promise(r => setTimeout(r, 2000));

      console.error("Clicking 'Attendance Details' in dropdown...");
      try {
        await page.click('::-p-text(Attendance Details)');
      } catch (e) {
        try {
           await page.click('::-p-text(Attendance)');
        } catch (err) {}
      }

      console.error("Waiting for 'ATTENDANCE DETAILS' to appear on the dashboard...");
      
      // Wait for the attendance table to render
      await page.waitForFunction(() => {
        return document.body.innerText.includes('ATTENDANCE DETAILS');
      }, { timeout: 30000 }); 

      console.error("Attendance page detected! Scraping data...");
      
      const attendanceData = await page.evaluate(() => {
        const records: AttendanceRecord[] = [];
        
        const rows = document.querySelectorAll('table tbody tr, table tr');
        rows.forEach(row => {
          const cols = row.querySelectorAll('td');
          if (cols.length >= 8) {
            const courseCode = cols[0].innerText.trim();
            if (/^[A-Z]+\s*\d+/.test(courseCode)) {
              records.push({
                courseCode: courseCode,
                courseTitle: cols[1].innerText.trim(),
                totalConducted: parseInt(cols[2].innerText.trim(), 10) || 0,
                attended: parseInt(cols[3].innerText.trim(), 10) || 0,
                minPercentageRequired: 75
              });
            }
          }
        });
        return records;
      });

      console.error("Successfully scraped attendance data from ERP.");
      return attendanceData;

    } catch (error) {
      console.error("Failed to scrape ERP. Taking debug screenshot...");
      if (page) await page.screenshot({ path: 'debug_error.png' });
      throw error;
    } finally {
      await browser.close();
    }
  }
}
