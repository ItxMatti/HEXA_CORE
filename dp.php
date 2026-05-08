<<<<<<< HEAD
<?php
$host = "localhost";
$user = "root";
$pass = "";
$dp = "login_system";

$conn = new mysqli("localhost","root","","login_system");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
=======
<?php
$host = "localhost";
$user = "root";
$pass = "";
$dp = "login_system";

$conn = new mysqli("localhost","root","","login_system");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
>>>>>>> 0f5eeac82164bc5624ec33175787a4be76c51815
?>