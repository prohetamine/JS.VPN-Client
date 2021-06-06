const { app }   = require('electron')
    , VPN       = require('./../../app/components/vpn')
    , CONTEXT   = require('./../../app/components/context')

app.on('ready', async() => {

    const Vpn   = new VPN(),
        Context = new CONTEXT(Vpn.root)

    // Только после того как окна инициализируются программа продолжит исполнятся
    await Promise.all([
        Context.ready(),
        Vpn.ready()
    ])

    Vpn.show()
    Vpn.showTray()

    Vpn.onContext(() => Context.show())

    // обработчики  
    Context.onCheckIP(() => {
        console.log('Определить IP')
    })

    Context.onUpdate(() => {
        console.log('Обновить сервера')
    })

    Context.onSetting(() => {
        console.log('Настройки')
    })

    Context.onCallback(() => {
        console.log('Обратная связь')
    })

    Context.onHidden(() => {
        console.log('Свернуть')
    })

    Context.onExit(() => {
        console.log('Выход')
    })

})