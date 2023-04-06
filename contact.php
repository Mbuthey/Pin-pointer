<?php

$fullname = $_POST["name"];
$email = $_POST["email"];
$message = $_POST["message"];
$connection = mysqli_connect("localhost", "root", "", "contact_form") or die("Connection failed");
$sql = "INSERT INTO contact_table(Full_name, Email, Text_message) VALUES ('{$fullname}', '{$email}', '{$message}')";
$result = mysqli_query($connection, $sql) or die("Query Failed!");
header("location: http://localhost/coursework/");
mysqli_close($connection);
?>