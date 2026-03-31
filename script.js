document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content
            const targetTab = button.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

// --- Modal Gallery Logic ---
const projectImages = {
    kitchenMixer: [
        { src: 'images/Slide1.JPG', caption: 'Title Slide' },
        { src: 'images/Slide2.JPG', caption: 'Project Overview' },
        { src: 'images/Slide3.JPG', caption: 'Problem Statement' },
        { src: 'images/Slide4.JPG', caption: 'Concept Development' },
        { src: 'images/Slide5.JPG', caption: 'Selection Process' },
        { src: 'images/New_6.png', caption: 'Final Concept' },
        { src: 'images/Slide7.JPG', caption: 'Part Diagrams' },
        { src: 'images/Slide8.JPG', caption: 'Gear Train Details' },
        { src: 'images/New_9.png', caption: 'Motor Specifications' },
        { src: 'images/Slide10.JPG', caption: 'CAD Assembly' },
        { src: 'images/Slide11.JPG', caption: 'Exploded View' },
        { src: 'images/Slide12.JPG', caption: 'Budget & Costing' },
        { src: 'images/Slide13.JPG', caption: 'Engineering Standards' },
        { src: 'images/Slide14.JPG', caption: 'Societal Impact' },
        { src: 'images/Slide15.JPG', caption: 'Conclusion' }
    ]
};

let currentProject = '';
let currentSlideIndex = 0;

const modal = document.getElementById('project-modal');
const modalImg = document.getElementById('modal-img');
const captionText = document.getElementById('modal-caption');

function openModal(projectId) {
    currentProject = projectId;
    currentSlideIndex = 0;

    if (projectImages[projectId] && projectImages[projectId].length > 0) {
        updateModalContent();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    // Let fade transition finish before resetting text
    setTimeout(() => {
        modalImg.src = '';
        captionText.innerHTML = '';
    }, 300);
}

function changeSlide(direction) {
    const images = projectImages[currentProject];
    if (!images) return;

    currentSlideIndex += direction;

    // Loop around
    if (currentSlideIndex >= images.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = images.length - 1;
    }

    updateModalContent();
}

function updateModalContent() {
    const images = projectImages[currentProject];
    if (images && images[currentSlideIndex]) {
        modalImg.src = images[currentSlideIndex].src;
        captionText.innerHTML = `${images[currentSlideIndex].caption} (${currentSlideIndex + 1}/${images.length})`;
    }
}

// Close modal if user clicks outside the image container
modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.classList.contains('modal-gallery-container')) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function (event) {
    if (!modal.classList.contains('show')) return;

    if (event.key === 'Escape') {
        closeModal();
    } else if (event.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (event.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// --- Arduino Car Background Animation ---
(function () {
    const canvas = document.getElementById('bg-car-canvas');
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    });

    // Car state
    const car = {
        x: W * 0.5,
        y: H * 0.5,
        angle: Math.random() * Math.PI * 2,
        speed: 0.5,
        targetAngle: Math.random() * Math.PI * 2,
        changeDirTimer: 0,
        changeDirInterval: 150 + Math.random() * 200,
        wheelSpin: 0,
        stopped: false,
        stopTimer: 0,
        stopDuration: 6 * 60,   // ~6 seconds at 60 fps
        ledHue: 0,
    };

    function drawWheel(ctx, cx, cy, ww, wh, spin) {
        ctx.save();
        ctx.translate(cx, cy);
        // Tire
        ctx.fillStyle = '#1a1a1a';
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 0.5;
        ctx.fillRect(-ww / 2, -wh / 2, ww, wh);
        ctx.strokeRect(-ww / 2, -wh / 2, ww, wh);
        // Hub
        ctx.fillStyle = '#777';
        ctx.fillRect(-ww / 2 + 1.5, -wh / 2 + 2, ww - 3, wh - 4);
        // Tread lines (animate with spin)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 0.8;
        const nLines = 4;
        const spacing = wh / nLines;
        const offset = ((spin % spacing) + spacing) % spacing;
        for (let i = -1; i <= nLines + 1; i++) {
            const ry = -wh / 2 + i * spacing + offset;
            if (ry > -wh / 2 && ry < wh / 2) {
                ctx.beginPath();
                ctx.moveTo(-ww / 2, ry);
                ctx.lineTo(ww / 2, ry);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    function drawArduinoCar(ctx, x, y, angle, spin) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2); // face direction of travel

        const bw = 38, bh = 56;
        const ww = 10, wh = 18;
        const wx = bw / 2 + ww / 2 + 1;
        const wyF = bh / 2 - 10;
        const wyR = -(bh / 2 - 10);

        // Wheels (behind body)
        drawWheel(ctx, -wx, -wyF, ww, wh, spin);
        drawWheel(ctx, wx, -wyF, ww, wh, spin);
        drawWheel(ctx, -wx, -wyR, ww, wh, spin);
        drawWheel(ctx, wx, -wyR, ww, wh, spin);

        // Motor mounts
        ctx.fillStyle = '#555';
        ctx.fillRect(-bw / 2 - 2, -wyF - 3, 4, 6);
        ctx.fillRect(bw / 2 - 2, -wyF - 3, 4, 6);
        ctx.fillRect(-bw / 2 - 2, -wyR - 3, 4, 6);
        ctx.fillRect(bw / 2 - 2, -wyR - 3, 4, 6);

        // PCB chassis
        ctx.fillStyle = '#1d6a3a';
        ctx.strokeStyle = '#0e4022';
        ctx.lineWidth = 1;
        ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
        ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);

        // Mounting holes
        ctx.fillStyle = '#0e4022';
        const mhOff = 4, mhr = 2;
        [[-bw / 2 + mhOff, -bh / 2 + mhOff], [bw / 2 - mhOff, -bh / 2 + mhOff],
        [-bw / 2 + mhOff, bh / 2 - mhOff], [bw / 2 - mhOff, bh / 2 - mhOff]].forEach(([cx, cy]) => {
            ctx.beginPath(); ctx.arc(cx, cy, mhr, 0, Math.PI * 2); ctx.fill();
        });

        // Gold circuit traces
        ctx.strokeStyle = '#d4a017';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-bw / 2 + 8, -bh / 2 + 10); ctx.lineTo(bw / 2 - 8, -bh / 2 + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-bw / 2 + 8, bh / 2 - 10); ctx.lineTo(bw / 2 - 8, bh / 2 - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-10, -bh / 2 + 10); ctx.lineTo(-10, bh / 2 - 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(10, -bh / 2 + 10); ctx.lineTo(10, bh / 2 - 10); ctx.stroke();

        // L293D motor driver IC
        ctx.fillStyle = '#111';
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 0.5;
        ctx.fillRect(-9, 8, 18, 14);
        ctx.strokeRect(-9, 8, 18, 14);
        ctx.fillStyle = '#d4a017';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(-12, 9 + i * 3, 3, 1.5);
            ctx.fillRect(9, 9 + i * 3, 3, 1.5);
        }
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(-6, 11, 1.5, 0, Math.PI * 2); ctx.fill();

        // Arduino Nano (MCU)
        ctx.fillStyle = '#1a2a5e';
        ctx.strokeStyle = '#3050aa';
        ctx.lineWidth = 0.8;
        ctx.fillRect(-8, -16, 16, 22);
        ctx.strokeRect(-8, -16, 16, 22);
        ctx.strokeStyle = '#2a3a7e';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.moveTo(-8, -13 + i * 6); ctx.lineTo(8, -13 + i * 6); ctx.stroke();
        }
        ctx.fillStyle = '#d4a017';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(-10, -14 + i * 5, 2, 2);
            ctx.fillRect(8, -14 + i * 5, 2, 2);
        }

        // HC-05 Bluetooth module
        ctx.fillStyle = '#1a5bbf';
        ctx.strokeStyle = '#0d3a8a';
        ctx.lineWidth = 0.8;
        ctx.fillRect(-7, -bh / 2 + 13, 14, 9);
        ctx.strokeRect(-7, -bh / 2 + 13, 14, 9);
        ctx.fillStyle = '#a0c4ff';
        ctx.font = 'bold 4px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BT', 0, -bh / 2 + 20);
        ctx.textAlign = 'left';

        // LEDs — rainbow cycle when stopped, normal when driving
        if (car.stopped) {
            // Both LEDs cycle through hue together, with a slight offset
            const hue1 = car.ledHue;
            const hue2 = (car.ledHue + 120) % 360;
            const col1 = `hsl(${hue1},100%,55%)`;
            const col2 = `hsl(${hue2},100%,55%)`;

            ctx.fillStyle = col1;
            ctx.shadowColor = col1;
            ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(11, -bh / 2 + 14, 3, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = col2;
            ctx.shadowColor = col2;
            ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(11, -bh / 2 + 21, 3, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            // Green power LED
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 6;
            ctx.beginPath(); ctx.arc(11, -bh / 2 + 14, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Red TX LED (blinks)
            const blinkOn = (Math.floor(Date.now() / 350) % 2 === 0);
            ctx.fillStyle = blinkOn ? '#ff3344' : '#661122';
            ctx.shadowColor = '#ff3344';
            ctx.shadowBlur = blinkOn ? 7 : 0;
            ctx.beginPath(); ctx.arc(11, -bh / 2 + 21, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Capacitors
        ctx.fillStyle = '#2244bb';
        ctx.strokeStyle = '#112299';
        ctx.lineWidth = 0.5;
        ctx.fillRect(-bw / 2 + 5, 0, 6, 8); ctx.strokeRect(-bw / 2 + 5, 0, 6, 8);
        ctx.fillRect(-bw / 2 + 5, 11, 6, 8); ctx.strokeRect(-bw / 2 + 5, 11, 6, 8);
        ctx.fillStyle = '#6688ff';
        ctx.fillRect(-bw / 2 + 5, 0, 6, 2);
        ctx.fillRect(-bw / 2 + 5, 11, 6, 2);

        // Resistors
        [[bw / 2 - 11, 0, '#cc8833', '#aa2222', '#448822'],
        [bw / 2 - 11, 8, '#cc8833', '#448822', '#dd9900']].forEach(([rx, ry, c1, c2, c3]) => {
            ctx.fillStyle = '#ddd8b0'; ctx.fillRect(rx, ry, 10, 5);
            ctx.fillStyle = c1; ctx.fillRect(rx + 1, ry, 2, 5);
            ctx.fillStyle = c2; ctx.fillRect(rx + 4, ry, 2, 5);
            ctx.fillStyle = c3; ctx.fillRect(rx + 7, ry, 2, 5);
        });

        ctx.restore();
    }

    function updateCar() {
        // Handle stopped (clicked) state
        if (car.stopped) {
            car.stopTimer++;
            car.ledHue = (car.ledHue + 3) % 360; // full rainbow every ~2s
            if (car.stopTimer >= car.stopDuration) {
                car.stopped = false;
                car.stopTimer = 0;
            }
            return; // don't move
        }

        car.changeDirTimer++;
        if (car.changeDirTimer >= car.changeDirInterval) {
            car.changeDirTimer = 0;
            car.changeDirInterval = 120 + Math.random() * 250;
            // Nudge away from edges
            let nudge = 0;
            if (car.x < W * 0.12) nudge = 0.9;
            if (car.x > W * 0.88) nudge = -0.9;
            if (car.y < H * 0.12) nudge = 0.9;
            if (car.y > H * 0.88) nudge = -0.9;
            car.targetAngle = car.angle + nudge + (Math.random() - 0.5) * Math.PI * 1.3;
        }

        // Smooth steering
        let diff = car.targetAngle - car.angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        car.angle += diff * 0.025;

        car.x += Math.cos(car.angle) * car.speed;
        car.y += Math.sin(car.angle) * car.speed;

        // Wrap around screen edges
        const pad = 60;
        if (car.x < -pad) car.x = W + pad;
        if (car.x > W + pad) car.x = -pad;
        if (car.y < -pad) car.y = H + pad;
        if (car.y > H + pad) car.y = -pad;

        car.wheelSpin += car.speed * 0.18;
    }

    // Click hit-test: document listener so canvas stays pointer-events:none
    document.addEventListener('click', (e) => {
        const dx = e.clientX - car.x;
        const dy = e.clientY - car.y;
        if (Math.sqrt(dx * dx + dy * dy) < 38) { // ~hit radius
            car.stopped = true;
            car.stopTimer = 0;
            car.ledHue = 0;
        }
    });

    function animate() {
        ctx.clearRect(0, 0, W, H);
        updateCar();
        ctx.globalAlpha = 0.28;
        drawArduinoCar(ctx, car.x, car.y, car.angle, car.wheelSpin);
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    animate();
})();

