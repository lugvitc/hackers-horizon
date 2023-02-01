window.onscroll = function () {
    scrollRotate();
};

function scrollRotate() {
    let image = document.getElementById("back-logo");
    image.style.transform = "rotate(" + window.pageYOffset/7 + "deg)";
}
