const OpenVPN = require('./../../app/components/OpenVPN')

const ovpn = new OpenVPN()

// Обработка статусов ответов
ovpn.on(({ id, message }, other) => {
    if (id == 10 || id == 11) {
        // Установка
        ovpn.installer()
    }
    console.log(`id: ${id} | message: ${message}`)
})

// Подключение
ovpn.connect(`${__dirname}/config.ovpn`, { reconnect: true })

setTimeout(() => {
    // Отключение
    ovpn.disconnect()  
}, 30000)