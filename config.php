<?php
// config.php

$host = "turntable.proxy.rlwy.net";
$port = 34839;
$db   = "railway";
$user = "root";
$pass = "vkafbCqOKOwcoSUzerCXCvjSSukxGrVi";

$GEMINI_API_KEY      = getenv('GEMINI_API_KEY');
$OPENWEATHER_API_KEY = getenv('OPENWEATHER_API_KEY');

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>