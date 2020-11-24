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

socket.emit('gimmelist', searchquery);

socket.on('result', function(list) {
    console.log(`results received.`);

    list = JSON.parse(list);
    let result = "";
    for (let i = 0; i < list.length; i++) {
        result += `<tr>`;

        result += `<td>${nulldetection(list[i]["No"])}</td>`;
        result += `<td>${nulldetection(list[i]["Name"])}</td>`;
        result += `<td>${nulldetection(list[i]["Author"])}</td>`;
        result += `<td>${nulldetection(list[i]["Publisher"])}</td>`;
        result += `<td>${nulldetection(list[i]["PublicationYear"])}</td>`;
        result += `<td>N/A</td>`;
        result += `<td>N/A</td>`;

        result += `<tr>`;
    }
    document.getElementById('table').innerHTML = result;
    document.getElementById('loading').style.opacity = 0;
});

function nulldetection(object) {
    if (object == null) {
        return 'N/A';
    } else {
        return object;
    }
}