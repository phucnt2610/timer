class MyInputTimer {
    constructor() {
        this.inputMinutes = document.getElementById('input-minute');
        this.inputSeconds = document.getElementById('input-second');
    }

    getInputMinute = () => {
        return parseInt(this.inputMinutes.value) || 0;
    }

    getInputSecond = () => {
        return parseInt(this.inputSeconds.value) || 0;
    }

    getTotalTime = () => {
        return (this.getInputMinute() * 60 + this.getInputSecond()) * 1000;
    }
}

class MyCurrentTime {
    constructor() { }

    getCurrentTime = (time, timeUnit) => {
        if (timeUnit === 'minutes') {
            let m = Math.floor(time / 60000);
            m = String(m).padStart(2, '0');
            return m;
        } else if (timeUnit === 'seconds') {
            let s = Math.floor((time % 60000) / 1000);
            s = String(s).padStart(2, '0');
            return s;
        } else {
            let ms = Math.floor((time % 1000) / 1000 * 30);
            ms = String(ms).padStart(2, '0');
            return ms;
        }
    }
}

class MyTimerUi {
    constructor() {
        this.myCurrentTime = new MyCurrentTime();

        this.currentMinutes = document.getElementById('current-minute');
        this.currentSeconds = document.getElementById('current-second');
        this.currentMiliseconds = document.getElementById('current-milisecond');

        this.startBtnActive = document.getElementById('start-btn-active');
        this.startBtnText = document.getElementById('start-btn-text');

        this.stopBtnActive = document.getElementById('stop-btn-active');
        this.stopBtnText = document.getElementById('stop-btn-text');

        this.countdownBtnActive = document.getElementById('countdown-btn-active');
        this.countdownBtnText = document.getElementById('countdown-btn-text');
    }

    updateTimeText = (time) => {
        this.currentMinutes.textContent = this.myCurrentTime.getCurrentTime(time, 'minutes');
        this.currentSeconds.textContent = this.myCurrentTime.getCurrentTime(time, 'seconds');
        this.currentMiliseconds.textContent = this.myCurrentTime.getCurrentTime(time, 'miliseconds');
    }

    startBtnClick = () => {
        this.startBtnActive.classList.remove("active-control");
        this.stopBtnActive.classList.add("active-control");
    }

    stopBtnClick = () => {
        this.stopBtnActive.classList.remove("active-control");
        this.startBtnActive.classList.add("active-control");
    }

    countdownBtnClick = (isCountdown) => {
        if (isCountdown) {
            this.countdownBtnText.classList.remove("active-control-count-btn");
            this.countdownBtnActive.classList.add("active-control-count-btn");
        } else {
            this.countdownBtnText.classList.add("active-control-count-btn");
            this.countdownBtnActive.classList.remove("active-control-count-btn");
        }
    }

}

class MyWarning20Sec {
    constructor() {
        this.myInputTimer = new MyInputTimer();
        this.displayArea = document.querySelectorAll('.display-area');
        this.warningFullScreenElement = document.getElementById('warning-full-screen');
        this.warningFullScreenId = null;
        this.externalEnergy = document.getElementById('external-energy');
        this.imageExternal = document.getElementById('image-external');
        this.dangerButton = document.getElementById('danger-emergency');
    }

    warningDisplayArea = (time) => {
        if (time < 20000) {
            this.displayArea.forEach(element => {
                element.classList.add('display-area-red');
            });
        }
    }

    warningInputArea = (time) => {
        if (time < 20000) {
            this.myInputTimer.inputMinutes.classList.add('border-bottom-red');
            this.myInputTimer.inputSeconds.classList.add('border-bottom-red');
        }
    }

    warningBackground = (time) => {
        if (time < 20000) {
            document.body.classList.remove('background-gradient');
            document.body.classList.add('background-red');
        }
    }

    warningFullScreen = (time) => {
        if (this.warningFullScreenId == null) {
            if (time < 20000 && time > 15000) {
                this.warningFullScreenElement.classList.remove('hidden-status');
                this.warningFullScreenId = setInterval(() => {
                    if (this.warningFullScreenElement.classList.contains('fade-out-effect')) { // show
                        this.warningFullScreenElement.classList.add('fade-in-effect');
                        this.warningFullScreenElement.classList.remove('fade-out-effect');
                    } else { // hide
                        this.warningFullScreenElement.classList.remove('fade-in-effect');
                        this.warningFullScreenElement.classList.add('fade-out-effect');
                    }
                }, 500);
            }
        } else if (time < 15000) {
            clearInterval(this.warningFullScreenId);
            this.warningFullScreenId = null;
            this.warningFullScreenElement.classList.add('hidden-status');
        }
    }

    warningExternalEnergy = (time) => {
        if (time < 20000) {
            this.externalEnergy.classList.add('hide-border');
            this.imageExternal.classList.add('hidden-status');
        }
    }

    warningDangerButton = (time) => {
        if (time < 20000) {
            this.dangerButton.classList.remove('hidden-status');
        }
    }

    clearWarningExternal = () => {
        this.externalEnergy.classList.add('hidden-status');
    }
}

class MyWarning15Sec {
    constructor() {
        this.mainEnergy = document.getElementById('main-energy');
        this.mainEnergyId = null;
    }

    warningMainEnergy = (time) => {
        if (this.mainEnergyId == null) {
            if (time < 15000 || time == null) {
                this.mainEnergyId = setInterval(() => {
                    if (this.mainEnergy.classList.contains('hidden-status')) {
                        this.mainEnergy.classList.remove('hidden-status');
                    } else {
                        this.mainEnergy.classList.add('hidden-status');
                    }
                }, 150);
            }
        }
    }

    clearWarningMainEnergy = () => {
        clearInterval(this.mainEnergyId);
        this.mainEnergyId = null;
        this.mainEnergy.classList.remove('hidden-status');
    }
}

class MyWarningTimeout {
    constructor() {
        this.myWarning20Sec = new MyWarning20Sec();
        this.myInputTimer = new MyInputTimer();

        this.internalEnergy = document.getElementById('internal-energy');
        this.internalId = null;
        this.dangerButtonId = null;

        this.startButton = document.getElementById('start-button');
        this.stopButton = document.getElementById('stop-button');
        this.countdownButton = document.getElementById('countdown-button');

        this.remainingLabelJp = document.getElementById('remaining-label-jp');
        this.remainingLabelEn = document.getElementById('remaining-label-en');
        this.afterLabelJp = document.getElementById('after-label-jp');
        this.remainJpId = null;
        this.remainEnId = null;
        this.afterJpId = null;
        this.timeDisplay = document.getElementById('time-display');
    }

    warningInternalEnergy = () => {
        this.internalId = setInterval(() => {
            if (this.internalEnergy.classList.contains('hidden-status')) {
                this.internalEnergy.classList.remove('hidden-status');
            } else {
                this.internalEnergy.classList.add('hidden-status');
            }
        }, 150);

        setTimeout(() => {
            clearTimeout(this.internalId);
            this.internalId = null;
            this.internalEnergy.classList.add('hidden-status');
        }, 5000);
    }

    warningDangerButton = () => {
        this.dangerButtonId = setInterval(() => {
            if (this.myWarning20Sec.dangerButton.classList.contains('hidden-status')) {
                this.myWarning20Sec.dangerButton.classList.remove('hidden-status');
            } else {
                this.myWarning20Sec.dangerButton.classList.add('hidden-status');
            }
        }, 150);

        setTimeout(() => {
            clearInterval(this.dangerButtonId);
            this.dangerButtonId = null;
            this.myWarning20Sec.dangerButton.classList.add('hidden-status');
        }, 4000);
    }

    disableStartBtn = () => {
        this.startButton.disabled = true;
        this.startButton.classList.add('disabled-button');
    }

    disableCountdownBtn = () => {
        this.countdownButton.disabled = true;
        this.countdownButton.classList.add('disabled-button');
    }

    warningRemainJp = () => {
        this.remainJpId = setInterval(() => {
            if (this.remainingLabelJp.classList.contains('hidden-status')) {
                this.remainingLabelJp.classList.remove('hidden-status');
            } else {
                this.remainingLabelJp.classList.add('hidden-status');
            }
        }, 150);

        setTimeout(() => {
            clearInterval(this.remainJpId);
            this.remainJpId = null;
            this.remainingLabelJp.classList.add('hidden-status');
        }, 7000);

    }

    warningRemainEn = () => {
        this.remainEnId = setInterval(() => {
            if (this.remainingLabelEn.classList.contains('hidden-status')) {
                this.remainingLabelEn.classList.remove('hidden-status');
            } else {
                this.remainingLabelEn.classList.add('hidden-status');
            }
        }, 150);

        setTimeout(() => {
            clearInterval(this.remainEnId);
            this.remainEnId = null;
            this.remainingLabelEn.classList.add('hidden-status');
        }, 7000);
    }

    warningAfterJp = () => {
        this.afterJpId = setInterval(() => {
            if (this.afterLabelJp.classList.contains('hidden-status')) {
                this.afterLabelJp.classList.remove('hidden-status');
            } else {
                this.afterLabelJp.classList.add('hidden-status');
            }
        }, 150);

        setTimeout(() => {
            clearInterval(this.afterJpId);
            this.afterJpId = null;
            this.afterLabelJp.classList.add('hidden-status');


        }, 7000);
    }

    clearInputTimer = () => {
        setTimeout(() => {
            this.myInputTimer.inputMinutes.classList.add('hidden-status');
            this.myInputTimer.inputSeconds.classList.add('hidden-status');
        }, 7000);

    }

    clearTimeDisplay = () => {
        setTimeout(() => {
            this.timeDisplay.classList.add('text-color-black');
        }, 7500);
    }

    disableStopBtn = () => {
        setTimeout(() => {
            this.stopButton.disabled = true;
            this.stopButton.classList.add('disabled-button');
        }, 8000);

    }
}

class MyTimer {
    constructor() {
        this.myInputTimer = new MyInputTimer();
        this.myCurrentTime = new MyCurrentTime();
        this.myTimerUi = new MyTimerUi();
        this.myWarning20Sec = new MyWarning20Sec();
        this.myWarning15Sec = new MyWarning15Sec();
        this.myWarningTimeout = new MyWarningTimeout();

        this.startButton = document.getElementById('start-button');
        this.stopButton = document.getElementById('stop-button');
        this.countdownButton = document.getElementById('countdown-button');
        this.resetButton = document.getElementById('reset-button');

        this.timerId = null;
        this.remainingTime = 0;
        this.startTime = 0;
        this.isCountdown = true;

        this.startButton.addEventListener('click', () => {
            this.startAction();
        });

        this.stopButton.addEventListener('click', () => {
            this.stopActon();
        });

        this.resetButton.addEventListener('click', () => {
            this.resetAction();
        });

        this.countdownButton.addEventListener('click', () => {
            this.countDownAction();
        });
    }

    startCountdown = () => {
        this.timerId = requestAnimationFrame(() => {
            const now = Date.now();
            this.remainingTime -= now - this.startTime;
            this.startTime = now;

            if (this.remainingTime > 0) {
                this.myWarning20Sec.warningDisplayArea(this.remainingTime);
                this.myWarning20Sec.warningInputArea(this.remainingTime);
                this.myWarning20Sec.warningBackground(this.remainingTime);
                this.myWarning20Sec.warningFullScreen(this.remainingTime);
                this.myWarning20Sec.warningExternalEnergy(this.remainingTime);
                this.myWarning20Sec.warningDangerButton(this.remainingTime);
                this.myWarning15Sec.warningMainEnergy(this.remainingTime);
                this.startCountdown();
            } else {
                this.remainingTime = 0;
                this.myWarning15Sec.clearWarningMainEnergy();
                this.myWarning15Sec.warningMainEnergy();
                this.myWarningTimeout.warningInternalEnergy();
                this.myWarningTimeout.warningDangerButton();
                this.myWarningTimeout.warningRemainJp();
                this.myWarningTimeout.warningRemainEn();
                this.myWarningTimeout.warningAfterJp();

                this.myWarningTimeout.disableStartBtn();
                this.myWarningTimeout.disableCountdownBtn();
                this.myWarningTimeout.disableStopBtn();
                setTimeout(() => {
                    this.myWarning20Sec.clearWarningExternal();
                }, 3000);

                setTimeout(() => {
                    this.myWarning15Sec.clearWarningMainEnergy();
                    this.myWarning15Sec.mainEnergy.classList.add('hidden-status');
                }, 6000);
                this.myWarningTimeout.clearInputTimer();
                this.myWarningTimeout.clearTimeDisplay();

            }
            this.myTimerUi.updateTimeText(this.remainingTime);
        });
    }

    startCountup = () => {
        this.timerId = requestAnimationFrame(() => {
            const now = Date.now();
            this.remainingTime += now - this.startTime;
            this.startTime = now;
            const remainingTimeCountup = this.myInputTimer.getTotalTime() - this.remainingTime;

            if (this.remainingTime < this.myInputTimer.getTotalTime()) {
                this.myWarning20Sec.warningDisplayArea(remainingTimeCountup);
                this.myWarning20Sec.warningInputArea(remainingTimeCountup);
                this.myWarning20Sec.warningBackground(remainingTimeCountup);
                this.myWarning20Sec.warningFullScreen(remainingTimeCountup);
                this.myWarning20Sec.warningExternalEnergy(remainingTimeCountup);
                this.myWarning20Sec.warningDangerButton(remainingTimeCountup);
                this.myWarning15Sec.warningMainEnergy(remainingTimeCountup);

                this.startCountup();
            } else {
                this.remainingTime = this.myInputTimer.getTotalTime();
                this.myWarning15Sec.clearWarningMainEnergy();
                this.myWarning15Sec.warningMainEnergy();
                this.myWarningTimeout.warningInternalEnergy();
                this.myWarningTimeout.warningDangerButton();
                this.myWarningTimeout.warningRemainJp();
                this.myWarningTimeout.warningRemainEn();
                this.myWarningTimeout.warningAfterJp();

                this.myWarningTimeout.disableStartBtn();
                this.myWarningTimeout.disableCountdownBtn();
                this.myWarningTimeout.disableStopBtn();
                setTimeout(() => {
                    this.myWarning20Sec.clearWarningExternal();
                }, 3000);
                setTimeout(() => {
                    this.myWarning15Sec.clearWarningMainEnergy();
                    this.myWarning15Sec.mainEnergy.classList.add('hidden-status');
                }, 6000);
                this.myWarningTimeout.clearInputTimer();
                this.myWarningTimeout.clearTimeDisplay();

            }
            this.myTimerUi.updateTimeText(this.remainingTime);
        });
    }

    startAction = () => {
        if (this.timerId != null || this.myInputTimer.getTotalTime() == 0) {
            return;
        } else {
            if (this.isCountdown) {
                if (this.timerId == null && this.remainingTime == 0) {
                    this.remainingTime = this.myInputTimer.getTotalTime();
                }
                this.startTime = Date.now();
                this.startCountdown();
            } else {
                this.startTime = Date.now();
                this.startCountup();
            }
            this.myTimerUi.startBtnClick();
        }
    }

    stopActon = () => {
        if (this.timerId == null) return;
        cancelAnimationFrame(this.timerId);
        this.timerId = null;
        this.myTimerUi.stopBtnClick();
    }

    countDownAction = () => {
        if (this.remainingTime != 0) {
            return;
        }
        if (this.isCountdown) {
            this.isCountdown = false;
        } else {
            this.isCountdown = true;
        }
        this.myTimerUi.countdownBtnClick(this.isCountdown);
    }

    resetAction = () => {
        history.go(0);
    }
}