const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const port = 3000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const NAVER_CLIENT_ID = 'GnALdwQGZFFFLjnmkuwl';
const NAVER_CLIENT_SECRET = '5Hm7SyebKq';

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

app.get('/booksearch', function(req, res) {
    let query = req.query.query;

    request.get({
        url: 'https://openapi.naver.com/v1/search/book.json',
        encoding: 'utf-8',
        qs: {
            query: query,
            start: 1,
            display: 1
        },
        headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
        }
    }, function(err, result, body) {
        let json = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(JSON.stringify(json));
    });
})

app.get('/search', async function(req, res) {
    res.sendFile(path.join(__dirname, './search/search.html'));
});

io.on('connection', function(socket) {

    socket.on('gimmelist', async function(query) {

        connection.query(`select * from \`book\`.\`booklist\` where (\`Name\` like '%${query}%')
        or (\`SubSignature\` like '%${query}%')
        or (\`Signature\` like '%${query}%')
        or (\`Author\` like '%${query}%')
        or (\`Publisher\` like '%${query}%')
        or (\`Subject\` like '%${query}%')
        or (\`OriginalName\` like '%${query}%')
        or (\`OriginalAuthor\` like '%${query}%')`, async function(err, results) {
            if (err) throw err;

            results = results.reverse();
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

    socket.on('gimmebookinfo', function(query) {
        if (Number.isInteger(query) == false) {
            socket.emit('bookinforesult', 'wrong');
        }

        connection.query(`select * from \`book\`.\`booklist\` where No='${query}'`, function(err, results) {
            if (err) throw err;

            // socket.emit('bookinforesult', JSON.stringify(results));

            result = results[0];
            let naverquery = `${result["Name"].split(';')[0].split(':')[0].trim()} ${result["Author"].split('지음')[0].split('저')[0].split(';')[0].split('편')[0].trim()}`;
            console.log(naverquery);
            request.get({
                url: 'https://openapi.naver.com/v1/search/book.json',
                encoding: 'utf-8',
                qs: {
                    query: naverquery,
                    start: 1,
                    display: 1
                },
                headers: {
                    'X-Naver-Client-Id': NAVER_CLIENT_ID,
                    'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
                }
            }, function(err, result, body) {
                let json = JSON.parse(body);

                if (json["total"] == "0") {
                    socket.emit('bookinforesult', JSON.stringify(results), null, null);
                } else {
                    socket.emit('bookinforesult', JSON.stringify(results), json["items"][0]["image"].replace('type=m1&', ''), json["items"][0]["link"]);
                }
            });
        });
    });

    socket.on('fetchrecommendedlist', function() {

        connection.query(`select * from \`book\`.\`booklist\` where \`recommended\` = 1`, async function(err, result) {
            if (err) throw err;

            let booksinfo = new Array();
            for (let i = 0; i < result.length; i++) {
                request.get({
                    url: 'https://openapi.naver.com/v1/search/book.json',
                    encoding: 'utf-8',
                    qs: {
                        query: result[i]["Name"].split(';')[0].split(':')[0].trim(),
                        start: 1,
                        display: 1
                    },
                    headers: {
                        'X-Naver-Client-Id': NAVER_CLIENT_ID,
                        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
                    }
                }, function(err, response, body) {
                    if (err) throw err;

                    let json = JSON.parse(body);

                    if (json["total"] == 0) {
                        booksinfo[i] = null;
                    } else {
                        booksinfo[i] = json["items"][0]["image"].replace('type=m1&', '');
                    }
                });
            }

            setTimeout(function() {
                socket.emit('resrecommendedlist', result, booksinfo);
            }, 500);
        });

    });

    socket.on('disconnect', function() {
        // 
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
app.use(express.static('bookinfo'));