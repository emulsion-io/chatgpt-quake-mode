/**
 * 
 * 
 * 
 * 
 * 
 */

/*const minimizeBtn = document.getElementById("btn-minimize");
minimizeBtn.addEventListener("click", () => {
    app.minimizeApp();
});*/

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
