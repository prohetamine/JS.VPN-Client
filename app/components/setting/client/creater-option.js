NumVpnSessions.innerHTML += Array(100).fill(1).map((e, i) => {
    if (i < 10) {
        return `<option value='${i+1}'>${i+1}</option>`
    }
    return `<option value='${parseInt(i*1.5)}'>${parseInt(i*1.5)}</option>`
}).join('')

Ping.innerHTML += Array(150).fill(1).map((e, i) => {
    if (i < 10) {
        return `<option value='${i+1}'>${i+1}ms</option>`
    }
    return `<option value='${parseInt(i*1.5)}'>${parseInt(i*1.5)}ms</option>`
}).join('')

TotalUsers.innerHTML += Array(150).fill(1).map((e, i) => `<option value='${parseInt((i+1)*(i+1))}'>${parseInt((i+1)*(i+1))}</option>`).join('')

const Contrys = ['Japan', 'Korea Republic of', 'United States', 'Thailand', 'Germany',
    'New Zealand', 'Argentina', 'Poland', 'United Kingdom', 'Hong Kong',
    'Viet Nam', 'Russian Federation', 'France', 'China', 'Singapore',
    'Trinidad and Tobago', 'Moldova Republic of', 'Canada', 'Romania',
    'Algeria', 'Venezuela', 'Indonesia', 'Brazil', 'Mexico', 'Cyprus',
    'Iceland', 'Bangladesh', 'Morocco', 'Iraq', 'Ukraine', 'Iran',
    'Turkey', 'Angola', 'El Salvador', 'Chile', 'Egypt', 'Spain',
    'Netherlands', 'Colombia'
]

CountryLong.innerHTML += Contrys.map(e => `<option value='${e}'>${e}</option>`).join('')

Uptime.innerHTML += Array(79).fill(1).map((e, i) => {
    if (i < 15) {
        return `<option value='${(i+1)*60*1000}'>${i+1} мин.</option>`
    }

    if (i < 18) {
        return `<option value='${(i-13)*15*60*1000}'>${(i-13)*15} мин.</option>`
    }

    if (i < 40) {
        return `<option value='${(i-16)*60*60*1000}'>${(i-16)} час.</option>`
    }

    if (i < 69) {
        return `<option value='${(i-38)*24*60*60*1000}'>${(i-38)} ден.</option>`
    }

    if (i < 79) {
        return `<option value='${(i-67)*30*24*60*60*1000}'>${(i-67)} мес.</option>`
    }
}).join('')

Speed.innerHTML += Array(100).fill(1).map((e, i) => {
    if (i < 5) {
        return `<option value='${parseInt(1048576*((i+1)/100))}'>${(i+1)/100} Mbit</option>`
    }

    if (i < 9) {
        return `<option value='${parseInt(1048576*((i+1)/10))}'>${(i+1)/10} Mbit</option>`
    }

    if (i < 19) {
        return `<option value='${parseInt(1048576*(i-8))}'>${(i-8)} Mbit</option>`
    }

    return `<option value='${parseInt(1048576*((i-18)*i))}'>${(i-18)*i} Mbit</option>`
}).join('')

TotalTraffic.innerHTML += Array(150).fill(1).map((e, i) => {
    if (i < 10) {
        return `<option value='${parseInt(1048576*(i+1))}'>${i+1} Mbit</option>`
    }

    if (i < 20) {
        return `<option value='${parseInt(1048576*((i+1)*10))}'>${(i+1)*10} Mbit</option>`
    }

    if (i < 50) {
        return `<option value='${parseInt(1048576*((i+1)*100))}'>${(i+1)*100} Mbit</option>`
    }

    if (i < 60) {
        return `<option value='${parseInt(1073741824*((i-45)*1))}'>${(i-45)*1} Gbit</option>`
    }

    if (i < 70) {
        return `<option value='${parseInt(1073741824*((i-45)*10))}'>${(i-45)*10} Gbit</option>`
    }

    if (i < 150) {
        return `<option value='${parseInt(1073741824*((i-45)*100))}'>${(i-45)*100} Gbit</option>`
    }
}).join('')

Score.innerHTML += Array(100).fill(1).map((e, i) => `<option value='${(i+25)*(i+25)*(i+25)}'>${i+1}%</option>`).reverse().join('')