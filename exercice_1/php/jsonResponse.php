<?php

// Function to handle JSON response
function jsonResponse($success, $message = '', $errors = [], $httpStatusCode = null, $toastStyle = null)
{
    if ($httpStatusCode !== null) {
        // return the http response code
        http_response_code($httpStatusCode);
    } else {
        // default http response codes
        http_response_code($success ? 200 : 400);
    }
    
    $response = [
        'success' => $success,
        'message' => $message,
        'errors' => $errors,
        'toastStyle' => $toastStyle
    ];

    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}