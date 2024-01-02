import puppeteer from "puppeteer";
import {writeFile} from 'fs';

const searchTermCli = process.argv.length >= 3 ? process.argv[2] : 'Mountains';


(async () => {

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1600, height: 1000 }
    });
    const page = await browser.newPage();

    page.on('response', async (resp) => {
        const headers = resp.headers()
        const url = new URL(resp.url());

        if (headers['content-type']?.includes('image/avif') && 
        url.href.startsWith('https://images.unsplash.com/photo-') &&
        headers['content-length'] > 30000) {
            console.log(url.pathname);
            await resp.buffer().then(async(buffer)=>{
                await writeFile(`./images/${url.pathname}.avif`, buffer, (err)=>{
                    if (err) throw err;
                })
            })
        }
    })

    await page.goto('https://unsplash.com/');
    await page.screenshot({ path: './screens/unsplash-home.jpg' })

    const btn = await page.waitForSelector('.r7Rbd.jpBZ0');
    await page.waitForSelector('.ctM_F.gdt34');
    await page.type('.ctM_F.gdt34', searchTermCli, { delay: 100 })

    await Promise.all([page.waitForNavigation(), btn.click()]);
    await page.waitForNetworkIdle();
    await page.screenshot({ path: './screens/unsplash-search.jpg', fullPage: true });

    await browser.close();

})();