const { BrowserWindow, ipcMain } = require('electron')

module.exports = class Notification {
    constructor(parent) {
        const window_tmp = {
            frame: false,
            transparent: true,
            resizable: false,
            show: false,
            focusable: true,
            height: 175,
            width: 200,
            maxWidth: 200,
            parent
        }

        this.root = new BrowserWindow(window_tmp)
        this.root2 = new BrowserWindow(window_tmp)
        
        this.root.loadURL(`${__dirname}/client/fly.html`)
        this.root2.loadURL(`${__dirname}/client/static.html`)

        this.type = 'fly'
        
        this.waitingConfirm = 0
    }

    ready() {
        return Promise.all([
            new Promise(res => {
                this.root.once('ready-to-show', res)
            }),
            new Promise(res => {
                this.root2.once('ready-to-show', res)
            })
        ])
    }

    setType(value) {
        this.hide()
        this.type = value
    }

    hide() {
        this.root.hide()
        this.root2.hide()
    }

    alert(message = 'message', hideTime = 6000, callback = () => {}) {
        if (this.waitingConfirm) {
            return
        }

        clearTimeout(this.t) 

        this.hide()
        const ROOT = this.type == 'fly' ? 'root' : 'root2'

        this[ROOT].webContents.send('ALERT', message)

        this[ROOT].show()
        this[ROOT].blur()
        
        this.t = setTimeout(() => {
            this[ROOT].hide()
            callback()
        }, hideTime)

        ipcMain.once('ALERT_HIDE', () => {
            clearTimeout(this.t)
            this[ROOT].hide()
            callback()
        })
    }

    confirm(message, button, callback) {
        clearTimeout(this.t)

        this.waitingConfirm = 1

        this.hide()
        const ROOT = this.type == 'fly' ? 'root' : 'root2'

        this[ROOT].show()
        this[ROOT].blur()

        this[ROOT].webContents.send('CONFIRM', JSON.stringify({
            message, button
        }))

        ipcMain.once('CONFIRM_CALLBACK', (e, data) => {
           this.waitingConfirm = 0
            try {
                this[ROOT].hide()
                callback(data)
            } catch (e) {}
        })
    }
}