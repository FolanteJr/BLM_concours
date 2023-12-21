<?php

include 'jsonResponse.php';
include 'db_connection.php';

// Process the form data
// htmlspecialchars to prevent XSS attacks if it needs to be displayed later
$firstName = htmlspecialchars($_POST['firstName'], ENT_QUOTES, 'UTF-8');
$lastName = htmlspecialchars($_POST['lastName'], ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($_POST['email'], ENT_QUOTES, 'UTF-8');

// DATA VALIDATION
$errors = [];
// Check if the first name is not empty
if (empty(trim($firstName))) {
    $errors['firstName'] = "firstName";
}

// Check if the last name is not empty
if (empty(trim($lastName))) {
    $errors['lastName'] = "lastName";
}

// Check if the email is valid using a regex
$emailRegex = '/^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~\-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/';
if (!preg_match($emailRegex, trim($email))) {
    $errors['email'] = "email";
}

// Send the errors to be display on the form
if (!empty($errors)) {
    jsonResponse(false, "Veuillez remplir correctement le formulaire avant d'envoyer les données.", $errors, 400, "warning");
}

// If there is no error in the form, add the form data to the database.
try {
    // Connect to the database
    $connection = connectToDatabase();
    $stmt = $connection->prepare('INSERT INTO users (email, first_name, last_name) VALUES (?, ?, ?)');
    $stmt->execute([$email, $firstName, $lastName]);

    // Insertion successful
    jsonResponse(true, "Vos données ont été enregistrées avec succès.", [], 201, "success");

} catch (PDOException $e) {
    // Insertion failed
    // Log detailed error information on the server side
    error_log("Database Insertion Error: " . $e->getMessage());

    // Error for the user
    jsonResponse(false, "Erreur lors de l'enregistrement des données. Veuillez réessayer. Si le problème persite, merci de nous contacter.", [], 500, "error");

} finally {
    // Close the database connection
    $connection = null;
}

exit();
