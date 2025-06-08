// JavaScript for the SVG Clock

const clock = document.getElementById('clock');
const svgNS = "http://www.w3.org/2000/svg";
const toggleButton = document.getElementById('darkModeToggle');
const body = document.body;

// Define clock dimensions globally
const centerX = 200;
const centerY = 200;
const radius = 180;

// Define color palettes
const themes = {
    light: {
        faceColor: '#f0f0f0',
        borderColor: '#333',
        tickColor: '#333',
        hourNumberColor: '#000',
        hourHandColor: 'black',
        minuteHandColor: 'black',
        secondHandColor: 'red',
        capColor: 'black',
        // CSS handles body/button colors via .dark-mode class
    },
    dark: {
        faceColor: '#404040',
        borderColor: '#c0c0c0',
        tickColor: '#c0c0c0',
        hourNumberColor: '#e0e0e0',
        hourHandColor: '#d0d0d0',
        minuteHandColor: '#d0d0d0',
        secondHandColor: '#ff6666', // Lighter red for visibility
        capColor: '#d0d0d0',
    }
};

let isDarkMode = false; // Default to light mode

// Hand styles are now dynamic based on theme, store only structure here
const handStructure = {
    hour: { lengthRatio: 0.5, width: 8, id: 'hour-hand' },
    minute: { lengthRatio: 0.75, width: 5, id: 'minute-hand' },
    second: { lengthRatio: 0.9, width: 2, id: 'second-hand' }
};

function applyThemeColors() {
    const currentTheme = isDarkMode ? themes.dark : themes.light;
    body.classList.toggle('dark-mode', isDarkMode);

    const clockFace = document.getElementById('clock-face-circle');
    if (clockFace) {
        clockFace.setAttribute('fill', currentTheme.faceColor);
        clockFace.setAttribute('stroke', currentTheme.borderColor);
    }

    const ticks = clock.querySelectorAll('.tick');
    ticks.forEach(tick => tick.setAttribute('stroke', currentTheme.tickColor));

    const hourNumbers = clock.querySelectorAll('.hour-number');
    hourNumbers.forEach(num => num.setAttribute('fill', currentTheme.hourNumberColor));

    const hourHand = document.getElementById(handStructure.hour.id);
    if (hourHand) hourHand.setAttribute('stroke', currentTheme.hourHandColor);

    const minuteHand = document.getElementById(handStructure.minute.id);
    if (minuteHand) minuteHand.setAttribute('stroke', currentTheme.minuteHandColor);

    const secondHand = document.getElementById(handStructure.second.id);
    if (secondHand) secondHand.setAttribute('stroke', currentTheme.secondHandColor);

    const centralCap = document.getElementById('central-cap');
    if (centralCap) centralCap.setAttribute('fill', currentTheme.capColor);
}

function drawClockFace() {
    const currentTheme = isDarkMode ? themes.dark : themes.light;

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('id', 'clock-face-circle'); // ID for main circle
    circle.setAttribute('cx', centerX);
    circle.setAttribute('cy', centerY);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', currentTheme.faceColor);
    circle.setAttribute('stroke', currentTheme.borderColor);
    circle.setAttribute('stroke-width', '4');
    clock.appendChild(circle);

    for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * 360 - 90;
        const isHourMark = i % 5 === 0;
        const tickLength = isHourMark ? 15 : 8;
        const tickWidth = isHourMark ? 3 : 1;

        const x1 = centerX + (radius - tickLength) * Math.cos(angle * Math.PI / 180);
        const y1 = centerY + (radius - tickLength) * Math.sin(angle * Math.PI / 180);
        const x2 = centerX + radius * Math.cos(angle * Math.PI / 180);
        const y2 = centerY + radius * Math.sin(angle * Math.PI / 180);

        const tick = document.createElementNS(svgNS, 'line');
        tick.setAttribute('class', 'tick'); // Class for all ticks
        tick.setAttribute('x1', x1);
        tick.setAttribute('y1', y1);
        tick.setAttribute('x2', x2);
        tick.setAttribute('y2', y2);
        tick.setAttribute('stroke', currentTheme.tickColor);
        tick.setAttribute('stroke-width', tickWidth);
        clock.appendChild(tick);

        if (isHourMark) {
            const hour = i / 5 === 0 ? 12 : i / 5;
            const numRadius = radius - 35;
            const numX = centerX + numRadius * Math.cos(angle * Math.PI / 180);
            const numY = centerY + numRadius * Math.sin(angle * Math.PI / 180);

            const text = document.createElementNS(svgNS, 'text');
            text.setAttribute('class', 'hour-number'); // Class for hour numbers
            text.setAttribute('x', numX);
            text.setAttribute('y', numY);
            text.setAttribute('fill', currentTheme.hourNumberColor);
            text.setAttribute('font-size', '20');
            text.setAttribute('font-family', 'Arial, sans-serif');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.textContent = hour.toString();
            clock.appendChild(text);
        }
    }
}

function drawHand(cx, cy, length, style, color) { // Added color parameter
    const hand = document.createElementNS(svgNS, 'line');
    hand.setAttribute('id', style.id);
    hand.setAttribute('x1', cx);
    hand.setAttribute('y1', cy);
    hand.setAttribute('x2', cx);
    hand.setAttribute('y2', cy - length);
    hand.setAttribute('stroke', color); // Use themed color
    hand.setAttribute('stroke-width', style.width);
    hand.setAttribute('stroke-linecap', 'round');
    clock.appendChild(hand);
    return hand;
}

function drawHourHand(cx, cy, r, color) {
    const style = handStructure.hour;
    return drawHand(cx, cy, r * style.lengthRatio, style, color);
}

function drawMinuteHand(cx, cy, r, color) {
    const style = handStructure.minute;
    return drawHand(cx, cy, r * style.lengthRatio, style, color);
}

function drawSecondHand(cx, cy, r, color) {
    const style = handStructure.second;
    return drawHand(cx, cy, r * style.lengthRatio, style, color);
}

function drawHands() {
    const currentTheme = isDarkMode ? themes.dark : themes.light;

    drawHourHand(centerX, centerY, radius, currentTheme.hourHandColor);
    drawMinuteHand(centerX, centerY, radius, currentTheme.minuteHandColor);
    drawSecondHand(centerX, centerY, radius, currentTheme.secondHandColor);

    const centralCap = document.createElementNS(svgNS, 'circle');
    centralCap.setAttribute('id', 'central-cap'); // ID for central cap
    centralCap.setAttribute('cx', centerX);
    centralCap.setAttribute('cy', centerY);
    centralCap.setAttribute('r', '5');
    centralCap.setAttribute('fill', currentTheme.capColor);
    centralCap.setAttribute('stroke', isDarkMode ? themes.dark.borderColor : themes.light.borderColor); // Match border color
    centralCap.setAttribute('stroke-width', '1');
    clock.appendChild(centralCap);
}

function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondAngle = (seconds / 60) * 360 - 90;
    const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * (360 / 60) - 90;
    const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * (360 / 12) - 90;

    const hourHandEl = document.getElementById(handStructure.hour.id);
    const minuteHandEl = document.getElementById(handStructure.minute.id);
    const secondHandEl = document.getElementById(handStructure.second.id);

    if (hourHandEl) hourHandEl.setAttribute('transform', `rotate(${hourAngle}, ${centerX}, ${centerY})`);
    if (minuteHandEl) minuteHandEl.setAttribute('transform', `rotate(${minuteAngle}, ${centerX}, ${centerY})`);
    if (secondHandEl) secondHandEl.setAttribute('transform', `rotate(${secondAngle}, ${centerX}, ${centerY})`);
}

// Event Listener for Toggle Button
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        applyThemeColors(); // Apply immediately, also redraws if needed by re-calling draw functions
                            // Current applyThemeColors directly updates attributes, which is more efficient.
    });
}

// Initial Theme Load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
    } else {
        isDarkMode = false; // Default to light, or if localStorage is null/invalid
    }
    // No need to call applyThemeColors() here, as drawing functions will use isDarkMode.
    // However, body class needs to be set.
    body.classList.toggle('dark-mode', isDarkMode);
}


// Main execution flow
if (clock) {
    loadTheme(); // 1. Load theme preference (sets isDarkMode and body class)
                // applyThemeColors() will be implicitly called by draw functions using currentTheme

    drawClockFace(); // 2. Draws face using loaded theme
    drawHands();     // 3. Draws hands using loaded theme

    // Initial call to set hand positions and apply colors explicitly after drawing
    applyThemeColors(); // This ensures all elements are correctly styled after initial draw using loaded theme.
                        // It's a bit redundant if draw functions already use themes but ensures consistency.

    updateClock();   // 4. Set initial hand positions
    setInterval(updateClock, 1000); // 5. Start clock updates
} else {
    console.error("SVG element with id 'clock' not found.");
}
