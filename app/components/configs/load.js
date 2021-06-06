const request       = require('request')
    , fs            = require('fs')
    , Base64        = require(`js-base64`).Base64
    , parseConfigs  = require('./parse-configs')

module.exports = () => 
  new Promise((resolve, reject) => {
    request(`http://130.158.6.57/api/iphone/`, (err, res, body) => {
      
      if (err || res.statusCode != 200) {
        return reject()
      }

      const configs = parseConfigs(body).map(config => {
        const decode_config = Base64.decode(config.OpenVPN_ConfigData_Base64)
                                    .replace(/dev tun/g, `dev tap`)
            , path = `${__dirname}/base/${config.HostName}.ovpn`
        fs.writeFileSync(path, decode_config)
        delete config.OpenVPN_ConfigData_Base64
        config.path = path
        return config
      })

      fs.writeFileSync(`${__dirname}/configs.json`, JSON.stringify(configs))
      resolve(configs.length)
    })
  })