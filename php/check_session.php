<?php
session_start();
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (isset($_SESSION['user_id']) && $_SESSION['logged_in']) {
    echo json_encode([
        'logged_in' => true,
        'user_name' => $_SESSION['user_name'],
        'user_id' => $_SESSION['user_id']
    ]);
} else {
    echo json_encode(['logged_in' => false]);
}
?>