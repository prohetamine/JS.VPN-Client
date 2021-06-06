const fs      = require('fs')
    , Base64  = require(`js-base64`).Base64

module.exports = ({
    CountryLong = '-'
  , Ping = '-'
  , NumVpnSessions = '-'
  , Score = '-'
  , Speed = '-'
  , Uptime = '-'
  , TotalUsers = '-'
  , TotalTraffic = '-'
}) => {
    try {
        const configs = fs.readFileSync(`${__dirname}/configs.json`, {
            encoding: 'utf8'
        }) 

        return JSON.parse(configs)
            .filter(conf =>
                (conf.CountryLong == CountryLong || CountryLong == '-') &&
                (parseInt(conf.Ping) < parseInt(Ping) || Ping == '-') &&
                (parseInt(conf.NumVpnSessions) > parseInt(NumVpnSessions) || NumVpnSessions == '-') &&
                (parseInt(conf.Score) > parseInt(Score) || Score == '-') &&
                (parseInt(conf.Speed) > parseInt(Speed) || Speed == '-') &&
                (parseInt(conf.Uptime) > parseInt(Uptime) || Uptime == '-') &&
                (parseInt(conf.TotalUsers) > parseInt(TotalUsers) || TotalUsers == '-') &&
                (parseInt(conf.TotalTraffic) > parseInt(TotalTraffic) || TotalTraffic == '-')
            )
    } catch (e) {
        return []
    }
}