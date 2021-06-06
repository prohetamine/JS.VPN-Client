module.exports = body =>
    body
    .replace(/[^#]+/, '')
    .replace(/#/, '')
    .replace(/\r\n/gi, ',')
    .split(',')

    .reduce((ctx, elem, index) => {

        if (index > 14) {
            const key = ctx.name_tmp[ctx.config_name_index]
            ctx.config_tmp[key] = elem
            ctx.config_name_index++
            if (ctx.config_name_index > 14) {
                ctx.configs.push(ctx.config_tmp)
                ctx.config_tmp = {}
                ctx.config_name_index = 0
            }
        } else {
            ctx.name_tmp.push(elem)
        }
    
        return ctx
    }, {
        name_tmp: [],
        config_name_index: 0,
        config_tmp: {},
        configs: []
    }).configs