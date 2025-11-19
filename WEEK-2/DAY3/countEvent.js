let count = 0;
const countShow = document.getElementById("count");
const increaseBtn = document.getElementById("increase");
const decreaseBtn = document.getElementById("decrease");
const resetBtn = document.getElementById("reset");

increaseBtn.addEventListener("click", () => {
    count++;
    countShow.textContent = count;
});

decreaseBtn.addEventListener("click", () => {
    if(count > 0){
        count--;
        countShow.textContent = count;
    }
});

resetBtn.addEventListener("click", () => {
    count = 0;
    countShow.textContent = count;
})

window.addEventListener("keydown", (event) =>{
    if(event.key === "ArrowUp"){
        count++;
        countShow.textContent = count;
    }else if(event.key === "ArrowDown"){
    if(count > 0){
        count--;
        countShow.textContent = count;
    }
    }else if(event.key === "r" || event.key === "R"){
        count=0
        countShow.textContent = count;
    }
});