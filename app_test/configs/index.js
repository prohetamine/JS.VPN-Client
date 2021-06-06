const Configs = require('./../../app/components/configs')

Configs.load().then(length => {
    console.log(`Загружено конфигов: ${length}`)
    
    const search = Configs.get({
        CountryLong: 'Japan'
      , Ping: 22 // 1-22
      , NumVpnSessions: '-' // empty
      , Score: '-' // empty
      , Speed: 13311 // bit
      , Uptime: 3600000 // ms
      , TotalUsers: '-' // empty
      , TotalTraffic: '-' // empty
    })

    console.log(`Найдено конфигов: ${search.length}`)
    
}, () => {
    console.log(`Ошибка загрузки конфигов`)
})

