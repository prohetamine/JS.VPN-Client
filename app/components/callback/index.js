const { BrowserWindow, ipcMain } = require('electron')

module.exports = class Callback {
    constructor(parent) {
        this.root = new BrowserWindow({
            frame: false,
            transparent: true,
            resizable: false,
            show: false,
            width: 175,
            height: 463,
            center: true,
            parent
        })
        
        this.root.loadURL(`${__dirname}/client/index.html`)

        ipcMain.on('CALLBACK_CLOSE', e => {
            this.root.hide()
            e.returnValue = 'ok'
        })
    }

    ready() {
        return new Promise(res => {
            this.root.once('ready-to-show', res)
        })
    }

    show() {
        this.root.show()
    }

    hide() {
        this.root.hide()
    }
}