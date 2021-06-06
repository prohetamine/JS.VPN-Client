const { app, Menu }  = require('electron')
    , ipify          = require('ipify')
    
    , OPENVPN        = require('./components/OpenVPN')
    , Configs        = require('./components/configs')
    , NOTIFY         = require('./components/notify')
    , CONTEXT        = require('./components/context')
    , CALLBACK       = require('./components/callback')
    , SETTING        = require('./components/setting')
    , VPN            = require('./components/vpn')

const CONFIRM_BUTTON_CATEGORY = [{
        title: 'Да',
        return: true
    }, {
        title: 'Нет',
        return: false
    }],
    CONFIRM_BUTTON_CONNECT = [{
        title: 'Настр.',
        return: true
    }, {
        title: 'Обнов. серв.',
        return: false
    }]

app.on('ready', async() => {

   const Vpn       = new VPN()
       , Notify    = new NOTIFY(Vpn.root)
       , Context   = new CONTEXT(Vpn.root)
       , Callback  = new CALLBACK(Context.root)
       , Setting   = new SETTING(Context.root)

    await Promise.all([
        Notify.ready(),
        Context.ready(),
        Callback.ready(),
        Setting.ready(),
        Vpn.ready()
    ])

    //o// Завершение инициализации окон //о//

    Context.onUpdate(() => (
        Notify.alert(`Обновление серверов...`, 2000, () =>
            Configs.load().then(
                length => Notify.alert(`Доступно: ${length} серверов`),
                error => Notify.confirm(`VPN сервера не обновлены. Попробовать еще раз ?`, CONFIRM_BUTTON_CATEGORY, reload => {
                    reload && Context.update()
                })
            )
        )
    ))

    Context.onCheckIP(() =>
        Notify.alert(`Определение IP ...`, 2000, () =>
            ipify().then(ip => Notify.alert(`IP: ${ip}`))
        )
    )

    Context.onSetting(() => Setting.show())

    Context.onCallback(() => Callback.show())

    Context.onHidden(() => {
        Vpn.hide()
        Context.hide()
        Callback.hide()
        Setting.hide()
        Notify.setType('static')
    })

    Context.onExit(() => app.quit())

    Vpn.onContext(() => Context.show())

    Vpn.showTray()

    Vpn.onTrayClick(() => {
        if (Vpn.status) {
            Vpn.disconnect()
        } else {
            Vpn.disconnect()
            Vpn.connect()
        }
    })

    Vpn.onTrayRightClick(() => {
        if (!Vpn.isVisible()) {
            Vpn.show()
            Notify.setType('fly')
            return
        }
        Vpn.hide()
        Context.hide()
        Callback.hide()
        Setting.hide()
        Notify.setType('static')
    })

    Setting.onSave(async() => {
        const vpn_setting = await Setting.get()
        const configs = Configs.get(vpn_setting)
        if (configs.length != 0) {
            Notify.alert(`Доступно: ${configs.length} серверов`, 6000)
        } else {
            Notify.confirm('Нет доступных для подключения серверов. Изменить настройки или обновить сервера ?', CONFIRM_BUTTON_CONNECT, config => {
                if (config) {
                    Setting.show()
                } else {
                    Context.update()
                }
            })
        }
    })

    const {
        AutoUpdate, Permutation, StartHidden
    } = await Setting.get()

    if (Permutation) {
        Vpn.center()
    }

    if (StartHidden) {
        Vpn.hide()
        Notify.setType('static')
    } else {
        Vpn.show()
    }

    if (AutoUpdate) {
        Context.update()
    }

    Configs.get({}).length == 0 && Context.update()

    //o// С в этой части кода происходмт взаимодействие с основным модулем //о//

    const OpenVPN = new OPENVPN()

    OpenVPN.on(({
        id, message
    }, {
        config_information, reconnect
    }) => {

        if (id == 1) {
            Vpn.setStatus('waiting', 'yellow')
        }

        if (id == 2) {
            Vpn.stopReconnect()
            Vpn.setStatus('resolve', 'blue')
            Notify.alert('VPN подключен', 2000, () =>
                Notify.alert(config_information, 30000)
            )
        }

        if (id == 3) {
            Vpn.setStatus('waiting', 'yellow')
            Notify.alert('Переподключение к VPN', 4000)
            if (reconnect) {
                Vpn.reconnect(next => {
                    Notify.alert('Переподключение продолжается слишком долго, автоматическая смена VPN сервера', 4000, () => {
                        next()
                    })
                })
            }
        }

        if (id == 4) {
            Vpn.setStatus('reject', 'red')
            reconnect && Vpn.reconnect(next => next())
        }

        if (id == 5) {
            if (!Vpn.isReconnect) {
                Vpn.stopReconnect()
                Vpn.setStatus('reject', 'red')
            }
        }

        if (id == 6) {
            reconnect && Vpn.reconnect(next => {
                Notify.alert('Переподключение продолжается слишком долго, автоматическая смена VPN сервера', 4000, () => {
                    next()
                })
            })
        }

        if (id == 7) {
            Notify.alert('TCP-соединение с VPN не удалось', 4000, () => {
                Vpn.setStatus('reject', 'red')
                Vpn.disconnect()
            })
            reconnect && Vpn.reconnect(next => next())
        }

        if (id == 8) {
            reconnect && Vpn.reconnect(next => {
                Notify.alert('Подключение продолжается слишком долго, автоматическая смена VPN сервера', 4000, () => {
                    next()
                })
            })
        }

        if (id == 9) {
            Vpn.stopReconnect()
            Vpn.setStatus('waiting', 'orange')
            Notify.alert('Установка OpenVPN')
        }

        if (id == 10 || id == 11) {
            Notify.confirm('Не удается подключиться к OpenVPN, установить необходимые компоненты ?', CONFIRM_BUTTON_CATEGORY, install => {
                if (install) {
                    OpenVPN.installer()
                } else {
                    Notify.confirm('Выйти из JS.VPN-Client ?', CONFIRM_BUTTON_CATEGORY,
                        exit => exit && app.quit()
                    )
                }
            })
        }

        if (id == 12) {
            Vpn.setStatus('reject', 'red')
            Notify.confirm('Не удалось установить TAP адаптер, попробовать еще раз ?', CONFIRM_BUTTON_CATEGORY, install => {
                if (install) {
                    OpenVPN.installer()
                } else {
                    Notify.confirm('Выйти из JS.VPN-Client ?', CONFIRM_BUTTON_CATEGORY,
                        exit => exit && app.quit()
                    )
                }
            })
        }

        if (id == 13) {
            Vpn.setStatus('reject', 'red')
            Notify.alert('Необходимые компоненты установлены!')
        }

        if (id == 14) {
            Vpn.setStatus('reject', 'red')
            Notify.alert('Неизвестная ошибка')
            reconnect && Vpn.reconnect(next => next())
        }

        console.log(`${id} | ${message}`)
    })

    Vpn.onConnect(async() => {
        const vpn_setting = await Setting.get()

        const configs = Configs.get(vpn_setting),
            random_config = parseInt(Math.random() * (configs.length - 1)),
            conf = configs[random_config]

        if (!conf) {
            return Notify.confirm('Нет доступных для подключения серверов. Изменить настройки или обновить сервера ?', CONFIRM_BUTTON_CONNECT, config => {
                if (config) {
                    Setting.show()
                } else {
                    Context.update()
                }
            })
        }

        const config_information =
            `IP: ${conf.IP}<br>` +
            `Страна: ${conf.CountryLong.length > 9 ? `${conf.CountryLong.slice(0, 9)}..` : conf.CountryLong}<br>` +
            `${conf.Ping != '-' && `Ping: ${conf.Ping}ms <br> `}` +
            `${(conf.Speed || conf.Speed != 0) ? `Скорость: ${(conf.Speed / 1024 / 1024).toFixed(2)}Mb <br> ` : ''}` +
            `${(conf.Uptime || conf.Speed != 0) ? `Uptime: ${parseUptime(conf.Uptime)} <br> ` : ''}` +
            `Подключено: ${conf.NumVpnSessions}`

        OpenVPN.connect(conf.path, {
            reconnect: vpn_setting.AutoReconnect,
            config_information
        })
    })

    Vpn.onDisconnect(vpn_setting => {
        OpenVPN.disconnect()
    })
})

//о// Прочие функции для оформления //о//

const declOfNum = (number, titles) => {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

const parseUptime = (l) => {

    const day = parseInt(l / 60000 / 60 / 24)
    const hours = parseInt(l / 60000 / 60)
    const min = parseInt(l / 60000)

    if (day) {
        return `${day} ${declOfNum(day, ['день', 'дня', 'дней'])}`
    }

    if (hours) {

        return `${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])}`
    }

    if (min) {
        return `${min} ${declOfNum(min, ['минута', 'минуты', 'минут'])}`
    }

    return 'нет данных'
}