import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });

    const page = await browser.newPage();


    // await page.setViewport({
    //     width: 1500,
    //     height: 1000,
    //     isMobile: false,
    //     isLandscape: true,
    //     hasTouch: false,
    //     deviceScaleFactor: 1,
    // })

    await page.goto("https://chapters.indigo.ca");

    const url = await page.url();
    console.log(url)

    const content = await page.content();
    console.log(content);

    await page.screenshot({ path: "./screens/sampleChapters1.jpg", fullPage: true });
    await page.screenshot({ path: "./screens/sampleChapters2.jpg", clip: { x: 200, y: 200, width: 500, height: 500 }, encoding: "binary", type: 'jpeg' });

    await browser.close();
})();




