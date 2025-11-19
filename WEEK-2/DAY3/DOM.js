//NAVBAR TOGGLE
const btn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

btn.addEventListener("click", () => {
    menu.classList.toggle("active");
});

//DROPDOWN
const dropbtn = document.getElementById("drop-btn");
const dropContent = document.querySelector(".dropdown-content");
dropbtn.addEventListener("click", () =>{
    dropContent.classList.toggle("show");
});

//MODAL
const openModal = document.getElementById("open-modal");
const closeModal = document.getElementById("close-modal");
const modal = document.getElementById("modal");

openModal.addEventListener("click", () =>{
    modal.classList.add("show");
    openModal.style.display = "none";
});

closeModal.addEventListener("click", () =>{
    modal.classList.remove("show");
    openModal.style.display = "block";
});

window.addEventListener("click", (e) => {
    if(e.target === modal){
        modal.classList.remove("show");
        openModal.style.display = "block";
    }
});