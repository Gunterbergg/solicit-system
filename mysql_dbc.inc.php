<?php
$connInfo = array(
	"host" => "localhost",
	"port" => "3308",
	"user" => "root",
	"passw" => "",
	"database" => "solicit"
);

$conn = new mysqli($connInfo["host"], $connInfo["user"], $connInfo["passw"], $connInfo["database"] , $connInfo["port"]);
if ($conn->connect_error != null) returnError("Não foi possível se conectar ao banco de dados, tente novamente mais tarde");

$conn->query("SET NAMES 'utf8'");
$conn->query("SET character_set_connection=utf8");
$conn->query("SET character_set_client=utf8");
$conn->query("SET character_set_results=utf8");
$conn->set_charset("utf8");

function returnError($error)
{
	header("HTTP/1.0 500 Internal Server Error");
	header("content-type: text/html; charset=UTF-8");
	die(json_encode(array("errorMessage" => $error)));
}

function replace_unicode_escape_sequence($match)
{
    return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');
}

function unicode_decode($str)
{
    return preg_replace_callback('/\\\\u([0-9a-f]{4})/i', 'replace_unicode_escape_sequence', $str);
}
?>