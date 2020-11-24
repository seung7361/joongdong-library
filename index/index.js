document.getElementById('opbutton').addEventListener('click', function() {
    // document.getElementById('mainwebpage').style.transform = "translateY(-100vh)";
    document.getElementById('mainsecondpage').style.transform = "translateY(0)";
});

document.getElementById('backbutton').addEventListener('click', function() {
    // document.getElementById('mainwebpage').style.transform = "translateY(0)";
    document.getElementById('mainsecondpage').style.transform = "translateY(100vh)";
});