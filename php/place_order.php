<?php
include 'db_connect.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $customer_id = $_SESSION['user_id'] ?? 1; // Fallback for demo
    $total_amount = 0;
    
    // Calculate total from cart items
    foreach ($input['items'] as $item) {
        $total_amount += $item['price'] * $item['quantity'];
    }
    
    $delivery_fee = 40;
    $tax = $total_amount * 0.05;
    $final_total = $total_amount + $delivery_fee + $tax;
    
    $delivery_address = $conn->real_escape_string($input['delivery_address']);
    $payment_method = $conn->real_escape_string($input['payment_method']);
    $instructions = $conn->real_escape_string($input['instructions'] ?? '');
    $name = $conn->real_escape_string($input['name']);
    $phone = $conn->real_escape_string($input['phone']);

    // Insert order
    $order_query = "INSERT INTO orders (customer_id, total_amount, delivery_address, payment_method, instructions, estimated_delivery) 
                   VALUES ('$customer_id', '$final_total', '$delivery_address', '$payment_method', '$instructions', DATE_ADD(NOW(), INTERVAL 30 MINUTE))";
    
    if ($conn->query($order_query)) {
        $order_id = $conn->insert_id;
        
        // Insert order items
        foreach ($input['items'] as $item) {
            $food_item_id = intval($item['id']);
            $quantity = intval($item['quantity']);
            $price = floatval($item['price']);
            
            $item_query = "INSERT INTO order_items (order_id, food_item_id, quantity, price) 
                          VALUES ('$order_id', '$food_item_id', '$quantity', '$price')";
            $conn->query($item_query);
        }
        
        echo json_encode(['success' => true, 'order_id' => $order_id, 'message' => 'Order placed successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to place order: ' . $conn->error]);
    }
}

$conn->close();
?>