<?php
session_start();
require "../mysql_dbc.inc.php";

if($_SERVER["REQUEST_METHOD"] != "POST") returnError("Metodo de requisicao incorreto");
if (!isset($_POST["cnpj"]) || !isset($_POST["passw"])) returnError("Parametros invalidos");
header("content-type: text/html; charset=utf-8"); 

$cnpj = $_POST["cnpj"];
$passw = $_POST["passw"];

$conn->begin_transaction(MYSQLI_TRANS_START_READ_ONLY);

$sql = "SELECT id, cnpj, available_founds, name, email
		FROM user
		WHERE cnpj = '$cnpj' AND password = '$passw'";

$result = $conn->query($sql) or returnError("Erro ao relizar transação no banco de dados");
if ($result->num_rows != 1) returnError("Credenciais invalidas");	
$response = $result->fetch_object();

$_SESSION["logged_user_id"] = $response->id;

$sql = "SELECT k.id, k.name, k.items, k.unitary_value, s.quantity, (k.unitary_value * s.quantity) as total 
		FROM solicitation as s 
		INNER JOIN user as u on s.user_id = u.id
		INNER JOIN kit as k on s.kit_id = k.id
		WHERE u.cnpj = '$cnpj'";

$result = $conn->query($sql) or returnError('Erro ao relizar transação no banco de dados');
$response->solicited = $result->fetch_all(MYSQLI_ASSOC);

$sql = "SELECT k.id, k.name, k.items, k.unitary_value FROM
		(SELECT *
		FROM solicitation AS s
		INNER JOIN user AS u ON u.id = s.user_id
		WHERE u.cnpj = '$cnpj') AS us
		RIGHT JOIN kit as k ON k.id = us.kit_id
		WHERE us.kit_id is NULL";

$result = $conn->query($sql) or returnError('Erro ao relizar transação no banco de dados');
$response->not_solicited = $result->fetch_all(MYSQLI_ASSOC);

echo(unicode_decode(json_encode($response)));

$conn->commit();
$conn->close();
?>