const puppeteer = require('puppeteer');

const withBrowser = async (fn) => {
    const browser = await puppeteer.launch({
        userDataDir: '/tmp/session-123',
        headless: true,
        args: [
            "--disable-gpu",
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"
        ]
    });
    try {
        return await fn(browser);
    } finally {
        await browser.close();
    }
}

const withPage = (browser) => async (fn) => {
    const page = await browser.newPage();
    try {
        return await fn(page);
    } finally {
        await page.close();
    }
}

module.exports.withBrowser = withBrowser;
module.exports.withPage = withPage; 