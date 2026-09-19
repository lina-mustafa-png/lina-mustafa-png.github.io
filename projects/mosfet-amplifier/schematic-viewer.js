const viewport = document.getElementById("schematic-viewport");
const canvas = document.getElementById("schematic-canvas");

const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");
const resetButton = document.getElementById("reset-view");

let defaultView = getDefaultView();

let scale = defaultView.scale;
let positionX = defaultView.x;
let positionY = defaultView.y;

let dragging = false;
let previousX = 0;
let previousY = 0;

function updateView() {
    canvas.style.transform =
        `translate(-50%, -50%) ` +
        `translate(${positionX}px, ${positionY}px) ` +
        `scale(${scale})`;
}

function changeZoom(amount) {
    scale += amount;
    scale = Math.min(Math.max(scale, 0.6), 5);
    updateView();
}

zoomInButton.addEventListener("click", function () {
    changeZoom(0.2);
});

zoomOutButton.addEventListener("click", function () {
    changeZoom(-0.2);
});

resetButton.addEventListener("click", function () {
    defaultView = getDefaultView();

    scale = defaultView.scale;
    positionX = defaultView.x;
    positionY = defaultView.y;
    updateView();
});

viewport.addEventListener("wheel", function (event) {
    event.preventDefault();

    if (event.deltaY < 0) {
        changeZoom(0.1);
    } else {
        changeZoom(-0.1);
    }
});

viewport.addEventListener("pointerdown", function (event) {
    if (event.target.closest(".component-hotspot")) {
        return;
    }

    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;

    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
});

viewport.addEventListener("pointermove", function (event) {
    if (!dragging) {
        return;
    }

    positionX += event.clientX - previousX;
    positionY += event.clientY - previousY;

    previousX = event.clientX;
    previousY = event.clientY;

    updateView();
});

viewport.addEventListener("pointerup", stopDragging);
viewport.addEventListener("pointercancel", stopDragging);

function stopDragging() {
    dragging = false;
    viewport.classList.remove("is-dragging");
}

function getDefaultView() {
    const mobile = window.innerWidth <= 650;

    if (mobile) {
        return {
            scale: 1.18,
            x: 0,
            y: 35
        };
    }

    return {
        scale: 1.05,
        x: viewport.clientWidth * 0.04,
        y: viewport.clientHeight * -0.09
    };
}