import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import { writeFile } from 'fs';
import { Parser } from "json2csv";

const keyWord = "Mobile";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });
    const page = await browser.newPage();

    await page.goto('https://www.algonquincollege.com/', { waitUntil: "load" });
    await page.screenshot({ path: './screens/AlgonQuin-Home.jpg' });

    const btn = await page.waitForSelector('button.programSearchButton');
    await page.type('input#programSearch', keyWord, { delay: 100 })
    await btn.click();
    await page.waitForNavigation({ waitUntil: "load" });
    await page.waitForSelector('table.programFilterList');
    await page.screenshot({ path: './screens/programm-lsit.jpg', fullPage: true })

    const data = await page.$$eval('table.programFilterList tbody tr', (rows) => {
        return rows.map(row => {
            if (row.classList.contains('odd') || row.classList.contains('even')) {
                const tds = row.querySelectorAll("td")
                return {
                    Name: tds[1].innerText,
                    Area: tds[2].innerText,
                    Campus: tds[3].innerText,
                    Credential: tds[4].innerText,
                    Length: tds[5].innerText,
                }
            } else { return null }

        }).filter(row => row)
    });
    console.log([data])

    await writeFile('./data/courseDetails.json', JSON.stringify(data), 'utf-8', (err) => {
        if (err) throw err;
        console.log('Saved The File')
    })

    const parser = await new Parser;
    const csv = await parser.parse(data)
    await writeFile('./data/Data.csv', csv, 'utf-8', (err)=>{
        if(err) throw err;
        console.log('Saved The File in Csv')
    })

    await browser.close()
})();
