export function qs(selector, parent = document) {
    return parent.querySelector(selector);
}

export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export async function loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
}

export async function loadHeaderFooter() {
    const headerTemplate = await loadTemplate('/src/partials/header.html');
    const footerTemplate = await loadTemplate('/src/partials/footer.html');
    const headerElement = document.querySelector('#main-header');
    const footerElement = document.querySelector('#main-footer');
    if (headerElement) headerElement.innerHTML = headerTemplate;
    if (footerElement) footerElement.innerHTML = footerTemplate;
}

export function alertMessage(message, scroll = true) {
    const existing = document.querySelector('.alert');
    if (existing) existing.remove();
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.innerHTML = `<p>${message}</p><span>X</span>`;
    alert.addEventListener('click', function (e) {
        if (e.target.tagName === 'SPAN') {
            alert.remove();
        }
    });
    const main = document.querySelector('main');
    main.prepend(alert);
    if (scroll) window.scrollTo(0, 0);
}

export function showLoading(parentElement) {
    parentElement.innerHTML = '<div class="loading">Loading...</div>';
}

export function clearElement(element) {
    element.innerHTML = '';
}