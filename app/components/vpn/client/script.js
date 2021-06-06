class VPNstatus {
    constructor (plane, btnBody, btnBorder) {
        this.plane      = plane
        this.btnBody    = btnBody
        this.btnBorder  = btnBorder
        
        this.speedAnimation = 0.9

        this.colors = {
            red: {
                boxShadow: '1px 1px 5px 1px rgba(255, 24, 37, 0.4)',
                borderBackground: '#e2333d',
                background: '#f06069'
            },
            blue: {
                background: '#60a2f0',
                borderBackground: '#3286e3',
                boxShadow: '2px 2px 5px 1px rgba(40, 138, 255, 0.4)'
            },
            yellow: {
                background: '#f5cc5b',
                borderBackground: '#f1c131',
                boxShadow: '2px 2px 5px 1px rgba(255, 197, 37, 0.4)'
            },
            orange: {
                background: '#f09c60',
                borderBackground: '#e37a32',
                boxShadow: '2px 2px 5px 1px rgba(255, 127, 35, 0.4)'
            }
        }

        this.step = {
            start: {
                left: '-40px',
                top: '73px'
            },
            center: {
                top: '19px',
                left: '13px'
            },
            end: {
                top: '-45px',
                left: '71px'
            }   
        }

        this.status = 0
    }

    color (value) {
        btnBody.style.background = this.colors[value].background
        btnBorder.style.background = this.colors[value].borderBackground
        btnBorder.style.boxShadow = this.colors[value].boxShadow
    }

    waiting () {
        statVPN.center_to_end(() => {
            this.start_to_end(() => {
                if (this.status == 1) {
                    TweenMax.killAll()
                    this.plane.style.left = this.step.start.left;
                    this.plane.style.top = this.step.start.top;
                    statVPN.start_to_center()
                    this.status = 2
                }
            })
        })
    }

    resolve () {
        this.status = 1
    }

    reject () {
        this.status = 2
        statVPN.center_to_end(() => {
            statVPN.start_to_center()
        })
    }

    start_to_end (callback) {
        this.plane.style.left = this.step.start.left;
        this.plane.style.top = this.step.start.top;
        TweenMax.to(this.plane, this.speedAnimation * 2, {
            top: this.step.end.top,
            left: this.step.end.left,
            repeat: -1,
            ease: Elastic.ease,
            onRepeat: callback ? callback : () => {}
        })
    }

    center_to_end (callback) {
        this.plane.style.left = this.step.center.left;
        this.plane.style.top = this.step.center.top;
        TweenMax.to(this.plane, this.speedAnimation, {
            top: this.step.end.top,
            left: this.step.end.left,
            ease: Elastic.ease,
            onComplete: callback ? callback : () => {}
        })
    }

    start_to_center (callback) {
        this.plane.style.left = this.step.start.left;
        this.plane.style.top = this.step.start.top;
        TweenMax.to(this.plane, this.speedAnimation, {
            top: this.step.center.top,
            left: this.step.center.left,
            ease: Elastic.ease,
            onComplete: callback ? callback : () => {}
        })
    }

}