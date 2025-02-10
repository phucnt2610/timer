let remainingTime = null;
let totalTime = null;
let startTime = null;
let timerId = null;
let isCountdownTimer = true;
let mainEnergyId = null;
let emergencyFullScreenId = null
let effect20Sec = null;

let inputMinute = document.getElementById('input-minute');
let inputSecond = document.getElementById('input-second');
let displayArea = document.querySelectorAll('.display-area');
let dangerEmergency = document.getElementById('danger-emergency');
let externalEnergy = document.getElementById('external-energy');
let imageExternal = document.getElementById('image-external');
let mainEnergy = document.getElementById('main-energy');
let internalEnergy = document.getElementById('internal-energy');
let remainingLabelJp = document.getElementById('remaining-label-jp');
let remainingLabelEn = document.getElementById('remaining-label-en');
let afterLabelJp = document.getElementById('after-label-jp');
let timeDisplay = document.getElementById('time-display');
let emergencyFullScreen = document.getElementById('emergency-full-screen');

const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const stopButton = document.getElementById('stop-button');
const countdownButton = document.getElementById('countdown-button');
const divStartElements = startButton.querySelectorAll('div');
const divStopElements = stopButton.querySelectorAll('div');
const divCountdownElements = countdownButton.querySelectorAll('div');

const updateTimeText = (time) => {
    let m = Math.floor(time / 60000);
    let s = Math.floor((time % 60000) / 1000);
    let ms = Math.floor((time % 1000) / 1000 * 30);

    m = String(m).padStart(2, '0');
    s = String(s).padStart(2, '0');
    ms = String(ms).padStart(2, '0');

    setTimer(m, s, ms);
};

const setTimer = (m, s, ms) => {
    document.getElementById("current-minute").textContent = m;
    document.getElementById("current-second").textContent = s;
    document.getElementById("current-milisecond").textContent = ms;
};

const update = () => {
    timerId = requestAnimationFrame(() => {
        const now = Date.now();
        if (isCountdownTimer) {
            remainingTime -= now - startTime;
        } else {
            remainingTime += now - startTime;
        }
        startTime = now;
        let remainingTimeCountupto = totalTime - remainingTime;
        if ((remainingTime > 0 && isCountdownTimer) || (remainingTimeCountupto > 0 && !isCountdownTimer)) {
            if ((remainingTime < 20000 && remainingTime > 15000 && isCountdownTimer) ||
                (remainingTimeCountupto < 20000 && remainingTimeCountupto > 15000 && !isCountdownTimer)) {
                effect20Sec = true;
                changeColorAction();
                showDangerEmergency();
                showEmergencyFullScreen();
                showEffectExternal();
            } else if ((remainingTime < 15000 && isCountdownTimer) || (remainingTimeCountupto < 15000 && !isCountdownTimer)) {
                if (effect20Sec == null) {
                    changeColorAction();
                    showDangerEmergency();
                    showEffectExternal();
                }
                showAndHideMainEnergy();
            }
            update();
        } else {
            if (isCountdownTimer) {
                remainingTime = 0;
            } else {
                remainingTime = totalTime;
            }

            // effect time out
            disableStartBtn();
            disableCountdownBtn();
            disableStopBtn()
            showAndHideEffectTimeout();
            hideExternalEnergyAfter3Sec();
            hideTimeDisplay();
        }
        updateTimeText(remainingTime);
    });
};

const startAction = () => {
    if ((parseInt(inputMinute.value) || 0) == 0 && (parseInt(inputSecond.value) || 0) == 0) {
        return;
    } else {
        if (timerId !== null) {
            return;
        }
        startButton.disabled = true;
        if (remainingTime != 0) {
            startTime = Date.now();
        }
        divStartElements[1].classList.remove("section-below-title");
        divStopElements[1].classList.add("section-below-title");
        totalTime = ((parseInt(inputMinute.value) || 0) * 60 + (parseInt(inputSecond.value) || 0)) * 1000;
        if (isCountdownTimer && remainingTime == null) {
            remainingTime = totalTime;
        }
        update();
    }
};

const stopAction = () => {
    if (timerId === null) return;

    startButton.disabled = false;
    cancelAnimationFrame(timerId);
    timerId = null;
    divStopElements[1].classList.remove("section-below-title");
    divStartElements[1].classList.add("section-below-title");
};

const resetAction = () => {
    history.go(0);
};

const countDownAction = () => {
    if (timerId === null && startButton.disabled === false) {
        if (isCountdownTimer) {
            divCountdownElements[0].classList.add('section-below-title');
            divCountdownElements[1].classList.remove('section-below-title');
            isCountdownTimer = false;
        } else {
            divCountdownElements[0].classList.remove('section-below-title');
            divCountdownElements[1].classList.add('section-below-title');
            isCountdownTimer = true;
        }
    }
};

const showAndHideEffectTimeout = () => {
    clearEffectMainEnergy();
    showAndHideMainEnergy();
    showAndHideDangerEmergency();
    showAndHideInternalEnergy();
    showAndHideRemainingLabelJp();
    showAndHideRemainingLabelEn();
    showAndHideAfterLabelJp();
}

const changeColorAction = () => {
    // change color display area
    displayArea.forEach(element => {
        element.classList.add('display-area-red');
    });

    // change color input border bottom
    inputMinute.classList.add('border-bottom-red');
    inputSecond.classList.add('border-bottom-red');

    // change background color
    document.body.classList.remove('background-gradient');
    document.body.classList.add('background-red');
}

// Effect When Remaining Time Below 20s
const showDangerEmergency = () => {
    dangerEmergency.classList.remove('hidden-status');
}

const hideDangerEmergency = () => {
    dangerEmergency.classList.add('hidden-status');
}

const showEffectExternal = () => {
    externalEnergy.classList.add('hide-border');
    imageExternal.classList.add('hidden-status');
}

const showEmergencyFullScreen = () => {
    if (emergencyFullScreenId == null) {
        emergencyFullScreen.classList.remove('hidden-status');

        emergencyFullScreenId = setInterval(() => {
            if (emergencyFullScreen.classList.contains('fade-out-effect')) { // show
                emergencyFullScreen.classList.add('fade-in-effect');
                emergencyFullScreen.classList.remove('fade-out-effect');
            } else { // hide
                emergencyFullScreen.classList.remove('fade-in-effect');
                emergencyFullScreen.classList.add('fade-out-effect');
            }
        }, 500);

        setTimeout(() => {
            clearInterval(emergencyFullScreenId);
            emergencyFullScreen.classList.add('hidden-status');
            emergencyFullScreenId = null;
        }, 5000);
    }
}

// Effect When Remaining Time Below 15s
const showAndHideMainEnergy = () => {
    if (mainEnergyId == null) {
        mainEnergyId = setInterval(() => {
            if (mainEnergy.classList.contains('hidden-status')) {
                mainEnergy.classList.remove('hidden-status');
            } else {
                mainEnergy.classList.add('hidden-status');
            }
        }, 150);
        if (remainingTime == 0 || remainingTime == totalTime) {
            setTimeout(() => {
                clearInterval(mainEnergyId);
                mainEnergyId = null;
                mainEnergy.classList.add('hidden-status');
            }, 6000);
        }
    }
}

const clearEffectMainEnergy = () => {
    clearInterval(mainEnergyId);
    mainEnergyId = null;
    mainEnergy.classList.remove('hidden-status');
}

// Effect When Timeout
const disableStartBtn = () => {
    startButton.disabled = true;
    startButton.classList.add('disabled-button');
}
const disableCountdownBtn = () => {
    countdownButton.disabled = true;
    countdownButton.classList.add('disabled-button');
}

const hideExternalEnergyAfter3Sec = () => {
    setTimeout(() => {
        externalEnergy.classList.add('hidden-status');
    }, 3000);
}

const showExternalEnergy = () => {
    externalEnergy.classList.remove('hidden-status');
}

const showAndHideDangerEmergency = () => {
    let intervalId = setInterval(() => {
        if (dangerEmergency.classList.contains('hidden-status')) {
            dangerEmergency.classList.remove('hidden-status');
        } else {
            dangerEmergency.classList.add('hidden-status');
        }
    }, 150);

    setTimeout(() => {
        clearInterval(intervalId);
        dangerEmergency.classList.add('hidden-status');
    }, 4000);
}

const showAndHideInternalEnergy = () => {
    let intervalId = setInterval(() => {
        if (internalEnergy.classList.contains('hidden-status')) {
            internalEnergy.classList.remove('hidden-status');
        } else {
            internalEnergy.classList.add('hidden-status');
        }
    }, 150);

    setTimeout(() => {
        clearInterval(intervalId);
        dangerEmergency.classList.add('hidden-status');
    }, 5000);
}

const showAndHideRemainingLabelJp = () => {
    let intervalId = setInterval(() => {
        if (remainingLabelJp.classList.contains('hidden-status')) {
            remainingLabelJp.classList.remove('hidden-status');
        } else {
            remainingLabelJp.classList.add('hidden-status');
        }
    }, 150);

    setTimeout(() => {
        clearInterval(intervalId);
        remainingLabelJp.classList.add('hidden-status');
    }, 6500);
}

const showAndHideRemainingLabelEn = () => {
    let intervalId = setInterval(() => {
        if (remainingLabelEn.classList.contains('hidden-status')) {
            remainingLabelEn.classList.remove('hidden-status');
        } else {
            remainingLabelEn.classList.add('hidden-status');
        }
    }, 150);

    setTimeout(() => {
        clearInterval(intervalId);
        remainingLabelEn.classList.add('hidden-status');
    }, 6500);
}

const showAndHideAfterLabelJp = () => {
    let intervalId = setInterval(() => {
        if (afterLabelJp.classList.contains('hidden-status')) {
            afterLabelJp.classList.remove('hidden-status');
        } else {
            afterLabelJp.classList.add('hidden-status');
        }
    }, 150);

    setTimeout(() => {
        clearInterval(intervalId);
        afterLabelJp.classList.add('hidden-status');
        inputMinute.classList.add('hidden-status');
        inputSecond.classList.add('hidden-status');
    }, 6500);
}

const hideTimeDisplay = () => {
    setTimeout(() => {
        timeDisplay.classList.add('text-color-black');
    }, 7500);
}

const disableStopBtn = () => {
    setTimeout(() => {
        stopButton.disabled = true;
        stopButton.classList.add('disabled-button');
    }, 8000);
}

(
    () => {
        startButton.addEventListener("click", startAction);
        stopButton.addEventListener("click", stopAction);
        resetButton.addEventListener("click", resetAction);
        countdownButton.addEventListener('click', countDownAction);
    }
)();