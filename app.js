const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const port = 3000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'book'
});

connection.connect(function(err, connection) {
    if (err) throw err;
})

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const By = require('selenium-webdriver').By;
const KEY = require('selenium-webdriver').Key;
const cheerio = require('cheerio');
const request = require('request');
const { assert } = require('console');
const { elementIsDisabled } = require('selenium-webdriver/lib/until');

const searchpageurl = 'http://book.joongdong.hs.kr/customer/CustomerBookSearch.aspx?lib_code=H1001835&config_seq=8&menu_parentseq=8';

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index/index.html'));
});

app.get('/search', async function(req, res) {
    res.sendFile(path.join(__dirname, './search/search.html'));
});

app.get('/books', function(req, res) {
    let id = req.query.id;

    res.end(id);
});

io.on('connection', function(socket) {
    console.log(`a wild user appeared on the search tab`);


    socket.on('gimmelist', async function(query) {
        console.log(`query : ${query}`);

        await connection.query(`select * from \`book\`.\`booklist\` where (\`Name\` like '%${query}%')
        or (\`SubSignature\` like '%${query}%')
        or (\`Signature\` like '%${query}%')
        or (\`Author\` like '%${query}%')
        or (\`Publisher\` like '%${query}%')
        or (\`Subject\` like '%${query}%')
        or (\`OriginalName\` like '%${query}%')
        or (\`OriginalAuthor\` like '%${query}%')`, async function(err, results) {
            if (err) throw err;

            await socket.emit('result', JSON.stringify(results));
        });

        /* let booklist = await (async function search(word, page) {
            let driver = await new webdriver.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless().windowSize({ width: 640, height: 480 })).build();

            await driver.get(searchpageurl);
            await driver.findElement(By.css('#ctl00_PlaceHolderCustomer_ctl00_txtWord')).sendKeys(word, KEY.RETURN);

            let a = await driver.findElements(By.css('a'));
            for (let i = 40; i < a.length; i++) { // 먼저 한번 체크하고
                if (await a[i].getText() == ` ${page} `) {
                    await a[i].sendKeys(KEY.RETURN);
                    break;
                }
            }

            while (await (driver.findElement(By.css('#ctl00_PlaceHolderCustomer_ctl00_txtPageNo'))).getAttribute('value') != page) { // 이 페이지가 아니면
                console.log(await (await (driver.findElement(By.css('#ctl00_PlaceHolderCustomer_ctl00_txtPageNo')))).getAttribute('value'));
                try {
                    await (driver.findElement(By.xpath("//a[@title='다음']"))).sendKeys(KEY.RETURN); // 다음 클릭
                } catch {

                }

                a = await driver.findElements(By.css('a'));
                for (let i = 40; i < a.length; i++) {
                    if (await a[i].getText() == ` ${page} `) {
                        await a[i].sendKeys(KEY.RETURN);
                        break;
                    }
                }
                return "EOS";
            }

            let booklist = new Array();
            for (let j = 0; j < 10; j++) {

                try {
                    await driver.findElement(By.css(`#ctl00_PlaceHolderCustomer_ctl00_rptSearchList_ctl${numgen(j+1)}_tdNo`));
                } catch {
                    break;
                }

                booklist[j + 1] = {
                    "No": await driver.findElement(By.css(`#ctl00_PlaceHolderCustomer_ctl00_rptSearchList_ctl${numgen(j+1)}_tdNo`)).getText(),
                    "Name": await driver.findElement(By.css(`#ctl00_PlaceHolderCustomer_ctl00_rptSearchList_ctl${numgen(j+1)}_tdTitle`)).getText(),
                    "Writer": await driver.findElement(By.css(`#ctl00_PlaceHolderCustomer_ctl00_rptSearchList_ctl${numgen(j+1)}_tdWriter`)).getText(),
                    "Publisher": await driver.findElement(By.css(`#ctl00_PlaceHolderCustomer_ctl00_rptSearchList_ctl${numgen(j+1)}_tdPublisher`)).getText(),
                    "PubYear": await driver.findElement(By.css(`#ctl00_PlaceHolderCustomer_ctl00_rptSearchList_ctl${numgen(j+1)}_tdPubYear`)).getText(),
                    "Writer": await driver.findElement(By.css(`#ctl00_PlaceHolderCustomer_ctl00_rptSearchList_ctl${numgen(j+1)}_tdWriter`)).getText(),
                    "Lend": "N/A yet",
                    "Reserve": "N/A yet"
                };
            }

            driver.close();
            return booklist;
        })(query, page); */
    });

    socket.on('disconnect', function() {
        console.log(`someone disappeared from the search tab.`);
    });
});

// function numgen(num) {
//     if (num == 10) {
//         return '10';
//     } else {
//         return '0' + num.toString();
//     }
// }

http.listen(port, function() {
    console.log(`Server listening on *:${port}`);
});

app.use(express.static('index'));
app.use(express.static('search'));