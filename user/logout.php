<?php
session_start();
if (!isset($_SESSION["logged_user_id"])) die(json_encode(array("errorMessage" => "Seção expirada")));

session_destroy();
exit();
?>