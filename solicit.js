var user;

function post(url, data, callback) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = callback;
	xhttp.open("POST", url, true);
	xhttp.send(data);
}

function get(url, callback) {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = callback;
	xhttp.open("GET", url, true);
	xhttp.send();
}

function errorHandler(error) {
	alert(error);
}

function login() {
	let postData = new FormData();
	let cnpj = document.querySelector("#cnpj-input").value;
	let passw = document.querySelector("#passw-input").value;
	postData.append("cnpj", cnpj);
	postData.append("passw", passw);
	post("user/login.php", postData, function () 
	{
		if (this.readyState != 4) return;
		if (this.status != 200)
		{
			errorHandler(JSON.parse(this.responseText).errorMessage);
			return;
		}
		user = JSON.parse(this.responseText);
		document.querySelector("#login-view").classList.toggle("hidden", true);
		refreshUserData();
		refreshSolicitation();
	});
}

function logout() {
	get("user/logout.php", function () 
	{
		if (this.readyState != 4) return;
		if (this.status != 200)
		{
			errorHandler(JSON.parse(this.responseText).errorMessage);
			return;
		}
		user = null;
		document.querySelector("#login-view").classList.toggle("hidden", false);
		refreshUserData();
		refreshSolicitation();
	});
}

function saveSolicitation (argument) 
{
	let postData = new FormData();
	let solicitation = JSON.stringify(user.solicited);
	postData.append("solicitation", solicitation);
	post("user/save_solicitation.php", postData, function () {
		if (this.readyState != 4) return;
		if (this.status != 200)
		{
			errorHandler(JSON.parse(this.responseText).errorMessage);
			return;
		}
		alert("Salvo com sucesso!");
	});
}

function createJSONArrayDOM(jsonArray, callback, propertyDrawer)
{
	let parentDOM = document.createElement("div");
	parentDOM.classList.add("object-table");
	if (jsonArray == null) return;
	jsonArray.forEach(function (item, index) {
		parentDOM.appendChild(createJSONObjectDOM(item, callback, propertyDrawer));
	});
	return parentDOM;
}

function createJSONObjectDOM (jsonObject, callback, propertyDrawer) {
	let objectDOM = document.createElement("div");
	objectDOM.classList.add("object");
	for (property in jsonObject)
	{
		let objectPropertyDOM = document.createElement("div");
		objectPropertyDOM.classList.add("object-property");
		let propertyLabelDOM = document.createElement("p");
		propertyLabelDOM.classList.add("object-property-label");
		let propertyValueDOM = document.createElement("p");
		propertyValueDOM.classList.add("object-property-value");

		objectPropertyDOM.classList.add(property);

		propertyLabelDOM.innerHTML = property;
		propertyValueDOM.innerHTML = jsonObject[property];

		objectPropertyDOM.appendChild(propertyLabelDOM);
		objectPropertyDOM.appendChild(propertyValueDOM);

		if (propertyDrawer != null) propertyDrawer(objectPropertyDOM, property, jsonObject, objectDOM);
		
		objectDOM.appendChild(objectPropertyDOM);
	}
	if (callback != null) callback(objectDOM, jsonObject);
	return objectDOM;
}

function refreshUserData () 
{
	if (user != null) 
	{ 
		document.querySelector("#email").innerHTML = user.email;
		document.querySelector("#name").innerHTML = user.name;
		document.querySelector("#founds").innerHTML = user.available_founds;
	}
	else
	{
		document.querySelector("#email").innerHTML = "";
		document.querySelector("#name").innerHTML = "";
		document.querySelector("#founds").innerHTML = "";		
	}
}

function refreshSolicitation ()
{
	refreshSolicitedItems();
	refreshNotsolicitedItems();
}

function refreshSolicitedItems() 
{
	document.querySelector("#solicitation").innerHTML = "";
	if (user == null) {
		document.querySelector("#solicitation-total").innerHTML = "";
		document.querySelector("#solicitation-remaining").innerHTML = "";
		return;
	}

	let total = 0;
	user.solicited.sort(function(base, comparison) { return base.id - comparison.id });
	let table = createJSONArrayDOM(user.solicited, null, function (objectPropertyDOM, property, object, objectDOM)
	{
		if (property != "quantity") return;

		let commands = document.createElement("div");
		commands.classList.add("object-property-commands");

		let addButton = document.createElement("button");
		addButton.addEventListener("click", function () 
		{
			object.quantity = Math.max(1, parseFloat(object.quantity) + 1);
			object.total = parseFloat(object.quantity) * object.unitary_value;
			refreshSolicitation();
		}, false);
		addButton.classList.add("command-button");
		addButton.classList.add("add-button");
		addButton.innerHTML = "+";

		let subtractButton = document.createElement("button");
		subtractButton.addEventListener("click", function ()
		{
			object.quantity = Math.max(1, parseFloat(object.quantity) - 1);
			object.total = parseFloat(object.quantity) * object.unitary_value;
			refreshSolicitation();
		}, false);
		subtractButton.classList.add("command-button");
		subtractButton.classList.add("subtract-button");
		subtractButton.innerHTML = "-";	

		let removeButton = document.createElement("button");
		removeButton.addEventListener("click", function ()
		{
			delete object.total;
			delete object.quantity;
			user.solicited.splice(user.solicited.indexOf(object), 1);
			user.not_solicited.push(object);
			refreshSolicitation();
		}, false);
		removeButton.classList.add("command-button");
		removeButton.classList.add("remove-button");
		removeButton.innerHTML = "x";	

		total += parseFloat(object.total);

		commands.appendChild(addButton);
		commands.appendChild(subtractButton);
		commands.appendChild(removeButton);
		objectPropertyDOM.querySelector(".object-property-value").appendChild(commands);
	});
	document.querySelector("#solicitation").appendChild(table);
	document.querySelector("#solicitation-total").innerHTML = total;
	document.querySelector("#solicitation-remaining").innerHTML = parseFloat(user.available_founds) - total;
}

function refreshNotsolicitedItems() 
{
	document.querySelector("#not-solicited").innerHTML = "";
	if (user == null) return;

	user.not_solicited.sort(function(base, comparison) { return base.id - comparison.id });
	let table = createJSONArrayDOM(user.not_solicited, function (objectDOM, object)
	{
		let commands = document.createElement("div");
		commands.classList.add("object-commands");

		let solicitButton = document.createElement("button");
		solicitButton.addEventListener("click", function () 
		{
			object.quantity = 1;
			object.total = object.quantity * object.unitary_value;
			user.not_solicited.splice(user.not_solicited.indexOf(object), 1);
			user.solicited.push(object);
			refreshSolicitation();
		}, false);
		solicitButton.classList.add("command-button");
		solicitButton.classList.add("solicit-button");
		solicitButton.innerHTML += "Adicionar";

		commands.appendChild(solicitButton);
		objectDOM.appendChild(commands);
	});
	document.querySelector("#not-solicited").appendChild(table);
}