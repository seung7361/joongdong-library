document.getElementById('opbutton').addEventListener('click', function() {
    document.getElementById('mainwebpage').style.transform = "translateY(-100vh)";
    document.getElementById('mainsecondpage').style.transform = "translateY(0)";
});

document.getElementById('backbutton').addEventListener('click', function() {
    document.getElementById('mainwebpage').style.transform = "translateY(0)";
    document.getElementById('mainsecondpage').style.transform = "translateY(100vh)";
});

document.getElementById('input').addEventListener('keypress', function(event) {
    if (event.key == 'Enter') {
        event.preventDefault();
    }
});

document.getElementById('button-addon2').addEventListener('click', function() {
    if (document.getElementById('input').value.trim() == "") {
        return 0;
    }
});