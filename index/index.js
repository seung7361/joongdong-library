const socket = io.connect(`${window.location.origin}`);

document.getElementById('opbutton').addEventListener('click', function() {
    // document.getElementById('mainwebpage').style.transform = "translateY(-100vh)";
    document.getElementById('mainsecondpage').style.transform = "translateY(0)";

    socket.emit('fetchrecommendedlist');
});

document.getElementById('backbutton').addEventListener('click', function() {
    // document.getElementById('mainwebpage').style.transform = "translateY(0)";
    document.getElementById('mainsecondpage').style.transform = "translateY(100vh)";
});

let book = new Array();
let totalpage;
socket.on('resrecommendedlist', async function(data, booksinfo) {
    book = data;
    totalpage = (book.length + 1);

    if (totalpage == 1) {
        document.getElementById('loading').getElementsByTagName('p')[0].innerHTML = `검색 결과가 없습니다. (No results were found.)`;
        document.getElementsByClassName('loader')[0].style.opacity = `0`;
        return 0;
    }

    let innerhtml = ``;
    let index = 1;
    for (let i = 0; i < totalpage / 3; i++) {
        innerhtml += `<div class="swiper-slide">`;

        for (let j = 0; j < 3; j++) {
            innerhtml += `<div class="book" id="book${index}">`

            innerhtml += `<img src="${booksinfo[index - 1]})">`;
            innerhtml += `<p>${data[index - 1]["Name"]}</p>`

            innerhtml += `</div>`;
            index++;

            if (index == totalpage) break;
        }

        innerhtml += `</div>`;
    }

    document.getElementById('swiper-wrapper').innerHTML = innerhtml;

    mySwiper = new Swiper('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        loop: false,
        speed: 1200,

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
});