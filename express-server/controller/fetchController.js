const puppeteer = require('puppeteer');
const KnownDevices = puppeteer.KnownDevices;

async function fetchJavaScriptContent(req, res) {
  const { url, options, device } = req.query;
  let isStagingUrl = url.includes("staging");
  const browser = await puppeteer.launch({
    headless: 'true',
    // executablePath: 'google-chrome-stable',
    executablePath: '/opt/render/project/src/express-server/.cache/puppeteer/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    ignoreHTTPSErrors: true, dumpio: false, waitUntil: 'networkidle0'
  });
  const page = await browser.newPage();
  if (isStagingUrl) {
    await page.authenticate({ 'username': 'webmd', 'password': 'staging' });
  }
  if (device == 'mobile') {
    const iphone = KnownDevices['iPhone 6'];
    await page.emulate(iphone);
  }
  try {
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);
    let divContent = null;
    if (options) {
      switch (options) {
        case "conspon":
          divContent = await page.evaluate(() => document.querySelector('div.conspon').outerHTML);
          break;
        case "scripts":
          divContent = await page.evaluate(() => {
            let div = [];
            document.querySelectorAll('script[type="text/javascript"]').forEach((script, index) => {
              div[index] = script.outerHTML ? script.outerHTML : "Not a Script";
            })
            return div;
          })
          break;
        default:
          divContent = await page.evaluate(() => document.documentElement.outerHTML);
      }
    } else
      divContent = await page.evaluate(() => document.documentElement.outerHTML);

    await browser.close();
    res.send(divContent);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  } finally {
    await browser.close();
  }
}

module.exports = {
  fetchJavaScriptContent
}