/* Prepare canvas */
// const viewportWidth = window.innerWidth;
const container = document.querySelector('.container');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const buttonTriangle = document.querySelector('.game__button-triangle');
const buttonCircle = document.querySelector('.game__button-circle');
// const buttonStar = document.querySelector('.game__button-star');
const buttonUmbrella = document.querySelector('.game__button-umbrella');
const gameStart = document.querySelector('.game');
const score = document.querySelector('.score');
const restart = document.querySelector('.restart');
const winnerLoserModal = document.querySelector('.modalWinnerLoser');
const winnerLoserModalh2 = document.querySelector('.modalWinnerLoser h2');

let mouseDown = false;
let startedTurn = false;
let brokeShape = false;
let prevX = null;
let prevY = null;
let pixelsShape = 0;

/* Set up the size and line styles of the canvas */
function setupCanvas() {
    canvas.height = 370;
    canvas.width = 370;
    // canvas.style.width = `${canvas.width}px`;
    // canvas.style.height = `${canvas.height}px`;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
}


/* Event handlers for shape buttons */
buttonTriangle.addEventListener('click', drawTriangle);
buttonCircle.addEventListener('click', drawCircle);
// buttonStar.addEventListener('click', drawStar);
buttonUmbrella.addEventListener('click', drawUmbrella);

/* Triangle shape */
function drawTriangle() {
    gameStart.classList.add('hidden');
    ctx.strokeStyle = 'rgb(66, 10, 0)';
    ctx.beginPath();
    ctx.moveTo(185, 85);
    ctx.lineTo(285, 260);
    ctx.lineTo(85, 260);
    ctx.closePath();
    ctx.stroke();
    /* Get pixels of shape */
    pixelsShape = getPixelAmount(66, 10, 0);
}

/* Circle shape */
function drawCircle() {
    gameStart.classList.add('hidden');
    ctx.strokeStyle = 'rgb(66, 10, 0)';
    ctx.beginPath();
    ctx.arc(185, 185, 100, 0 * Math.PI, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    /* Get pixels of shape */
    pixelsShape = getPixelAmount(66, 10, 0);
}

// /* Star shape */
// function drawStar() {
//     gameStart.classList.add('hidden');
//     ctx.strokeStyle = 'rgb(66, 10, 0)';

//     let rot = Math.PI / 2 * 3;
//     let x = 185;
//     let y = 185;
//     let cx = 185;
//     let cy = 185;
//     const spikes = 5;
//     const outerRadius = 120;
//     const innerRadius = 60;
//     const step = Math.PI / 5;

//     ctx.strokeSyle = "#000";
//     ctx.beginPath();
//     ctx.moveTo(cx, cy - outerRadius)
//     for (i = 0; i < spikes; i++) {
//         x = cx + Math.cos(rot) * outerRadius;
//         y = cy + Math.sin(rot) * outerRadius;
//         ctx.lineTo(x, y)
//         rot += step

//         x = cx + Math.cos(rot) * innerRadius;
//         y = cy + Math.sin(rot) * innerRadius;
//         ctx.lineTo(x, y)
//         rot += step
//     }
//     ctx.lineTo(cx, cy - outerRadius)
//     ctx.closePath();
//     ctx.stroke();

//     /* Get pixels of shape */
//     pixelsShape = getPixelAmount(66, 10, 0);
// }

/* Umbrella Shape */
function drawUmbrella() {
    gameStart.classList.add('hidden');
    ctx.strokeStyle = 'rgb(66, 10, 0)';

    /* Draw individual arcs */
    drawArc(185, 165, 120, 0, 1); // large parasol
    drawArc(93, 165, 26, 0, 1);
    drawArc(146, 165, 26, 0, 1);
    drawArc(228, 165, 26, 0, 1);
    drawArc(279, 165, 26, 0, 1);

    /* Draw handle */
    ctx.moveTo(172, 165);
    ctx.lineTo(172, 285);
    ctx.stroke();
    drawArc(222, 285, 50, 0, 1, false);
    drawArc(256, 285, 16, 0, 1);
    drawArc(221, 286, 19, 0, 1, false);
    ctx.moveTo(202, 285);
    ctx.lineTo(202, 169);
    ctx.stroke();

    /* Get pixels of shape */
    pixelsShape = getPixelAmount(66, 10, 0);
}

/* Draw individual arcs */
function drawArc(x, y, radius, start, end, counterClockwise = true) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start * Math.PI, end * Math.PI, counterClockwise);
    ctx.stroke();
}


/* Read the context and get all the pixels in the canvas based on their rgb values */
function getPixelAmount(r, g, b) {
    const pixelsData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const allPixels = pixelsData.data.length;;
    let amount = 0;
    for (let i = 0; i < allPixels; i += 4) {
        if (pixelsData.data[i] === r &&
            pixelsData.data[i + 1] === g &&
            pixelsData.data[i + 2] === b) {
            amount++;
        }
    }
    return amount;
}


/* Event Handlers for drawing on the canvas */
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);

/* Set variables once user has started the game */
function handleMouseDown(e) {
    if (!startedTurn) {
        mouseDown = true;
        startedTurn = true;
    } else {
        console.log('You already played');
    }
}


/* Determine X and Y coordinates of mouse */
function handleMouseMove(e) {
    const bounds = canvas.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    /* Only paint when user is holding mouse down */
    if (mouseDown) {
        paint(x, y, e);
    }
}

/* Begins path and moves context and paints line */
// let counter = 0

function paint(x, y, e) {
    let color = getPixelColor(x, y);
    console.log(color)
        // ctx.lineWidth = 10;
        /* user has gone too far off the shape */
    console.log(`x: ${x}, y: ${y}, r: ${color.r}, g: ${color.g}, b: ${color.b}, a: ${color.a}`);
    if ((color.r === 0 && color.g === 0 && color.b === 0) || brokeShape) {
        brokeShape = true;
        winnerLoserModal.style.display = 'flex';
        score.textContent = `FAILURE - You broke the shape`;
        winnerLoserModalh2.innerHTML = "I come to kill you now!"

        return;
    } else {
        ctx.strokeStyle = 'rgb(247, 226, 135)';
        ctx.beginPath();
        // ctx.lineWidth = 10;
        /* Draw a continuous line */
        if (prevX > 0 && prevY > 0) {
            ctx.moveTo(prevX, prevY);
        }
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        prevX = x;
        prevY = y;
    }
    ctx.lineWidth = 20;

}

/* Get opacity of canvas */
function getPixelColor(x, y) {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log('pixcelssss', pixels);
    //  let index = (x + y * canvas.width) * 4;
    // let index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
    let index = Math.floor(y) * (370 * 4) + Math.floor(x) * 4;
    return {
        r: pixels.data[index],
        g: pixels.data[index + 1],
        b: pixels.data[index + 2],
        a: pixels.data[index + 3]
    };
}

function handleMouseUp() {
    mouseDown = false;
    /* Check score once user stops drawing */
    evaluatePixels();
}

/* Divide the number of pixels that were traced by the pixels in the shape to determine how accurate the cut out is */
function evaluatePixels() {
    if (!brokeShape) {

        const pixelsTrace = getPixelAmount(247, 226, 135);

        //console.log(`Pixels Shape: ${pixelsShape}`);
        //console.log(`Pixels Trace: ${pixelsTrace}`);
        let drawColorRatio = pixelsTrace / pixelsShape;
        const shapePixelsLeft = getPixelAmount(66, 10, 0);
        let undrawColorRatio = shapePixelsLeft / pixelsShape;
        let undrawColorRatioComplement = 1 - undrawColorRatio;
        /* User has scored at last 50% but not drawn too much (especially on mobile) */
        if (drawColorRatio >= 0.5 && drawColorRatio <= 1 && undrawColorRatio < 0.5) {

            score.textContent = `SUCCESS - You scored ${Math.round(((drawColorRatio+undrawColorRatioComplement)/2) * 100)}%`;
            winnerLoserModal.style.display = 'flex';
            winnerLoserModalh2.innerHTML = "Winner"
        } else {

            score.textContent = `FAILURE - You cut ${Math.round(((drawColorRatio+undrawColorRatioComplement)/2) * 100)}%`;
            winnerLoserModal.style.display = 'flex';
            winnerLoserModalh2.innerHTML = "I come to kill you now!"
        }
    }
}


/* Event handler for resetting the game */
restart.addEventListener('click', clearCanvas);

/* Clear all elements from the canvas */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameStart.classList.remove('hidden');
    mouseDown = false;
    startedTurn = false;
    brokeShape = false;
    score.textContent = '';
    prevX = null;
    prevY = null;
    pixelsShape = 0;
    winnerLoserModal.style.display = 'none';

}

// Set up touch events for mobile, etc
canvas.addEventListener('touchstart', function(e) {
    // mousePos = getTouchPos(canvas, e);
    e.preventDefault();
    // e.stopImmediatePropagation();
    const touch = e.touches[0];
    // create mouse event fectivy
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    // send event to canvas
    canvas.dispatchEvent(mouseEvent);
}, false);

// // Get the position of a touch relative to the canvas
// function getTouchPos(canvasDom, touchEvent) {
//     const rect = canvasDom.getBoundingClientRect();
//     return {
//         x: touchEvent.touches[0].clientX - rect.left,
//         y: touchEvent.touches[0].clientY - rect.top
//     };
// }

canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    // e.stopImmediatePropagation();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);


canvas.addEventListener('touchend', function() {
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
}, false);


// Prevent scrolling when touching the canvas
// document.body.addEventListener('touchstart', function(e) {
//     if (e.target == canvas) {
//         e.preventDefault();
//     }
// }, false);
// document.body.addEventListener('touchend', function(e) {
//     if (e.target == canvas) {
//         e.preventDefault();
//     }
// }, false);
// document.body.addEventListener('touchmove', function(e) {
//     if (e.target == canvas) {
//         e.preventDefault();
//     }
// }, false);

const body = document.querySelector('body');
body.addEventListener('touchmove', (ev) => {
    setPointer(ev);
});
body.addEventListener('touchstart', (ev) => {
    setPointer(ev);
});


function setPointer(e) {
    const touchCursor = document.querySelector('.touchCursor');
    const bounds = canvas.getBoundingClientRect();
    touchCursor.classList.add('cursor');
    console.log(e.touches[0].clientY);
    console.log(e.touches[0].clientX);
    touchCursor.style.top = e.touches[0].clientY - bounds.top - 40 + 'px';
    touchCursor.style.left = e.touches[0].clientX - bounds.left + 'px';
}


// function setPointer(e) {
//     if (e.touches) {
//         $('#customPointer').css({ 'top': e.pageY, 'left': e.pageX, 'display': 'inline-block' });
//     }
// }



setupCanvas();