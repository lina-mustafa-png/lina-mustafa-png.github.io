document.getElementById("type").addEventListener("change", function () {
        const sameDayContainer = document.getElementById("sameDayContainer");
        const sameDay = document.getElementById("sameDayDel");
        const description = document.getElementById("typeDescription");

        if (this.value === "standard"){
            description.textContent = "Lower-cost delivery with size-based pricing.";
            sameDayContainer.style.display = "none";
            sameDay.checked = false;
        }
        else if (this.value === "express"){
            description.textContent = "Faster delivery with an express surcharge and optional same-day service.";
            sameDayContainer.style.display = "grid";
        } 
        else if (this.value === "international"){
            description.textContent = "International shipping with handling and customs fees.";
            sameDayContainer.style.display = "none";
            sameDay.checked = false;
        }
        else {
            description.textContent = "Select a delivery method.";
            sameDayContainer.style.display = "none";
            sameDay.checked = false;
        }
    });

document.getElementById("size").addEventListener("change", function () {
    const sizeDescription = document.getElementById("sizeDescription");

    if (this.value === "S"){
        sizeDescription.textContent = "Small: Up to 30 x 20 x 10 cm";
    }
    else if (this.value === "M"){
        sizeDescription.textContent = "Medium: Up to 50 x 40 x 30 cm";
    }
    else if (this.value === "L"){
        sizeDescription.textContent = "Large: Up to 80 x 60 x 50 cm";
    }
    else {
        sizeDescription.textContent = "";
    }
});


function calculateCost(){
    let weightInput = document.getElementById("weight").value;
    let distanceInput = document.getElementById("distance").value;
    let shippingType = document.getElementById("type").value;
    let size = document.getElementById("size").value;

    let result = document.getElementById("result");

    if (weightInput === "" || distanceInput === "" || shippingType === "Option" || size === "Option") {
        result.innerHTML = "Please complete all required fields.";
        result.className = "error";

        result.scrollIntoView({
            behavior: "smooth", 
            block:"center"
        });
        return;
    }

    let weight = Number(weightInput);
    let distance = Number(distanceInput);
    let insurance = document.getElementById("insurance").checked;

    let cost = 3.50 + (weight * 1.20) + (distance * 0.05); // Base cost: weight + distance, with small base fee

    if (weight <= 0 || distance <= 0){
        result.textContent = "Weight and distance must be greater than zero.";
        result.className = "error";
        return;
    }

    //Parcel.java
    if(insurance){
        cost += Math.max(1.50, 0.02 * cost); // compare $1.50 and 2% of the shipping cost then use whichever is hight multiplied by the base cost
    }

    //StandardParcel.java
    if(shippingType === "standard" || shippingType === "express"){
        if (size === "S"){
            cost += 0.75;
        }
        if (size === "M"){
            cost += 1.25;
        }
        if (size === "L"){
            cost += 1.75;
        }
    }

    //ExpressParcel.java
    if(shippingType === "express"){
        cost *= 1.35;

        if(document.getElementById("sameDayDel").checked){
            cost += 7.50;
        }
    }

    //InternationalParcel.java
    if(shippingType === "international"){
        cost += 8.00;
        cost += cost * 0.12;
    }

    result.innerHTML = "Shipping Cost: $" + cost.toFixed(2);
    result.className = "";

    result.scrollIntoView({behavior: "smooth", block: "center"});
}
