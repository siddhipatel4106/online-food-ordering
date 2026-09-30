<?php
include 'db_connect.php';
header('Content-Type: application/json');

$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;

if ($category_id) {
    $query = "SELECT * FROM menu_items WHERE category_id = $category_id";
} else {
    $query = "SELECT * FROM menu_items";
}

$result = $conn->query($query);

$items = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode($items);
} else {
    echo json_encode(['error' => 'Failed to fetch menu items: ' . $conn->error]);
}

$conn->close();
?>