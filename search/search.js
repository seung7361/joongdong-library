const socket = io.connect(`${window.location.origin}`);
const searchquery = (new URL(window.location.href)).searchParams.get('v');

// let booklist = new Array();
// let temp = new Array();

// socket.emit('gimmelist', searchquery);
// socket.on('result', function(list, page) {
//     console.log('result received');
//     console.log(list, page);

//     temp[page - 1] = list;
// });

// let scroll = $(window).scrollTop() + $(window).height();
// $(window).scroll(function() {
//     scroll = $(window).scrollTop() + $(window).height();

//     if (scroll - 200 > $(table).height()) {
//         sendquery(temp.length + 1);
//     }
// });

// setInterval(function() {
//     scroll = $(window).scrollTop() + $(window).height();

//     if (scroll - 200 > $(table).height()) {
//         sendquery(temp.length + 1);
//     }
// }, 1000);

// let current = false;

// function sendquery(page) {
//     if (current) return 0;

//     socket.emit('gimmelist', searchquery);
//     // current = true;
//     socket.on('result', function(list, page) {
//         console.log('result received');

//         // if (list == "EOS") {
//         //     console.log("EOS");
//         //     current = true;
//         //     $(".loader").removeClass('loader');
//         //     return 0;
//         // } else {
//         //     console.log(list, page);
//         // }

//         temp[page - 1] = list;
//         update();
//         current = false;
//     });
// }

// function update() {
// let result = `
// <tr align="center" id="title">
//     <td>번호</td>
//     <td width="40%">도서명</td>
//     <td width="15%">저자</td>
//     <td width="15%">출판사</td>
//     <td>년도</td>
//     <td>대출</td>
//     <td>예약</td>
// </tr>`;

//     for (let i = 0; i < temp.length; i++) {
//         for (let j = 1; j < temp[i].length; j++) {
//             result += `<tr>`;

//             result += `<td>${temp[i][j]["No"]}</td>`;
//             result += `<td>${temp[i][j]["Name"]}</td>`;
//             result += `<td>${temp[i][j]["Writer"]}</td>`;
//             result += `<td>${temp[i][j]["Publisher"]}</td>`;
//             result += `<td>${temp[i][j]["PublicationYear"]}</td>`;
//             result += `<td>${temp[i][j]["Lend"]}</td>`;
//             result += `<td>${temp[i][j]["Reserve"]}</td>`;

//             result += `</tr>`;
//         }
//     }

//     document.getElementById('table').innerHTML = result;
// }

//

// for (let i = 0; i < list.length; i++) {
//     result += `<tr>`;

//     result += `<td>${tailor(list[i]["No"])}</td>`;
//     result += `<td>${tailor(list[i]["Name"])}</td>`;
//     result += `<td>${tailor(list[i]["Author"])}</td>`;
//     result += `<td>${tailor(list[i]["Publisher"])}</td>`;
//     result += `<td>${tailor(list[i]["PublicationYear"])}</td>`;
//     result += `<td>N/A</td>`;
//     result += `<td>N/A</td>`;

//     result += `<tr>`;
// }

const tableinit = `
    <tr align="center" class="title" id="title">
        <td>번호</td>
        <td width="40%">도서명</td>
        <td width="15%">저자</td>
        <td width="15%">출판사</td>
        <td>년도</td>
    </tr>`;

let booklist = [];
let pages;
let booksperpage = 7;
let currentPage = 1;
socket.emit('gimmelist', searchquery);

socket.on('result', function(list) {
    console.log(`results received.`);

    if (JSON.parse(list).length == 0) {
        document.getElementById('loading').style.opacity = `1`;

        document.getElementsByClassName('loader')[0].style.opacity = `0`;
        document.getElementById('loading').getElementsByTagName('p')[0].innerHTML = `검색 결과가 없습니다. (no results were found)`;
        return 0;
    }

    booklist = JSON.parse(list);
    pages = Math.floor((booklist.length / booksperpage) + 1);
    if (booklist.length % booksperpage == 0) pages--;

    document.getElementById('loading').style.opacity = `0`;
    bottomNavUpdate();
    tableUpdate();
    updatePage(1);
});

const firstpage = `<span id="firstpage">
<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-in-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0v-2z"/>
    <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
</svg>
</span>`;

const back = `<span id="back">
<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-left-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
</svg>
</span>`;

const front = `<span id="front">
<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-right-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path fill-rule="evenodd" d="M4 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5A.5.5 0 0 0 4 8z"/>
</svg>
</span>`;

const lastpage = `<span id="lastpage">
<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box-arrow-in-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
    <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
</svg>
</span>`;

function bottomNavUpdate(num) {
    let result = '';

    if (currentPage != 1) {
        result += firstpage;

    }

    if (currentPage != 1) {
        result += back;
    }


    for (let i = ((10 * Math.floor((currentPage - 1) / 10)) + 1); i < ((10 * Math.floor((currentPage - 1) / 10)) + 11); i++) {
        result += `<span id="page${i}">${i}</span>`;
        if (pages == i) {
            break;
        }
    }


    if (currentPage != pages) {
        result += front;

    }

    if (currentPage != pages) {
        result += lastpage;
    }

    document.getElementById('bottomnav').innerHTML = result;

    for (let i = ((10 * Math.floor((currentPage - 1) / 10)) + 1); i < ((10 * Math.floor((currentPage - 1) / 10)) + 11); i++) {

        document.getElementById(`page${i}`).onclick = function(event) {
            updatePage(`${i}`);
            event.preventDefault();
        };

        if (pages == i) {
            break;
        }
    }

    try {
        document.getElementById('firstpage').onclick = function(event) {
            updatePage(1);
            event.preventDefault();
        };
    } catch {}

    try {
        document.getElementById('back').onclick = function(event) {
            updatePage(currentPage - 1);
            event.preventDefault();
        };
    } catch {}

    try {
        document.getElementById('front').onclick = function(event) {
            updatePage(parseInt(currentPage) + 1);
            event.preventDefault();
        };
    } catch {}

    try {
        document.getElementById(`lastpage`).onclick = function(event) {
            updatePage(pages);
            event.preventDefault();
        };
    } catch {}
}

function updatePage(newpagenum) {
    $(`#page${currentPage}`).css('text-decoration', 'none');
    $(`#page${currentPage}`).css('font-weight', '100');
    $(`#page${currentPage}`).css('color', 'black');
    currentPage = newpagenum;

    bottomNavUpdate();
    tableUpdate();
    $(`#page${currentPage}`).css('text-decoration', 'underline');
    $(`#page${currentPage}`).css('font-weight', '900');
    $(`#page${currentPage}`).css('color', 'blue');
}

function tailor(object) {

}

function tailorAuthor(param) {
    if (param.trim() == "") {
        return "N/A";
    }

    if (param.includes('[지음]')) {
        param = param.replace('[지음]', '지음');
    }

    return param.split('지음')[0].trim();
}

function tableUpdate() {
    let result = tableinit;

    for (let i = booksperpage * (currentPage - 1); i < booksperpage * currentPage; i++) {
        try {
            result += `<tr>`;

            tailor(booklist[i]);
            result += `<td>${booklist[i]["No"]}</td>`;
            result += `<td>${booklist[i]["Name"]}</td>`;
            result += `<td>${tailorAuthor(booklist[i]["Author"])}</td>`;
            result += `<td>${booklist[i]["Publisher"]}</td>`;
            result += `<td>${booklist[i]["PublicationYear"]}</td>`;

            result += `</tr>`;
        } catch {}
    }

    document.getElementById('table').innerHTML = result;

    $('tr').each(function(index, element) {
        if ($(element).hasClass('title')) {
            //
        } else {
            $(element).mouseenter(function() {
                $(this).css('background-color', 'CornflowerBlue');
                $(this).css('cursor', 'pointer');
            }).mouseleave(function() {
                $(this).css('background-color', 'white');
                $(this).css('cursor', 'auto');
            });

            $(element).click(function() {
                socket.emit('gimmebookinfo', parseInt($(this).find('td')[0].textContent));
            });
        }
    });
}

socket.on('bookinforesult', function(result, image, link, isbn) {

    updateBookInfo(JSON.parse(result), image, link, isbn);
    $('#wrapper').css({
        'filter': 'grayscale(100%) blur(10px)',
        '-webkit-filter': 'grayscale(100%) blur(10px)',
        '-moz-filter': 'grayscale(100%) blur(10px)',
        '-o-filter': 'grayscale(100%) blur(10px)',
        '-ms-filter': 'grayscale(100%) blur(10px)'
    });
    $('#infocard').css('transform', 'translate(0)');
});

$('#closetab').click(function() {
    $('#wrapper').css({
        'filter': '',
        '-webkit-filter': '',
        '-moz-filter': '',
        '-o-filter': '',
        '-ms-filter': ''
    });
    $('#infocard').css('transform', 'translate(0, 100%)');
});

const starsvg = `<svg height="10px" style="margin:5px;" viewBox="0 -10 511.98685 511" xmlns="http://www.w3.org/2000/svg"><path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0" fill="#ffc107"/></svg>`;

function updateBookInfo(bookinfo, imageurl, booklink, bookisbn) {
    let result = ``;
    console.log(bookinfo);

    if (bookinfo[0]["recommended"] == 1) {
        result += `<span style="cursor:auto;font-size:10px;">${starsvg}이달의 추천도서</span>`;
    }

    if (imageurl == null) {
        result += `<img src="./src/noimage.png" id="bookimage" alt="bookimage">`;
    } else {
        result += `<img src="${imageurl}" id="bookimage" alt="bookimage">`;
    }

    result += `<h5 id="booktitle">${bookinfo[0]["Name"]}</h5><br><br>`;
    result += `<p style="width:70%;text-align:left;">${bookinfo[0]["Author"]} | ${bookinfo[0]["Publisher"]} | ${bookinfo[0]["PublicationYear"]}</p>`;

    result += `
        <table class="morebookinfo">
            <thead>
            </thead>
            <tbody>
                <tr>
                    <td>페이지 수</td>
                    <td>${(bookinfo[0]["Page"]) ? bookinfo[0]["Page"] : "N/A"}</td>
                </tr>
                <tr>
                    <td>크기</td>
                    <td>${(bookinfo[0]["Size"]) ? bookinfo[0]["Size"] : "N/A"}</td>
                </tr>
                <tr>
                    <td>ISBN</td>
                    <td>${bookisbn}</td>
                </tr>
            </tbody>
        </table>`;

    document.getElementById('info').innerHTML = result;

    if (booklink !== null) {
        $('#bookimage').click(function() {
            window.open(booklink, '_blank');
        }).css({
            "cursor": "pointer"
        });
    }
}


$('#logo').click(function() {
    window.location.replace('/');
});

$('#card').click(function(event) {
    event.stopPropagation();
})

$('#infocard').click(function() {
    $('#closetab').click();
});