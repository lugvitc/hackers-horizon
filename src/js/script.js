console.log("hacker's horizon");

const id = id => document.getElementById(id);
// Adding a time delay after clicking the register now button
document
    .getElementById('register-button')
    .addEventListener('click', function () {
        setTimeout(function () {
            window.open(
                'https://www.vitchennaievents.com/conf1/index.php?eventid=1217',
                '_blank'
            );
        }, 100);
        // 0100 milliseconds = 0.1 seconds
    });

const tags = tag => {
    let elements = [];
    for (let element of document.getElementsByTagName(className)) {
        elements.push(element);
    }
    return elements;
};

const classes = className => {
    let elements = [];
    for (let element of document.getElementsByClassName(className)) {
        elements.push(element);
    }
    return elements;
};

