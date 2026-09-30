<?php
$host = 'localhost';
$username = 'root';
$password = 'root'; // MAMP default password
$database = 'food_ordering';
$port = 8889; // MAMP MySQL port

// Create connection
$conn = new mysqli($host, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>