let gregorianUses12Hours = false; // muahahahah

function calculateDiberianTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    let period;
    let startHour;

    if (hours >= 6 && hours < 18) {
        period = "OÐ"
        startHour = 6;
    } else {
        period = "ON";
        startHour = hours >= 18 ? 18 : 18; // unneccessary but im paranwoid
    }

    let elapsed;

    if (period === "OÐ") {
        elapsed = (hours - 6) * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds;
    } else {
        if (hours >= 18) {
            elapsed = (hours - 18) * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds;
        } else {
            elapsed = (hours + 6) * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds;
        }
    }

    const HALF_DAY_MILSEC = 12 * 60 * 60 * 1000;

    const STEPS = 10;
    const BEATS = 50;
    const TICKS = 50;

    const TICKS_PER_STEP = BEATS * TICKS;
    const TICKS_PER_HALF_DAY = STEPS * TICKS_PER_STEP;

    const totalTicks = Math.floor((elapsed / HALF_DAY_MILSEC) * TICKS_PER_HALF_DAY);

    const step = Math.floor(totalTicks / TICKS_PER_STEP);
    const remainder = totalTicks % TICKS_PER_STEP;

    const beat = Math.floor(remainder / TICKS);
    const tick = remainder % TICKS;

    return {
        step: String(step).padStart(2, "0"),
        beat: String(beat).padStart(2, "0"),
        tick: String(tick).padStart(2, "0"),
        period
    };
}

const DIBERIAN_YEAR_START = new Date(2026, 11, 21, 6, 0, 0, 0);

const DIBERIAN_ANCHOR_YEAR = 8389;

function isGregorianLeapYear(year) {
    return (
        year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    );
}

function isDiberianShiftYear(diberianYear) {
    const gregorianEndYear = 2026 + (diberianYear - DIBERIAN_ANCHOR_YEAR) + 1;

    return isGregorianLeapYear(gregorianEndYear);
}

function getDiberianYearStart(date) {
    const year = date.getFullYear();

    let candidate = new Date(year, 11, 21, 6, 0, 0, 0);

    if (date < candidate) {
        candidate = new Date(year - 1, 11, 21, 6, 0, 0, 0);
    }

    return candidate;
}

function calculateDiberianDate(date) {
    const yearStart = getDiberianYearStart(date);

    const elapsedMs = date.getTime() - yearStart.getTime();

    const dayIndex = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));

    const startGregorianYear = yearStart.getFullYear();

    const diberianYear = DIBERIAN_ANCHOR_YEAR + (startGregorianYear - 2026);

    const shiftYear = isDiberianShiftYear(diberianYear);

    let week;

    let day;

    if (shiftYear && dayIndex >= 72 * 5) {
        week = 73;

        day = dayIndex - (72 * 5) + 1;
    } else {
        week = Math.floor(dayIndex / 5) + 1;

        day = (dayIndex % 5) + 1;
    }

    const group = Math.floor(dayIndex / 25) + 1;

    return {
        day,
        week,
        year: diberianYear,
        group,
        shiftYear
    };
}

function updateGregorian(date) {
    const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: gregorianUses12Hours });

    const formattedDate = date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    document.getElementById("gregorian-time").textContent = time;

    document.getElementById("gregorian-date").textContent = formattedDate;

    // button

    const button = document.getElementById("time-format-toggle");

    if (gregorianUses12Hours) {
        button.textContent = "Can't read? (Dear Europeans?)";
    } else {
        button.textContent = "Can't read? (Dear Americans?)";
    }
}

function updateDiberian(date) {
    const diberian = calculateDiberianTime(date);

    const time = `${diberian.step}:` + `${String(diberian.beat).padStart(2, "0")}:` + `${String(diberian.tick).padStart(2, "0")}` + ` ${diberian.period}`;

    const calendar = calculateDiberianDate(date);

    document.getElementById("diberian-time").textContent = time;

    document.getElementById("diberian-date").textContent = `${calendar.day}.${String(calendar.week).padStart(2, "0")}.${calendar.year} - ${calendar.group}`;
}

document.getElementById("time-format-toggle").addEventListener("click", () => {
    gregorianUses12Hours = !gregorianUses12Hours;

    updateClock();
});

function updateClock() {
    const now = new Date();

    updateGregorian(now);

    updateDiberian(now);
}

updateClock();

setInterval(updateClock, 100);