const { app } = require('electron')
    , SETTING = require('./../../app/components/setting')

app.on('ready', async() => {

    const Setting = new SETTING()

    // Только после того как окно инициализируюется программа продолжит исполнятся
    await Setting.ready()

    // Показывает окно
    Setting.show()
    
    // Обработчик сохранения
    Setting.onSave(async () => {
        // Запрашиваем настройки
        const vpn_setting = await Setting.get()
        console.log(vpn_setting)
    })

})