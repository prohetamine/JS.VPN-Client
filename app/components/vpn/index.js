const { BrowserWindow, Tray, ipcMain } = require('electron')

module.exports = class VPN {
    constructor() {
        this.root = new BrowserWindow({
            title: `JS.VPN-Client`,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            resizable: false,
            center: true, 
            show: false,
            acceptFirstMouse: true,
            width: 116, 
            height: 116,
            fullscreenable: false
        })

        this.root.loadURL(`${__dirname}/client/index.html`) 
        
        this.tray = {}
        
        this.isReconnect = false
        this.reconnect_stack = []        

        this.status = false
        
        this.cb_connect = () => {}
        this.cb_disconnect = () => {}
    }

    ready() {
        return new Promise(res => {
            this.root.once('ready-to-show', res)
        })
    }

    showTray() { 
        this.tray = new Tray(`${__dirname}/icon/red.ico`)
        this.tray.setToolTip('Отключен')
    }

    show() {
        this.root.show()
    }

    hide() {
        this.root.hide()
    }

    isVisible() {
        return this.root.isVisible()
    }

    onTrayClick(cb) {
        this.tray.on('click', cb)
    }

    onTrayRightClick(cb) {
        this.tray.on('right-click', cb)
    }

    center() {
        this.root.center()
    }

    onDisconnect(cb) {
        this.cb_disconnect = cb 
        ipcMain.on('VPN_DISCONNECT', e => {
            cb()
            e.returnValue = 'ok'
        })
    }

    onConnect(cb) {
        this.cb_connect = cb
        ipcMain.on('VPN_CONNECT', (e, data) => {
            cb()
            e.returnValue = 'ok'
        })
    }

    connect() {
        this.cb_connect()
    }

    disconnect() {
        this.cb_disconnect()
    }

    onContext(cb) {
        ipcMain.on('VPN_CONTEXT', (e, data) => {
            cb(data)
            e.returnValue = 'ok'
        })
    }

    stopReconnect() {
        this.reconnect_stack.map(i => clearTimeout(i))
        this.reconnect_stack = []
    }

    reconnect(cb, time = 15000) {
        this.stopReconnect()
        this.reconnect_stack.push(
            setTimeout(() => {
                this.isReconnect = true
                cb(() => {
                    this.disconnect()
                    this.connect()
                })
                this.isReconnect = false
            }, time)
        )
    }

    setStatus(animation, color) {
        let statusText = 'Отключен'

        if (color == 'blue') {
            statusText = 'Подключен'
        }

        if (color == 'yellow') {
            statusText = 'Подключение'
        }

        if (color == 'orange') {
            statusText = 'Установка компонентов'
        }

        this.tray.setToolTip(statusText)
        this.tray.setImage(`${__dirname}/icon/${color}.ico`)
        this.status = color == 'red' ? false : true;
        this.root.webContents.send('VPN_STATUS', JSON.stringify({
            animation, color
        }))
    }
}