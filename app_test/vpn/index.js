const { app }  = require('electron')
    , VPN      = require('./../../app/components/vpn')

app.on('ready', async() => {

    const Vpn = new VPN()

    // Только после того как окно инициализируется программа продолжит исполнятся
    await Vpn.ready()

    // Показываем окно
    Vpn.show()
        // Показываем Tray
    Vpn.showTray()

    // Обработчик подключения
    Vpn.onConnect(() => {
        console.log('Connect')
            // Передаем в окно статус
        Vpn.setStatus('waiting', 'yellow')
        setTimeout(() => {
            console.log('Connected!')
                // Передаем в окно статус
            Vpn.setStatus('resolve', 'blue')
        }, 4000)
    })

    // Обработчик отключения 
    Vpn.onDisconnect(() => {
        console.log('Disconnect')
            // Передаем в окно статус
        Vpn.setStatus('reject', 'red')
    })

    Vpn.onContext(() => {
        console.log('Context menu')
    })

    // Переподключатель если в течении 5 сек после объявления 
    // не будет вызвана функция Vpn.stopReconnect()
    // произойдет переподключение
    Vpn.reconnect(next => {
        console.log('Reconnect')
        next()
    }, 5000)

    // Предотвращает или останавливает переподключение
    //stopReconnect()

    // Обработчик клика на Tray
    Vpn.onTrayClick(() => {
        // Имитация подключения и отключения
        if (!Vpn.status) {
            Vpn.connect()
        } else {
            Vpn.disconnect()
        }
    })

    // Обработчик клика правой кнопкой мыши на Tray
    Vpn.onTrayRightClick(() => {
        if (Vpn.isVisible()) {
            Vpn.hide()
        } else {
            Vpn.show()
        }
    })

})