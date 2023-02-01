const id = id => document.getElementById(id);
// Adding a time delay after clicking the register now button
document.getElementById("register-button").addEventListener("click", function(){
    setTimeout(function(){
        window.open("https://www.vitchennaievents.com/conf1/index.php?eventid=1217", "_blank");
    }, 0100);
    // 0100 milliseconds = 0.1 seconds
});

document.getElementById("button-register").addEventListener("click", function(){
    setTimeout(function(){
        window.open("https://www.vitchennaievents.com/conf1/index.php?eventid=1217", "_blank");
    }, 0100);
    // 0100 milliseconds = 0.1 seconds
});

window.onscroll = function() {
    if (document.body.scrollTop > 430 || document.documentElement.scrollTop > 430) {
        document.getElementById("register-button").style.display = "block";
      document.getElementById("button-register").style.display = "none";
    } else {
        document.getElementById("register-button").style.display = "none";
        document.getElementById("button-register").style.display = "block";
    }
  };