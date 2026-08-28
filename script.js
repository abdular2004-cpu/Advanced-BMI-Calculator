/* =========================================
   ADVANCED BMI CALCULATOR
========================================= */


/* =========================================
   GET HTML ELEMENTS
========================================= */

const bmiForm = document.getElementById("bmiForm");

const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");

const resultBox = document.getElementById("result");

const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");
const bmiMessage = document.getElementById("bmiMessage");

const resetBtn = document.getElementById("resetBtn");

const historyContainer =
    document.getElementById("historyContainer");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");


/* =========================================
   LOAD HISTORY
========================================= */

let bmiHistory =
    JSON.parse(localStorage.getItem("bmiHistory")) || [];


/* =========================================
   DISPLAY HISTORY WHEN PAGE LOADS
========================================= */

displayHistory();


/* =========================================
   BMI FORM SUBMIT
========================================= */

bmiForm.addEventListener("submit", function(event) {

    event.preventDefault();

    /* Get values */

    const age = Number(ageInput.value);
    const height = Number(heightInput.value);
    const weight = Number(weightInput.value);

    const genderElement =
        document.querySelector(
            'input[name="gender"]:checked'
        );


    /* Validate gender */

    if (!genderElement) {
        alert("Please select your gender.");
        return;
    }

    const gender = genderElement.value;


    /* Validate age */

    if (age < 2 || age > 120) {
        alert("Please enter a valid age between 2 and 120.");
        return;
    }


    /* Validate height */

    if (height < 50 || height > 250) {
        alert("Please enter a valid height between 50 and 250 cm.");
        return;
    }


    /* Validate weight */

    if (weight < 10 || weight > 500) {
        alert("Please enter a valid weight between 10 and 500 kg.");
        return;
    }


    /* =========================================
       BMI CALCULATION
    ========================================= */

    const heightInMeters = height / 100;

    const bmi =
        weight / (heightInMeters * heightInMeters);

    const roundedBMI = bmi.toFixed(1);


    /* =========================================
       DETERMINE CATEGORY
    ========================================= */

    let category;
    let message;
    let categoryClass;


    if (bmi < 18.5) {

        category = "Underweight";

        message =
            "Your BMI is below the normal range. Consider maintaining a balanced and nutritious diet.";

        categoryClass = "underweight";

    }

    else if (bmi < 25) {

        category = "Normal Weight";

        message =
            "Your BMI is within the normal range. Continue maintaining healthy lifestyle habits.";

        categoryClass = "normal";

    }

    else if (bmi < 30) {

        category = "Overweight";

        message =
            "Your BMI is above the normal range. Regular physical activity and a balanced diet may help.";

        categoryClass = "overweight";

    }

    else {

        category = "Obesity";

        message =
            "Your BMI is in the obesity range. Consider discussing your health and lifestyle with a qualified healthcare professional.";

        categoryClass = "obese";
    }


    /* =========================================
       DISPLAY RESULT
    ========================================= */

    bmiValue.textContent = roundedBMI;

    bmiCategory.textContent = category;

    bmiMessage.textContent = message;


    /* Remove previous category classes */

    bmiCategory.classList.remove(
        "underweight",
        "normal",
        "overweight",
        "obese"
    );


    /* Add current category class */

    bmiCategory.classList.add(categoryClass);


    /* Show result */

    resultBox.classList.remove("hidden");


    /* =========================================
       CREATE HISTORY OBJECT
    ========================================= */

    const historyItem = {

        id: Date.now(),

        age: age,

        gender: gender,

        height: height,

        weight: weight,

        bmi: roundedBMI,

        category: category,

        date: new Date().toLocaleString()

    };


    /* =========================================
       ADD TO HISTORY
    ========================================= */

    bmiHistory.unshift(historyItem);


    /* =========================================
       SAVE HISTORY
    ========================================= */

    localStorage.setItem(
        "bmiHistory",
        JSON.stringify(bmiHistory)
    );


    /* =========================================
       DISPLAY UPDATED HISTORY
    ========================================= */

    displayHistory();

});


/* =========================================
   RESET BUTTON
========================================= */

resetBtn.addEventListener("click", function() {

    bmiForm.reset();

    resultBox.classList.add("hidden");

    bmiValue.textContent = "0";

    bmiCategory.textContent = "-";

    bmiMessage.textContent = "";

    bmiCategory.classList.remove(
        "underweight",
        "normal",
        "overweight",
        "obese"
    );

});


/* =========================================
   DISPLAY HISTORY FUNCTION
========================================= */

function displayHistory() {

    /* Clear existing history */

    historyContainer.innerHTML = "";


    /* If there is no history */

    if (bmiHistory.length === 0) {

        historyContainer.innerHTML = `
            <p class="empty-history">
                No BMI calculations yet.
            </p>
        `;

        return;
    }


    /* Create each history item */

    bmiHistory.forEach(function(item) {

        const historyElement =
            document.createElement("div");

        historyElement.classList.add("history-item");


        /* Determine category class */

        let categoryClass = "";

        if (item.category === "Underweight") {

            categoryClass = "underweight";

        }
        else if (item.category === "Normal Weight") {

            categoryClass = "normal";

        }
        else if (item.category === "Overweight") {

            categoryClass = "overweight";

        }
        else if (item.category === "Obesity") {

            categoryClass = "obese";
        }


        /* History HTML */

        historyElement.innerHTML = `

            <div>
                <strong>Age</strong>
                <small>${item.age} years</small>
            </div>

            <div>
                <strong>Gender</strong>
                <small>${item.gender}</small>
            </div>

            <div>
                <strong>BMI</strong>
                <small>${item.bmi}</small>
            </div>

            <div>
                <strong>Category</strong>
                <small class="${categoryClass}">
                    ${item.category}
                </small>
            </div>

            <button
                class="delete-history"
                onclick="deleteHistory(${item.id})"
            >
                Delete
            </button>

            <div>
                <small>${item.date}</small>
            </div>

        `;


        /* Add to page */

        historyContainer.appendChild(historyElement);

    });

}


/* =========================================
   DELETE SINGLE HISTORY ITEM
========================================= */

function deleteHistory(id) {

    bmiHistory =
        bmiHistory.filter(function(item) {

            return item.id !== id;

        });


    /* Save updated history */

    localStorage.setItem(
        "bmiHistory",
        JSON.stringify(bmiHistory)
    );


    /* Display updated history */

    displayHistory();

}


/* =========================================
   CLEAR ALL HISTORY
========================================= */

clearHistoryBtn.addEventListener(
    "click",
    function() {

        if (bmiHistory.length === 0) {

            alert("There is no history to clear.");

            return;
        }


        const confirmation =
            confirm(
                "Are you sure you want to delete all BMI history?"
            );


        if (confirmation) {

            bmiHistory = [];

            localStorage.removeItem("bmiHistory");

            displayHistory();

        }

    }
);