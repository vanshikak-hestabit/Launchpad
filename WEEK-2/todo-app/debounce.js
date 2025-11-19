function debounce(fn, delay){
    let timerId;

    return function(...args){
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}
const search = (query) => {
    console.log(`Searching for`, query);
}

const searchWithDebounce = debounce(search, 1000);

setTimeout(() => searchWithDebounce("S"), 0);
setTimeout(() => searchWithDebounce("Sh"), 1300);
setTimeout(() => searchWithDebounce("Sho"), 1600);
setTimeout(() => searchWithDebounce("Shoe"), 1900);
setTimeout(() => searchWithDebounce("Shoes"), 4500);
