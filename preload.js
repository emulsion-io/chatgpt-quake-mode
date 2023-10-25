const { contextBridge, ipcRenderer } = require('electron');

// Exposer uniquement les fonctions et les objets nécessaires
contextBridge.exposeInMainWorld('app', {
   closeApp: () => ipcRenderer.send('close-app'),
   minimizeApp: () => ipcRenderer.send('minimize-app'),
   reloadApp: () => ipcRenderer.send('reload-app'),
   hideApp: () => ipcRenderer.send('hide-app'),
   onTop: () => ipcRenderer.send('on-top'),
   handleOnglet: (callback) => ipcRenderer.on('update-onglet', callback)
});

ipcRenderer.on('package-json', (event, packageJson) => {
   document.getElementById('version').innerHTML = packageJson.version;
});

