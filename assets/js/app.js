/**
 * 
 * 
 * 
 * 
 * 
 */

const hideBtn = document.getElementById("btn-hide");
hideBtn.addEventListener("click", () => {
    window.app.hideApp();
});

const closeBtn = document.getElementById("btn-close");
closeBtn.addEventListener("click", () => {
    window.app.closeApp();
});

const reloadBtn = document.getElementById("btn-reload");
reloadBtn.addEventListener("click", () => {
    window.app.reloadApp();
});

const onTopBtn = document.getElementById("btn-on-top");
onTopBtn.addEventListener("click", () => {
    window.app.onTop();
});


// Select tab-group
const tabGroup = document.querySelector("tab-group");

// Setup the default tab which is created when the "New Tab" button is clicked
tabGroup.setDefaultTab({
    title: "GPT",
    src: "https://chat.openai.com",
    active: true
});

// Do stuff
const tab = tabGroup.addTab({
    title: "GPT",
    src: "https://chat.openai.com",
    active: true
});

window.app.handleOnglet((event, id) => {
    editOnglet()
})

tabGroup.on("tab-active", (tab, tabGroup) => {
    ongletClick(tab);
});

let lastClickedTab = null;
let clickCount = 0;
let clickTimeout;
const doubleClickDelay = 300;

function ongletClick(tab) {
    clickCount++;

    if (clickCount === 1) {
        clickTimeout = setTimeout(() => {
            console.log('Clic simple sur l\'onglet');
            clickCount = 0;
        }, doubleClickDelay);
    } else if (clickCount === 2) {
        if (tab === lastClickedTab) {
            editOnglet();
            clickCount = 0;
        } else {
            clickCount = 1;
        }
    }

    lastClickedTab = tab;
}

function editOnglet() {
    Swal.fire({
        title: 'Change tab name',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Ok',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
            tabGroup.getActiveTab().setTitle(login);
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {

        }
    })
}