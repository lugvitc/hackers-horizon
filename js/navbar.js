const navbar = id('navbar');
const header = id('header');
const sections = tags('section');

const navbarHeight = navbar.offsetHeight;
// console.log({ navbarHeight, navbar, header });
header.style.marginTop = `${navbarHeight}px`;

sections.forEach(sec => {
    sec.style.scrollMarginTop = `${navbar.scrollHeight}px`;
    console.log(sec.style.scrollMarginTop);
});

const rem = Number.parseInt(
    getComputedStyle(document.documentElement).fontSize.replace('px', '')
);

const delta = 0.5 * rem;

// setting the active link whenever the section it links to reaches the top
let prev = null;
const makeActive = sectionId => {
    if (prev) prev.classList.remove('current');
    const link = document.querySelector(`a[href="#${sectionId}"]`);
    link.classList.add('current');
    prev = link;
};

let lastScrollTop = 0;
let hasGoneUp = {};

window.addEventListener('scroll', e => {
    const currentScrollTop = document.documentElement.scrollTop;

    if (currentScrollTop === 0 && prev) prev.classList.remove('current');
    const scrollingDown = currentScrollTop > lastScrollTop;

    for (let section of document.getElementsByTagName('section')) {
        const y = section.getBoundingClientRect().y;
        const id = section.getAttribute('id');
        if (scrollingDown && y <= navbarHeight + delta && !hasGoneUp[id]) {
            hasGoneUp[id] = true;
            makeActive(id);
        } else if (
            !scrollingDown &&
            y >= navbarHeight - delta &&
            hasGoneUp[id]
        ) {
            hasGoneUp[id] = false;
            makeActive(id);
        }
    }

    lastScrollTop = currentScrollTop;
});

window.addEventListener('scroll', () => {
    const y = header.getBoundingClientRect().y;
    console.log(y);
    if (y === navbarHeight) {
        navbar.classList.add('at-the-top');
    } else {
        navbar.classList.remove('at-the-top');
    }
});

