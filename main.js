
const { BrowserWindow, screen, Menu, app, Tray, nativeImage } = require('electron')
if(require('electron-squirrel-startup')) return app.quit()
const path = require('path')

try {
   require('electron-reloader')(module)
} catch (_) {}

var shortcut = "CommandOrControl+Shift+A"
var mainWindow;
var tray;

const iconPath = path.join(__dirname, 'icons', 'icon.png')
const icon = nativeImage.createFromPath(iconPath)

function createWindow() {
  // Obtenir la taille de l'écran
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  // Calculer les dimensions de la fenêtre
  const windowWidth = Math.round(width * 0.7)
  const windowHeight = Math.round(height / 3)

  // Créer la fenêtre
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: Math.round((width - windowWidth) / 2), // Centrer horizontalement
    y: -windowHeight, // Positionner la fenêtre en haut de l'écran
    frame: false, // Masquer le cadre de la fenêtre
    webPreferences: {
      nodeIntegration: true // Autoriser l'intégration de Node.js dans la fenêtre
    }
  })

  mainWindow.loadURL('https://chat.openai.com')

   // Register a global shortcut to toggle the window visibility
   const { globalShortcut } = require('electron')
   globalShortcut.register(shortcut, () => {
   mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
   })

  // Afficher la fenêtre avec un effet de glissement
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
          ReloadApp()
        }
      },
      {
        label: 'Quiter',
        click() {
            app.quit();
        }
      }
   ];

   const contextMenu = Menu.buildFromTemplate(template);
   tray.setContextMenu(contextMenu);
 
   tray.on('click', () => {
      showApp()
   })

   app.on('activate', () => {
     if (BrowserWindow.getAllWindows().length === 0) {
       createWindow()
     }
   })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function showApp() {

   if (mainWindow.isFocused()) {
   } else {
      mainWindow.show()
      mainWindow.focus()
   }

}

function ReloadApp() {
   mainWindow.reload()
}

function showHideApp() {
   if (mainWindow && mainWindow.isVisible()) {
      mainWindow.hide()
   } else { 
      mainWindow.show()
   }
}