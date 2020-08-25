<?php
session_start();
require "../mysql_dbc.inc.php";

if($_SERVER["REQUEST_METHOD"] != "POST") returnError("Metodo de requisicao incorreto");
if (!isset($_SESSION["logged_user_id"])) returnError("Seção expirada");
if (!isset($_POST["solicitation"])) returnError("Parametros invalidos");

header("content-type: text/html; charset=utf-8");

$user_id = $_SESSION["logged_user_id"];
$solicitation = json_decode($_POST["solicitation"], true);

$conn->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

$sql = "DELETE FROM solicitation as s WHERE s.user_id = '$user_id'";
$result = $conn->query($sql) or returnError("Erro ao salvar solicitação, por favor contate o suporte: $conn->error");

if (count($solicitation) <= 0) {
	$conn->commit();
	$conn->close();
	exit(0);
}

$insert_values = "";
foreach ($solicitation as $key => $value) {
	$insert_values = $insert_values . "(" . $user_id . "," . $value["id"]. "," . $value["quantity"] . "),";
}
$insert_values = rtrim($insert_values, ',');

$sql = "INSERT INTO solicitation VALUES " . $insert_values;
$result = $conn->query($sql) or returnError("Erro ao salvar solicitação, por favor contate o suporte: $conn->error");

$conn->commit();
$conn->close();
?>