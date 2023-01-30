const navbar = id('navbar');
const header = id('header');

const navbarHeight = navbar.offsetHeight;
console.log({navbarHeight, navbar, header})
header.style.marginTop = `${navbarHeight}px`;