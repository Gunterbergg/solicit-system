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
// Verify solicitation total 
$selectedKitsIds = "(";
foreach ($solicitation as $key => $value) { $selectedKitsIds = $selectedKitsIds . $value["id"] . ","; }
$selectedKitsIds = rtrim($selectedKitsIds, ',');
$selectedKitsIds = $selectedKitsIds . ")";

$sql = "SELECT k.id, k.unitary_value FROM kit as k where k.id in $selectedKitsIds";
$result = $conn->query($sql) or returnError("Erro ao verificar solicitação: $conn->error");
$valuesTable = $result->fetch_all(MYSQLI_ASSOC);

$sql = "SELECT u.available_founds FROM user as u where u.id = " . $_SESSION["logged_user_id"];
$result = $conn->query($sql) or returnError("Erro ao verificar solicitação: $conn->error");
$available_founds = ($result->fetch_object())->available_founds;

$conn->commit();

$total = 0;
foreach ($solicitation as $key => $value) 
{
	$unitary_value = current(array_filter($valuesTable, 
		function($element) use ($value) { return $element["id"] == $value["id"]; }))["unitary_value"];
	$total += $unitary_value * $value["quantity"];
}

if ($total > $available_founds) { returnError("Solicitação ultrapassa limite de recursos"); }

$conn->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

$sql = "DELETE FROM solicitation as s WHERE s.user_id = '$user_id'";
$result = $conn->query($sql) or returnError("Erro ao salvar solicitação");

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
$result = $conn->query($sql) or returnError("Erro ao salvar solicitação");

$conn->commit();
$conn->close();
?>