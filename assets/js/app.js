/**
 * 
 * 
 * 
 * 
 * 
 */

const hideBtn = document.getElementById("btn-hide");
hideBtn.addEventListener("click", () => {
    app.hideApp();
});

const closeBtn = document.getElementById("btn-close");
closeBtn.addEventListener("click", () => {
    app.closeApp();
});

const reloadBtn = document.getElementById("btn-reload");
reloadBtn.addEventListener("click", () => {
    app.reloadApp();
});

const onTopBtn = document.getElementById("btn-on-top");
onTopBtn.addEventListener("click", () => {
    app.onTop();
});
