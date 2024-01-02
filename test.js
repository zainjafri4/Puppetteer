import puppeteer from "puppeteer";
const log = console.log;

const searchTermCLI = process.argv.length >= 3 ? process.argv[2] : 'Volbeat';
const searchTermENV = process.env.searchTxt ?? 'Volbeat';



(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });
    const page = await browser.newPage();

    // await page.setViewport({
    //         width: 1600,
    //         height: 1000,
    // })
    

    await page.goto("https://www.youtube.com")

    await page.waitForSelector('#search-input #search')
    await page.type('#search-input #search', searchTermCLI, { delay: 100 });
    console.log(searchTermCLI)
    console.log(searchTermENV)

    await page.emulateVisionDeficiency('blurredVision', { visible: true, timeout: 3000 });
    await page.screenshot({ path: './screens/ytHomeBlurred.jpg' })
    await page.emulateVisionDeficiency('none');

    await page.screenshot({ path: './screens/ytHome1.jpg' })

    await Promise.all([
        page.waitForNavigation(),
        page.click('#search-icon-legacy')
    ]);

    await page.waitForSelector("#video-title > yt-formatted-string");
    await new Promise(resolve => setTimeout(resolve, 5000))
    await page.screenshot({ path: './screens/ytSearch1.jpg' });

    const firstMatch = await page.$eval('#video-title > yt-formatted-string', (elem) => {
        return elem.innerText;
    })

    console.log({firstMatch});

    await Promise.all([
        page.waitForNavigation(),
        page.click('#video-title > yt-formatted-string'),
        new Promise(resolve => setTimeout(resolve, 15000))
    ])

    await page.screenshot({ path: './screens/videoSs1.jpg' })

    await page.waitForSelector("#count > yt-formatted-string > span", {visible: true})
    const comments = await page.$eval('#count > yt-formatted-string > span', (elem)=>{
        return elem.innerText;
    })
    console.log("Total Comments:", comments) 
    
    await page.waitForSelector(' a > h3')
    const suggestedFirst = await page.$eval(' a > h3', (elem)=>{
        return elem.innerText;
    })

    console.log("Next Suggested Video:", suggestedFirst)

    await browser.close()
})();

// #dismiss-button > yt-button-shape > button > yt-touch-feedback-shape > div > div.yt-spec-touch-feedback-shape__fill