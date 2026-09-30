<?php
include 'db_connect.php';
header('Content-Type: application/json');

$query = "SELECT * FROM categories";
$result = $conn->query($query);

$categories = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
    echo json_encode($categories);
} else {
    echo json_encode(['error' => 'Failed to fetch categories']);
}

$conn->close();
?>