<?php
// config.php
$host = getenv('mysql.railway.internal');
$port = getenv('3306');
$db   = getenv('railway');
$user = getenv('root');
$pass = getenv('vkafbCqOKOwcoSUzerCXCvjSSukxGrVi');

$GEMINI_API_KEY       = getenv('GEMINI_API_KEY');
$OPENWEATHER_API_KEY  = getenv('OPENWEATHER_API_KEY');

$conn = new mysqli($host, $user, $pass, $db, $port);

?>

