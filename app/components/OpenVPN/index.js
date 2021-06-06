const { spawn }    = require(`child_process`)
       , fs        = require(`fs`)
       , installer = require('./installer')
       , STATUS    = require('./status')

module.exports = class OpenVPN {
    constructor() {
        this.cb = data => console.log(data) 
        
        this.info_config = {}

        this.reconnect = 0
    }

    on(cb) {
        this.cb = cb
    }

    installer() {
        this.cb({
            id: STATUS.TAP_START_SETUP.id,
            message: STATUS.TAP_START_SETUP.message
        }, this.info_config) 
        installer().then(() => {
            this.cb({
                id: STATUS.TAP_SETUP.id,
                message: STATUS.TAP_SETUP.message
            }, this.info_config)
        }, () => {
            this.cb({
                id: STATUS.TAP_SETUP_ERROR.id,
                message: STATUS.TAP_SETUP_ERROR.message
            }, this.info_config)
        })
    }

    disconnect() {
        try {
            this.VPN.kill()
        } catch (e) {}
    }

    connect(path_config, info_config) {
        this.info_config = info_config 
        
        const command  = `${__dirname}/VPN/${process.arch}/bin/openvpn.exe`
              , VPN    = spawn(command, [`--config`, path_config]);

        VPN.stdout.on(`data`, data => {
            const text = data.toString()

            if (text.match(STATUS.TCP_CONNECT_ERROR.regexp)) {
                this.cb({
                    id: STATUS.TCP_CONNECT_ERROR.id,
                    message: STATUS.TCP_CONNECT_ERROR.message
                }, this.info_config)
                return
            }

            if (text.match(STATUS.IP_ADDRESS_ERROR.regexp)) {
                this.cb({
                    id: STATUS.IP_ADDRESS_ERROR.id,
                    message: STATUS.IP_ADDRESS_ERROR.message
                }, this.info_config)
                return
            }

            if (text.match(STATUS.TAP_USE.regexp)) {
                this.cb({
                    id: STATUS.TAP_USE.id,
                    message: STATUS.TAP_USE.message
                }, this.info_config)
                return
            }

            if (text.match(STATUS.TAP_NOT.regexp)) {
                this.cb({
                    id: STATUS.TAP_NOT.id,
                    message: STATUS.TAP_NOT.message
                }, this.info_config)
                return
            }

            if (text.match(STATUS.VPN_START_CONNECT.regexp)) {
                this.cb({
                    id: STATUS.VPN_START_CONNECT.id,
                    message: STATUS.VPN_START_CONNECT.message
                }, this.info_config)
                return
            }

            if (text.match(STATUS.TCP_START_CONNECT.regexp)) {
                this.cb({
                    id: STATUS.TCP_START_CONNECT.id,
                    message: STATUS.TCP_START_CONNECT.message
                }, this.info_config)
                return
            }

            if (text.match(STATUS.TCP_CONNECT.regexp)) {
                this.cb({
                    id: STATUS.TCP_CONNECT.id,
                    message: STATUS.TCP_CONNECT.message
                }, this.info_config)
                return
            }

            if (text.match(STATUS.VPN_CONNECT.regexp)) {
                this.cb({
                    id: STATUS.VPN_CONNECT.id,
                    message: STATUS.VPN_CONNECT.message
                }, this.info_config)
                return
            }

            if (text.match(STATUS.VPN_RECONNECT.regexp)) {
                if (this.reconnect) {
                    return
                }
                this.reconnect = 1
                this.cb({
                    id: STATUS.VPN_RECONNECT.id,
                    message: STATUS.VPN_RECONNECT.message
                }, this.info_config)
                return
            } else {
                this.reconnect = 0
            }
        });

        VPN.stderr.on(`data`, (data) => {
            this.cb({
                id: STATUS.VPN_ERROR.id,
                message: STATUS.VPN_ERROR.message
            }, this.info_config)
        });
        
        VPN.on(`close`, (code) => {
            this.cb({
                id: STATUS.VPN_DISCONNECT.id,
                message: STATUS.VPN_DISCONNECT.message
            }, this.info_config)
        });

        this.VPN = VPN
    }
}