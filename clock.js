// JavaScript for the SVG Clock

const clock = document.getElementById('clock');
const svgNS = "http://www.w3.org/2000/svg";

// Define clock dimensions globally within the script
const centerX = 200; // SVG width / 2
const centerY = 200; // SVG height / 2
const radius = 180;  // Radius of the clock face

// Style definitions for hands
const handStyles = {
    hour: {
        lengthRatio: 0.5, // 50% of radius
        width: 8,
        color: 'black',
        id: 'hour-hand'
    },
    minute: {
        lengthRatio: 0.75, // 75% of radius
        width: 5,
        color: 'black',
        id: 'minute-hand'
    },
    second: {
        lengthRatio: 0.9, // 90% of radius
        width: 2,
        color: 'red',
        id: 'second-hand'
    }
};

function drawClockFace() {
    // 1. Draw the main circular clock face
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', centerX);
    circle.setAttribute('cy', centerY);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', '#f0f0f0');
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '4');
    clock.appendChild(circle);

    // 2. Draw ticks and numbers
    for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * 360 - 90;
        const isHourMark = i % 5 === 0;
        const tickLength = isHourMark ? 15 : 8;
        const tickWidth = isHourMark ? 3 : 1;
        const tickColor = '#333';

        const x1 = centerX + (radius - tickLength) * Math.cos(angle * Math.PI / 180);
        const y1 = centerY + (radius - tickLength) * Math.sin(angle * Math.PI / 180);
        const x2 = centerX + radius * Math.cos(angle * Math.PI / 180);
        const y2 = centerY + radius * Math.sin(angle * Math.PI / 180);

        const tick = document.createElementNS(svgNS, 'line');
        tick.setAttribute('x1', x1);
        tick.setAttribute('y1', y1);
        tick.setAttribute('x2', x2);
        tick.setAttribute('y2', y2);
        tick.setAttribute('stroke', tickColor);
        tick.setAttribute('stroke-width', tickWidth);
        clock.appendChild(tick);

        if (isHourMark) {
            const hour = i / 5 === 0 ? 12 : i / 5;
            const numRadius = radius - 35;
            const numX = centerX + numRadius * Math.cos(angle * Math.PI / 180);
            const numY = centerY + numRadius * Math.sin(angle * Math.PI / 180);

            const text = document.createElementNS(svgNS, 'text');
            text.setAttribute('x', numX);
            text.setAttribute('y', numY);
            text.setAttribute('fill', '#000');
            text.setAttribute('font-size', '20');
            text.setAttribute('font-family', 'Arial, sans-serif');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.textContent = hour.toString();
            clock.appendChild(text);
        }
    }
}

function drawHand(cx, cy, length, style) {
    const hand = document.createElementNS(svgNS, 'line');
    hand.setAttribute('id', style.id);
    hand.setAttribute('x1', cx);
    hand.setAttribute('y1', cy);
    hand.setAttribute('x2', cx); // Initial position: pointing to 12 o'clock
    hand.setAttribute('y2', cy - length);
    hand.setAttribute('stroke', style.color);
    hand.setAttribute('stroke-width', style.width);
    hand.setAttribute('stroke-linecap', 'round');
    clock.appendChild(hand);
    return hand;
}

function drawHourHand(cx, cy, r) {
    const style = handStyles.hour;
    return drawHand(cx, cy, r * style.lengthRatio, style);
}

function drawMinuteHand(cx, cy, r) {
    const style = handStyles.minute;
    return drawHand(cx, cy, r * style.lengthRatio, style);
}

function drawSecondHand(cx, cy, r) {
    const style = handStyles.second;
    return drawHand(cx, cy, r * style.lengthRatio, style);
}

function drawHands() {
    drawHourHand(centerX, centerY, radius);
    drawMinuteHand(centerX, centerY, radius);
    drawSecondHand(centerX, centerY, radius);

    const centralCap = document.createElementNS(svgNS, 'circle');
    centralCap.setAttribute('cx', centerX);
    centralCap.setAttribute('cy', centerY);
    centralCap.setAttribute('r', '5');
    centralCap.setAttribute('fill', 'black');
    centralCap.setAttribute('stroke', '#555');
    centralCap.setAttribute('stroke-width', '1');
    clock.appendChild(centralCap);
}

// 1. Create an updateClock() function
function updateClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // Calculate rotation angles (hands initially point to 12, so -90 deg offset)
    const secondAngle = (seconds / 60) * 360 - 90;
    const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * (360 / 60) - 90;
    // const minuteAngle = ((minutes * 60 + seconds) / 3600) * 360 - 90; // Alternative for minutes
    const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * (360 / 12) - 90;
    // const hourAngle = (((hours % 12) * 3600 + minutes * 60 + seconds) / (12 * 3600)) * 360 - 90; // Alternative for hours


    // Get references to hand elements
    const hourHand = document.getElementById(handStyles.hour.id);
    const minuteHand = document.getElementById(handStyles.minute.id);
    const secondHand = document.getElementById(handStyles.second.id);

    // Apply rotation using transform attribute
    if (hourHand) {
        hourHand.setAttribute('transform', `rotate(${hourAngle}, ${centerX}, ${centerY})`);
    }
    if (minuteHand) {
        minuteHand.setAttribute('transform', `rotate(${minuteAngle}, ${centerX}, ${centerY})`);
    }
    if (secondHand) {
        secondHand.setAttribute('transform', `rotate(${secondAngle}, ${centerX}, ${centerY})`);
    }
}

// Main execution flow
if (clock) {
    drawClockFace();
    drawHands();

    // 3. Call updateClock() once initially
    updateClock();

    // 2. Use setInterval to call updateClock every second
    setInterval(updateClock, 1000);
} else {
    console.error("SVG element with id 'clock' not found.");
}
