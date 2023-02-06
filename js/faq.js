classes('c-faq').forEach(element => {
    element.addEventListener('click', () => {
        classes('c-faq').forEach(faq => faq.classList.remove('c-faq--active'));
        element.classList.add('c-faq--active');
    });
});

