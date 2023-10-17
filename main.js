
const { BrowserWindow, screen, Menu, MenuItem, app, Tray, nativeImage, ipcMain } = require('electron')
if(require('electron-squirrel-startup')) return app.quit()
const path = require('path')
const fs = require('fs');

try {
  require('electron-reloader')(module)
} catch (_) {}


var shortcut = "CommandOrControl+Shift+A"
var mainWindow;
var tray;
var width, height;
var windowWidth;
var windowHeight;

const iconPath = path.join(__dirname, 'icons', 'icon.png')
const icon = nativeImage.createFromPath(iconPath)

function createWindow() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

  const size = screen.getPrimaryDisplay().workAreaSize;
  width = size.width;
  height = size.height;

  // Calculer les dimensions de la fenêtre
  windowWidth = Math.round(width * 0.7)
  windowHeight = Math.round(height / 2)

  // Créer la fenêtre
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: Math.round((width - windowWidth) / 2), // Centrer horizontalement
    y: -windowHeight, // Positionner la fenêtre en haut de l'écran
    frame: false, 
    webPreferences: {
      spellcheck: true,
      nodeIntegration: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.webContents.session.setSpellCheckerLanguages(['en-US', 'fr'])
  const possibleLanguages = mainWindow.webContents.session.availableSpellCheckerLanguages

  //mainWindow.loadURL('https://chat.openai.com')
  mainWindow.loadFile('index.html')

  var splash = new BrowserWindow({
      width: 400, 
      height: 400, 
      transparent: true, 
      frame: false, 
      alwaysOnTop: true 
  });

  splash.loadFile('splash.html');
  splash.center();

  setTimeout(function () {
    mainWindow.show();
  }, 1500);
  setTimeout(function () {
    splash.close();
  }, 2000);

  // Ouvrir les DevTools.
  //mainWindow.webContents.openDevTools()

  // Register a global shortcut to toggle the window visibility
  const { globalShortcut } = require('electron')
  globalShortcut.register(shortcut, () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('package-json', packageJson);
  });

  mainWindow.show()
  mainWindow.setPosition(Math.round((width - windowWidth) / 2), 0, true)
}

app.whenReady().then(() => {
  createWindow()

  tray = new Tray(icon)

  const template = [
      {
        label: 'Show/Hide',
        click() {
            showHideApp()
        }
      },
      {
        label: 'Reload',
        click() {
          reloadApp()
        }
      },
      {
        label: 'Quiter',
        click() {
            app.quit();
        }
      }
  ];

  const contextMenuTray = Menu.buildFromTemplate(template);
  tray.setContextMenu(contextMenuTray);

  tray.on('click', () => {
      showApp()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})


app.on("web-contents-created", (...[/* event */, webContents]) => {

  webContents.on("context-menu", (event, params) => {
    event.preventDefault();

    const menu     = new Menu();
    menu.append(new MenuItem({ label: 'QuakeGPT', enabled: false}));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ role: 'cut' }));
    menu.append(new MenuItem({ role: 'copy' }));
    menu.append(new MenuItem({ role: 'paste' }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ role: 'undo' }));
    menu.append(new MenuItem({ role: 'redo' }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ role: 'toggleSpellChecker' }));
    menu.append(new MenuItem({ role: 'toggleDevTools' }));

    const correctionSubMenu = new Menu();

    for (const suggestion of params.dictionarySuggestions) {
      correctionSubMenu.append(new MenuItem({
        label: suggestion,
        click: () => mainWindow.webContents.replaceMisspelling(suggestion)
      }))
    }

    if (correctionSubMenu.items.length > 0) {
      menu.append(
        new MenuItem({
          label: 'Corrections', // Label du sous-menu
          submenu: correctionSubMenu // Ajouter le sous-menu de corrections
        })
      );
    }

    if (params.misspelledWord) {
      if (correctionSubMenu.items.length > 0) {
        correctionSubMenu.append(
          new MenuItem({
            label: 'Add to dictionary', // Option pour ajouter au dictionnaire dans le sous-menu des corrections
            click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
          })
        );
      }
    }

    menu.popup(webContents);
  }, false);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('close-app', () => {
  closeApp();
});

ipcMain.on('minimize-app', () => {
  minimizeApp();
});

ipcMain.on('hide-app', () => {
  hideApp();
});

ipcMain.on('reload-app', () => {
  reloadApp();
});

ipcMain.on('on-top', () => {
  onTop();
});

function showApp() {
  mainWindow.setPosition(Math.round((width - windowWidth) / 2), 0, true)

  if (mainWindow.isFocused()) {

  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

function showHideApp() {
  mainWindow.setPosition(Math.round((width - windowWidth) / 2), 0, true)
  if (mainWindow && mainWindow.isVisible()) {
    mainWindow.hide()
  } else { 
    mainWindow.show()
  }
}

function closeApp () {
  mainWindow.close()
}

function minimizeApp () {
  mainWindow.minimize()
}

function hideApp () {
  mainWindow.hide()
}

function reloadApp() {
  mainWindow.setPosition(Math.round((width - windowWidth) / 2), 0, true)
  mainWindow.reload()
}

function onTop() {
  if (mainWindow.isAlwaysOnTop()) {
    mainWindow.setAlwaysOnTop(false)
  } else {
    mainWindow.setAlwaysOnTop(true)
  }
}