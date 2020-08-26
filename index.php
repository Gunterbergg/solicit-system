<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<link rel="stylesheet" type="text/css" href="CSS/solicit.css">
	<script src="solicit.js"></script>
</head>
<body>
	<div class="view" id="login-view">
		<div class="container w-10">
			<div class="img w-12"><img src="imgs/logo.png" alt=""></div>
			<div class="field w-6"><input type="text" id="cnpj-input" class="value" placeholder="CNPJ"></div>
			<div class="field w-6"><input type="password" id="passw-input" class="value" placeholder="Senha"></div>
			<button class="button w-12" onclick="login()">Login</button>
		</div>
	</div>
	<section class="section" id="solicitation-section">
		<div class="hero-header"><img src="imgs/logo.png"></div>
		<h1>Dados</h1>
		<div class="container card">
			<div class="field embedded"><p class="label">Nome</p><p class="value" id="name"></p></div>
			<div class="field embedded"><p class="label">Email</p><p class="value" id="email"></p></div>
			<div class="field embedded"><p class="label">Fundos</p><p class="value" id="founds"></p></div>
			<div class="field embedded"><p class="label">Solicitação </p><p class="value" id="solicitation-total"></p></div>
			<div class="field embedded"><p class="label">Disponível </p><p class="value" id="solicitation-remaining"></p></div>
		</div>
		<div class="container">
			<button class="button" onclick="saveSolicitation()">Salvar solicitação</button>
			<button class="button" onclick="logout();">Sair</button>
		</div>

		<h1>Itens solicitados</h1>
		<div class="container w-10" id="solicitation">
		</div>
		
		<h1>Itens disponíveis</h1>
		<div class="container w-10" id="not-solicited">
		</div>
	</section>
</div>		
</div>
</body>
</html>