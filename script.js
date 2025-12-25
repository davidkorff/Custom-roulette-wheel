// Messages for each number (1-25)
const messages = {
    1: "You keep our house from turning into chaos with your constant tidying, every day.",
    2: "When I work late, you just handle the kids without making me feel guiltay 💕",
    3: "You're the best bed time putter downer. Insubordination goes away!",
    4: 'When I say I want a massage, "go get one" you say. 💆',
    5: "You produce life healing magic milk (stop sneaking it into MY food) from your tittay 🍼",
    6: "You pump even though it looks miserable, because you do what's best for our weway 💪",
    7: "You buy gifts in advance (like a responsible adult) and actually pack them up for all kids birthday 🎁",
    8: "You packed and traveled with three kids just to spend time (in a tropical paradise) with MY family far away. 🌴",
    9: "You rolled full outfits together for the kids on Aruba so my special eyes could find them without delay. 👀",
    10: "You're the best stroller optimizer. Making sure we NEVER have to use an improper stroller—no way. 🚼",
    11: "Your impressions are amazing, like a pro on Broadway. 🎭",
    12: "Eat that? You couldn't possiblay! 🍽️",
    13: "You're in tune with our kids' emotions—like you read what they can't say. 💗",
    14: "You're always trying to save us monay 💰",
    15: "You make amazing meals Carb! Protein! Vegetablay! 🥗",
    16: "BUTTHOLE KISSES—still make me happay. 😘",
    17: "You manage the kids' clothing rotation like a warehouse worker. Everything in perfect array. 👕",
    18: "You stay on top of school stuff and the million moving parts that come with it without delay. 📚",
    19: "You keep our family calendar current so we don't miss what matters every day. 📅",
    20: "You track family commitments like my nieces/nephews birthday 🎂",
    21: "You handle travel toiletries and all the annoying little bits we need when away. 🧳",
    22: "You're the funniest person I know. There. I said it. Okay? 😂",
    23: "You're my boy Yuggay 💙",
    24: "I love your eyes. 👁️💖👁️",
    25: "You take on my kid-responsibilities when I'm too busay 🦸‍♀️"
};

// Red numbers (like in real roulette, adapted for 1-25)
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25];

const wheel = document.getElementById('wheel');
const ball = document.getElementById('ball');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');
const resultNumber = document.getElementById('resultNumber');
const resultMessage = document.getElementById('resultMessage');
const overlay = document.getElementById('overlay');
const closeResult = document.getElementById('closeResult');
const audioContainer = document.getElementById('audioContainer');

let currentRotation = 0;
let isSpinning = false;
const totalNumbers = 25;
const segmentAngle = 360 / totalNumbers;

// Create wheel segments
function createWheel() {
    for (let i = 0; i < totalNumbers; i++) {
        const num = i + 1;
        const isRed = redNumbers.includes(num);

        const segment = document.createElement('div');
        segment.className = 'wheel-segment';

        // Position each segment
        const rotation = i * segmentAngle - 90;
        segment.style.transform = `rotate(${rotation}deg) skewY(${90 - segmentAngle}deg)`;

        // Color background
        const colorDiv = document.createElement('div');
        colorDiv.className = 'segment-color';
        colorDiv.style.backgroundColor = isRed ? '#c41e3a' : '#1a1a1a';
        segment.appendChild(colorDiv);

        // Number label
        const numberSpan = document.createElement('span');
        numberSpan.className = 'segment-number';
        numberSpan.textContent = num;
        numberSpan.style.transform = `skewY(${-(90 - segmentAngle)}deg) rotate(${segmentAngle / 2}deg)`;
        segment.appendChild(numberSpan);

        wheel.appendChild(segment);
    }

    // Create gold dividers between segments
    const dividersContainer = document.getElementById('dividers');
    for (let i = 0; i < totalNumbers; i++) {
        const divider = document.createElement('div');
        divider.className = 'segment-divider';
        divider.style.transform = `rotate(${i * segmentAngle}deg)`;
        dividersContainer.appendChild(divider);
    }
}

// Create audio elements
function createAudioElements() {
    for (let i = 1; i <= totalNumbers; i++) {
        const audio = document.createElement('audio');
        audio.id = `audio-${i}`;
        audio.src = `audio/${i}.mp3`;
        audio.preload = 'auto';
        audioContainer.appendChild(audio);
    }
}

// Play audio for a specific number
function playAudio(number) {
    const audio = document.getElementById(`audio-${number}`);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log('Audio not yet available for number:', number);
        });
    }
}

// Animate the ball
function animateBall(winningNumber, duration) {
    const wheelContainer = document.querySelector('.wheel-container');
    const containerRect = wheelContainer.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    ball.classList.add('visible');

    // Ball starts on the outer edge and spirals inward
    let startTime = null;
    const outerRadius = 155;
    const innerRadius = 120;
    const totalSpins = 8;

    // Calculate final angle for the winning number
    const finalAngle = ((winningNumber - 1) * segmentAngle + segmentAngle / 2) * (Math.PI / 180);

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for natural deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);

        // Current angle (ball spins opposite to wheel)
        const currentSpins = totalSpins * (1 - easeOut);
        const angle = currentSpins * Math.PI * 2 + finalAngle;

        // Spiral inward as it slows
        const currentRadius = outerRadius - (outerRadius - innerRadius) * easeOut;

        // Add some wobble near the end
        const wobble = progress > 0.7 ? Math.sin(progress * 50) * (1 - progress) * 5 : 0;

        const x = centerX + Math.sin(angle) * (currentRadius + wobble) - 8;
        const y = centerY - Math.cos(angle) * (currentRadius + wobble) - 8;

        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Create confetti effect
function createConfetti() {
    const confettiColors = ['#ffd700', '#c41e3a', '#ffffff', '#c9a227', '#8B5A2B'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Spin the wheel
function spin() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;
    ball.classList.remove('visible');

    // Random number between 1-25
    const winningNumber = Math.floor(Math.random() * totalNumbers) + 1;

    // Calculate the rotation needed
    const targetAngle = (winningNumber - 1) * segmentAngle + (segmentAngle / 2);

    // Spin multiple full rotations plus the target angle
    const fullRotations = 5 + Math.floor(Math.random() * 3);
    const totalRotation = fullRotations * 360 + (360 - targetAngle) + 90;

    currentRotation += totalRotation;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // Animate the ball
    const spinDuration = 5000;
    animateBall(winningNumber, spinDuration);

    // Show result after spin completes
    setTimeout(() => {
        showResult(winningNumber);
        isSpinning = false;
        spinBtn.disabled = false;
    }, spinDuration + 200);
}

// Show the result popup
function showResult(number) {
    const isRed = redNumbers.includes(number);
    resultNumber.textContent = number;
    resultNumber.className = 'result-number ' + (isRed ? 'red' : 'black');
    resultMessage.textContent = messages[number];
    overlay.classList.remove('hidden');
    resultDiv.classList.remove('hidden');

    // Play audio
    playAudio(number);

    // Create confetti
    createConfetti();
}

// Hide result and reset
function hideResult() {
    overlay.classList.add('hidden');
    resultDiv.classList.add('hidden');
    ball.classList.remove('visible');

    // Stop any playing audio
    for (let i = 1; i <= totalNumbers; i++) {
        const audio = document.getElementById(`audio-${i}`);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
}

// Event listeners
spinBtn.addEventListener('click', spin);
closeResult.addEventListener('click', hideResult);
overlay.addEventListener('click', hideResult);

// Initialize
createWheel();
createAudioElements();
