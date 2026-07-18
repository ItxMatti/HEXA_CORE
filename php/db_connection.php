<?php

$host = "sql102.infinityfree.com";
$user = "if0_42438179";
$pass = "F3li2UR0oF";
$db   = "if0_42438179_hexacore";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>