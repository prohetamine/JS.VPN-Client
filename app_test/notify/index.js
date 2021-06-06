const { app }   = require('electron')
     , VPN      = require('./../../app/components/vpn')
     , NOTIFY   = require('./../../app/components/notify')

app.on('ready', async() => {

    const Vpn    = new VPN()
        , Notify = new NOTIFY(Vpn.root)

    // Только после того как окна инициализируются программа продолжит исполнятся
    await Promise.all([
        Notify.ready(),
        Vpn.ready()
    ])

    Vpn.show()
    Vpn.showTray()

    const CONFIRN_FSB = [{
        title: 'Да',
        return: 'Да, подключайте меня!'
    }, {
        title: 'Нет',
        return: false
    }]

    setTimeout(() => {
        // Уведомление типа "alert"
        Notify.alert('Прогресс не остановить!', 3000, () => {
            // Уведомление типа "confirm"
            Notify.confirm('Вы хотите подключиться к VPN', CONFIRN_FSB, data => {
                console.log(data)
                if (data == false) {
                    // Устанавливает тип уведомления
                    Notify.setType('static')
                        // Уведомление типа "confirm"
                    Notify.confirm('Вы хотите выйти ?', CONFIRN_FSB, data => {
                        if (data != false) {
                            app.quit()
                        }
                    })
                } else {
                    Vpn.setStatus('resolve', 'blue')
                }
            })
        })
    }, 2000)

    // Устанавливает тип уведомления
    // Notify.setType('static')

    // Уведомление типа "alert"
    // Notify.alert('Прогресс не остановить!', 3000, () => {})

    // Уведомление типа "confirm"
    //Notify.confirm('Вы хотите подключиться к VPN', CONFIRN_FSB, console.log)
})