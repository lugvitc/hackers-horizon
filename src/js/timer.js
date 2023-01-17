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
setInterval(() => {
    const today = new Date();
    const timeLeft = eventDate.getTime() - today.getTime();
    const { secondsLeft, minutesLeft, hoursLeft, daysLeft } =
        msToTime(timeLeft);
    timer.innerHTML = `${daysLeft} days, ${hoursLeft} hours, ${minutesLeft} minutes, ${secondsLeft} seconds`;
}, 1000);
