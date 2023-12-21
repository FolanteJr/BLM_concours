document.addEventListener("DOMContentLoaded", function () {
    // Hint messages for form validation
    const hints = [
        { firstName: "Votre prénom est requis." },
        { lastName: "Votre nom est requis." },
        { email: "Format d'adresse email invalide." },
    ];

    const form = document.getElementById("simple-form");
    const inputs = form.querySelectorAll("input");
    const isValid = []; // To store the inputs validity
    let isFormValid = false; // For the form validity

    // focus the first input on loading
    inputs[0].focus();

    // Initialize event listeners
    initializeEventListeners();

    // Function to initialize event listeners
    function initializeEventListeners() {
        inputs.forEach((input) => {
            // Initialize the isValid for all inputs to false
            isValid[input.name] = false;
            input.addEventListener("blur", () => {
                handleValidateInput(input);
            });
        });

        // Listen to the submit of the form
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            handleFormSubmission();
        });
    }

    // Function to handle input validation on blur
    function handleValidateInput(input) {
        const isInputValid = validateInput(input);
        const hint = document.getElementById(`${input.name}Hint`);
        console.log(hint);
        isValid[input.name] = isInputValid;

        // Toggle hint message, valid and invalid class
        toggleHintMessage(input, isInputValid);
        input.classList.toggle("valid", isInputValid);
        input.classList.toggle("invalid", !isInputValid);

        // Update the form validity
        isFormValid = Object.values(isValid).every((status) => status === true);
    }

    // Function to validate individual input
    function validateInput(input) {
        const trimedValue = input.value.trim();
        if (input.type === "text") {
            // return false if empty, true otherwise
            return trimedValue !== "";
        } else if (input.type === "email") {
            return validateEmail(trimedValue);
        }

        return false;
    }

    function validateAllInputs() {
        inputs.forEach((input) => {
            handleValidateInput(input);
        });
    }

    // RegEx Email Validation (same as backend).
    function validateEmail(email) {
        return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            email
        );
    }

    // Function to toggle hint messages
    function toggleHintMessage(input, isValid) {
        const inputName = input.name;
        const hintContainer = document.querySelector(`#${inputName}Hint`);

        if (isValid) {
            // Clear hint message if valid and remove aria-invalid attribute
            input.removeAttribute("aria-invalid");
            hintContainer.style.display = "none";
            hintContainer.innerText = "";
        } else {
            // Display hint message if invalid and add aria-invalid attribute
            const hintMessage = hints.find((hint) => hint[inputName])[
                inputName
            ];
            if (hintMessage && hintContainer) {
                input.setAttribute("aria-invalid", "true");
                hintContainer.style.display = "block";
                hintContainer.innerText = hintMessage;
            }
        }
    }

    // Function to handle the form submission
    function handleFormSubmission() {
        // Create an object with the form data
        const formData = new FormData(form);

        if (isFormValid) {
            // Send the POST request to process_form.php
            fetch("./php/process_form.php", {
                method: "POST",
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        showToast(data.toastStyle || "success", data.message);
                        resetForm();
                    } else {
                        handleFormErrors(data.errors);
                        showToast(data.toastStyle || "warning", data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    // Display error if the data has not been able to be saved
                    showToast("error", error.message);
                });
        } else {
            // Validate all the inputs to show the errors
            validateAllInputs();
            // Display an error message if the form is send with unvalid input(s)
            showToast(
                "warning",
                "Veuillez remplir correctement le formulaire avant d'envoyer les données."
            );
        }
    }

    // Function to handle the form errors
    function handleFormErrors(errors) {
        for (const fieldName in errors) {
            // Add the 'invalid' class to the corresponding input
            const input = form.querySelector(`[name="${fieldName}"]`);
            input.classList.add("invalid");
            // Display the corresponding hint message
            toggleHintMessage(input, false);
        }
    }

    // Function to reset the form
    function resetForm() {
        form.reset();
        inputs.forEach((input) => {
            input.classList.remove("valid", "invalid");
        });
    }
});
