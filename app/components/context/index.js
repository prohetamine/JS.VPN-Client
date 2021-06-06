const { BrowserWindow, ipcMain } = require('electron')

module.exports = class Context {
    constructor(parent) {
        this.root = new BrowserWindow({
            frame: false, 
            transparent: true,
            resizable: false,
            show: false, 
            width: 170,
            height: 235,
            parent
        })

        this.root.loadURL(`${__dirname}/client/index.html`)

        this.cb_update = () => {}
        
        this.root.on('blur', () => {
            this.root.hide()
        })
    }

    ready() {
        return new Promise(res => {
            this.root.once('ready-to-show', res)
        })
    }

    show() {
        this.root.show()
        this.root.focus()
    }

    hide() {
        this.root.hide()
    }

    onCheckIP(cb) {
        ipcMain.on('CONTEXT_CHECKIP', e => {
            this.hide()
            cb()
            e.returnValue = 'ok'
        })
    }

    onUpdate(cb) {
        this.cb_update = cb
        ipcMain.on('CONTEXT_UPDATE', e => {
            this.hide()
            cb()
            e.returnValue = 'ok'
        })
    }

    update() {
        this.cb_update()
    }

    onSetting(cb) {
        ipcMain.on('CONTEXT_SETTING', e => {
            this.hide()
            cb()
            e.returnValue = 'ok'
        })
    }

    onCallback(cb) {
        ipcMain.on('CONTEXT_CALLBACK', e => {
            this.hide()
            cb()
            e.returnValue = 'ok'
        })
    }

    onHidden(cb) {
        ipcMain.on('CONTEXT_HIDDEN', e => {
            this.hide()
            cb()
            e.returnValue = 'ok'
        })
    }

    onExit(cb) {
        ipcMain.on('CONTEXT_EXIT', e => {
            this.hide()
            cb()
            e.returnValue = 'ok'
        })
    }
}