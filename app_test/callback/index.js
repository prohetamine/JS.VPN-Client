const { app }   = require('electron')
    , CALLBACK  = require('./../../app/components/callback')

app.on('ready', async() => {

    const Callback = new CALLBACK()

    await Callback.ready()

    // Показываем окно
    Callback.show()
})