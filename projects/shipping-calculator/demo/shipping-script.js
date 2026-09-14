const form = document.getElementById("shipping-form");

const typeInput = document.getElementById("type");
const sizeInput = document.getElementById("size");
const weightInput = document.getElementById("weight");
const distanceInput = document.getElementById("distance");
const insuranceInput = document.getElementById("insurance");
const sameDayInput = document.getElementById("same-day");

const typeDescription = document.getElementById("type-description");
const sizeDescription = document.getElementById("size-description");
const sameDayContainer = document.getElementById("same-day-container");

const formMessage = document.getElementById("form-message");
const emptyResult = document.getElementById("empty-result");
const resultContent = document.getElementById("result-content");
const totalPrice = document.getElementById("total-price");
const priceBreakdown = document.getElementById("price-breakdown");

const resetButton = document.getElementById("reset-btn");
const backButton = document.getElementById("backbtn");

const serviceDescriptions = {
    standard:
        "Economical delivery with regular processing times.",

    express:
        "Faster delivery with a 35% express surcharge.",

    international:
        "International delivery with handling and estimated customs fees."
};

const sizeInformation = {
    S: {
        description: "Small: up to 30 × 20 × 10 cm.",
        surcharge: 0.75
    },

    M: {
        description: "Medium: up to 50 × 40 × 30 cm.",
        surcharge: 1.25
    },

    L: {
        description: "Large: up to 80 × 60 × 50 cm.",
        surcharge: 1.75
    }
};

const currency = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD"
}); 

typeInput.addEventListener("change", () => {
    const selectedType = typeInput.value;

    typeDescription.textContent =
        serviceDescriptions[selectedType] ??
        "Select the service that best fits your shipment.";

    const isExpress = selectedType === "express";

    sameDayContainer.hidden = !isExpress;
    sameDayInput.disabled = !isExpress;

    if (!isExpress) {
        sameDayInput.checked = false;
    }
});

sizeInput.addEventListener("change", () => {
    const selectedSize = sizeInformation[sizeInput.value];

    sizeDescription.textContent = selectedSize ? selectedSize.description : "Select the parcel's approximate dimensions.";
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "";

    if (!form.checkValidity()) {
        formMessage.textContent =
            "Please complete all required shipment details.";

        form.reportValidity();
        return;
    }
    const shippingType = typeInput.value;
    const parcelSize = sizeInput.value;
    const weight = Number(weightInput.value);
    const distance = Number(distanceInput.value);

    if (weight <= 0 || distance <= 0) {
        formMessage.textContent =
            "Weight and distance must be greater than zero.";
        return;
    }

    const breakdown = [];

    const baseFee = 3.5;
    const weightCharge = weight * 1.2;
    const distanceCharge = distance * 0.05;
    const sizeCharge = sizeInformation[parcelSize].surcharge;

    breakdown.push(["Base fee", baseFee]);
    breakdown.push(["Weight charge", weightCharge]);
    breakdown.push(["Distance charge", distanceCharge]);
    breakdown.push(["Size surcharge", sizeCharge]);

    let subtotal =
        baseFee +
        weightCharge +
        distanceCharge +
        sizeCharge;

    if (shippingType === "express") {
        const expressCharge = subtotal * 0.35;

        breakdown.push(["Express surcharge", expressCharge]);
        subtotal += expressCharge;

        if (sameDayInput.checked) {
            const sameDayCharge = 7.5;

            breakdown.push(["Same-day delivery", sameDayCharge]);
            subtotal += sameDayCharge;
        }
    }

    if (shippingType === "international") {
        const handlingFee = 8;
        subtotal += handlingFee;

        const customsEstimate = subtotal * 0.12;

        breakdown.push(["International handling", handlingFee]);
        breakdown.push(["Customs estimate", customsEstimate]);

        subtotal += customsEstimate;
    }

    if (insuranceInput.checked) {
        const insuranceCharge = Math.max(1.5, subtotal * 0.02);

        breakdown.push(["Shipping insurance", insuranceCharge]);
        subtotal += insuranceCharge;
    }

    showResult(subtotal, breakdown);
});

function showResult(total, breakdown) {
    totalPrice.textContent = currency.format(total);

    priceBreakdown.innerHTML = breakdown
        .map(([label, amount]) => {
            return `
                <div class="breakdown-row">
                    <dt>${label}</dt>
                    <dd>${currency.format(amount)}</dd>
                </div>
            `;
        })
        .join("");

    emptyResult.hidden = true;
    resultContent.hidden = false;

    resultContent.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

resetButton.addEventListener("click", () => {
    form.reset();

    typeDescription.textContent =
        "Select the service that best fits your shipment.";

    sizeDescription.textContent =
        "Select the parcel's approximate dimensions.";

    sameDayContainer.hidden = true;
    sameDayInput.disabled = true;

    formMessage.textContent = "";
    priceBreakdown.innerHTML = "";

    emptyResult.hidden = false;
    resultContent.hidden = true;
});

backButton.addEventListener("click", () => {
    window.location.href = "../../../projects.html";
});
