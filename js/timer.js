const eventDate = new Date(2023, 1, 12, 9);

const msToTime = ms => {
    const s = Math.floor(ms / 1000);
    const secondsLeft = s % 60;
    const minutesLeft = Math.floor((s % (60 * 60)) / 60);
    const hoursLeft = Math.floor((s % (24 * 60 * 60)) / (60 * 60));
    const daysLeft = Math.floor(s / (24 * 60 * 60));
    return { secondsLeft, minutesLeft, hoursLeft, daysLeft };
};

const timer = id('timer');
const sec = id('seconds');
const min = id('minutes');
const hrs = id('hours');
const dys = id('days');

let prevTime;

setInterval(() => {
    const today = new Date();
    const timeLeft = eventDate.getTime() - today.getTime();
    const { secondsLeft, minutesLeft, hoursLeft, daysLeft } =
        msToTime(timeLeft);
    if (!prevTime) {
        sec.innerHTML = secondsLeft;
        min.innerHTML = minutesLeft;
        hrs.innerHTML = hoursLeft;
        dys.innerHTML = daysLeft;
    } else if (minutesLeft !== prevTime.minutesLeft) {
        min.innerHTML = minutesLeft;
    } else if (hoursLeft !== prevTime.hoursLeft) {
        hrs.innerHTML = hoursLeft;
    } else if (minutesLeft !== prevTime.minutesLeft) {
        dys.innerHTML = daysLeft;
    }
}, 1000);

