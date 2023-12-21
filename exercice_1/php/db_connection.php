<?php

include_once './config.php'; // Include the file containing database credentials

// Function to connect to the database
function connectToDatabase()
{
    global $servername, $username, $password, $dbname;

    // Check if the connection is ok
    try {
        $pdo = new PDO("mysql:host=$servername;dbname=$dbname;", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        // If error during the database connection.

        // Log detailed error information on the server side
        error_log("Database Connection Error: " . $e->getMessage());

        // Send an error message to the user
        include_once 'jsonResponse.php';
        jsonResponse(false, "Impossible de se connecter à la base de données. Veuillez réessayer plus tard. Si le problème persiste, merci de nous contacter.", [], 500, "error");
    }
}
