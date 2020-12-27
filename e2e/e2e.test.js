/*  eslint max-len: ["error", { "ignoreComments": true }] */
import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('Popover homework e2e tests', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', () => {
        reject();
      });
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({ // опции нужно закомментить перед пушем (для CI) или раскомментить для просмотра теста
      // headless: false, // show gui
      // slowMo: 500,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('should toggle "active" and "hidden" class', async () => {
    await page.goto(baseUrl);

    // await page.waitForSelector('[data-widget="popover-top"]', { visible: false, hidden: true });
    // await page.waitForSelector('[data-widget="popover-top"].active', { visible: false, hidden: true });
    await page.waitForSelector('[data-widget="popover-top"].hidden');
    // await page.waitForSelector('[data-widget="popover-top"].hidden', { visible: true, hidden: false });

    const button = await page.$('.btn');
    button.click();

    await page.waitForSelector('[data-widget="popover-top"].active');
    await page.waitForSelector('[data-widget="popover-top"]');
    // await page.waitForSelector('[data-widget="popover-top"]', { visible: true, hidden: false });
    // await page.waitForSelector('[data-widget="popover-top"].hidden', { visible: false, hidden: true });

    button.click();

    // await page.waitForSelector('[data-widget="popover-top"].active', { visible: false, hidden: true });
    await page.waitForSelector('[data-widget="popover-top"].hidden');
    // await page.waitForSelector('[data-widget="popover-top"].hidden', { visible: true, hidden: false });
    // await page.waitForSelector('[data-widget="popover-top"]', { visible: false, hidden: true });
  });
});
