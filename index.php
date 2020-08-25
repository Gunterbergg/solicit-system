<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link rel="stylesheet" type="text/css" href="CSS/login-style.css">
	<script src="main.js"></script>
</head>
<body>
	<div class="display">
		<div class="loginMenu">
			<input type="text" id="cnpjInput" placeholder="CNPJ">
			<input type="password" id="passwInput" placeholder="Senha">
			<button onclick="login()">Login</button>
			<div id="result"></div>	
		</div>
		<div class="user">
			<p id="email"></p>
			<p id="name"></p>
			<p id="founds"></p>
			<button onclick="logout();">Logout</button>
		</div>
		<div class="solicitation">
			<div id="total"></div>
			<div id="remaining"></div>
			<div class="header">
				
			</div>
			<div class="solicited">

			</div>
			<button onclick="saveSolicitation()">Salvar</button>
		</div>
		<div class="not-solicited">

		</div>
	</div>
</body>
</html>