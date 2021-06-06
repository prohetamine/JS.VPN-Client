const { BrowserWindow, ipcMain } = require('electron')

module.exports = class Notification {
    constructor(parent) {
        this.root = new BrowserWindow({
            frame: false,
            transparent: true,
            resizable: false,
            show: false,
            height: 520,
            width: 350,
            center: true,
            parent
        })
        
        this.root.loadURL(`${__dirname}/client/index.html`)
        
        ipcMain.on('SETTING_CLOSE', e => {
            this.root.hide()
            e.returnValue = 'ok'
        })
    }

    onSave(cb) {
        ipcMain.on('SETTING_SAVE', e => {
            cb()
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

    get() {
        return new Promise(resolve => {
            this.root.webContents.send('SETTING_GET')
            ipcMain.once('SETTING_DATA', (e, data) => {
                resolve(JSON.parse(data))
            })
        })
    }
}