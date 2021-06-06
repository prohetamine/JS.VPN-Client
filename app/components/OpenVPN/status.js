module.exports = {
    VPN_START_CONNECT: {
        regexp: new RegExp(`OpenVPN 2.4.6`, `gi`), 
        message: `Подключение к VPN`, 
        id: 1
    }
    ,
    VPN_CONNECT: {
        regexp: new RegExp(`Initialization Sequence Completed`, `gi`), 
        message: `VPN подключен и готов к работе`, 
        id: 2
    }
    ,
    VPN_RECONNECT: {
        regexp: new RegExp(`Restart pause, .+second`, `gi`), 
        message: `Переподключение к VPN`, 
        id: 3
    }
    ,
    VPN_ERROR: {
        message: `ошибка OpenVPN`, 
        id: 4
    }
    ,
    VPN_DISCONNECT: {
        message: `Отключение от VPN`, 
        id: 5
    }
    ,
    TCP_START_CONNECT: {
        regexp: new RegExp(`Attempting to establish TCP connection with`, `gi`), 
        message: `Попытка установить TCP-соединение с VPN`, 
        id: 6
    }
    ,
    TCP_CONNECT_ERROR: {
        regexp: new RegExp(`TCP: connect to.+failed: Unknown error`, `gi`), 
        message: `Не удалось установить TCP-соединение с VPN`, 
        id: 7
    }
    ,
    TCP_CONNECT: {
        regexp: new RegExp(`TCP connection established with`, `gi`), 
        message: `TCP-соединение установлено с VPN`, 
        id: 8
    }
    ,
    TAP_START_SETUP: {
        message: `Установка TAP адаптера`, 
        id: 9
    }
    ,
    TAP_USE: {
        regexp: new RegExp(`There are no TAP-Windows adapters on this system.+`, `gi`), 
        message: `Виртуальный драйвер OpenVPN уже используется.`, 
        id: 10
    }
    ,
    TAP_NOT: {
        regexp: new RegExp(`There are no TAP-Windows adapters on this system.+`, `gi`), 
        message: `В этой системе нет адаптеров TAP`, 
        id: 11
    }
    ,
    TAP_SETUP_ERROR: {
        message: `Не удалось установить TAP адаптер`, 
        id: 12
    }
    ,
    TAP_SETUP: {
        message: `TAP адаптер установлен и готов к работе`, 
        id: 13
    }
    ,
    IP_ADDRESS_ERROR: {
        regexp: new RegExp(`TCP: connect to.+failed: Unknown error`, `gi`), 
        message: `Проблемы с VPN сервером, не удается подключиться`, 
        id: 14
    }
}