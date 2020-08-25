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
	let cnpj = document.querySelector("#cnpjInput").value;
	let passw = document.querySelector("#passwInput").value;
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

		displayuser();
		refreshSolicitation();
	});
}

function saveSolicitation (argument) 
{
	let postData = new FormData();
	let solicitation = JSON.stringify(user.solicited);
	postData.append("solicitation", solicitation);
	console.log(postData);
	console.log(solicitation);
	post("user/save_solicitation.php", postData, function () {
		if (this.readyState != 4) return;
		if (this.status != 200)
		{
			errorHandler(JSON.parse(this.responseText).errorMessage);
			return;
		}
	});
}

function createJSONArrayDOM(jsonArray, callback)
{
	let parentDOM = document.createElement("div");
	if (jsonArray == null) return;
	jsonArray.forEach(function (item, index) {
		parentDOM.appendChild(createJSONObjectDOM(item, callback));
	});
	return parentDOM;
}

function createJSONObjectDOM (jsonObject, callback) {
	let objectDOM = document.createElement("div");
	objectDOM.classList.add("object");
	for (property in jsonObject)
	{
		let objectPropertyDOM = document.createElement("div");
		objectPropertyDOM.classList.add("object-property");
		objectPropertyDOM.classList.add(property);
		objectPropertyDOM.innerHTML = jsonObject[property];
		objectDOM.appendChild(objectPropertyDOM);
	}
	if (callback != null) callback(objectDOM, jsonObject);
	return objectDOM;
}

function displayuser () 
{
	document.querySelector(".user #email").innerHTML = user.email;
	document.querySelector(".user #name").innerHTML = user.name;
	document.querySelector(".user #founds").innerHTML = user.available_founds;
}

function refreshSolicitation ()
{
	refreshSolicitedItems();
	refreshNotsolicitedItems();
}

function refreshSolicitedItems() 
{
	let total = 0;
	user.solicited.sort(function(base, comparison) { return base.id - comparison.id });
	let table = createJSONArrayDOM(user.solicited, function (objectDOM, object)
	{
		let commands = document.createElement("div");
		commands.classList.add("object-commands");

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

		total += object.total;

		commands.appendChild(addButton);
		commands.appendChild(subtractButton);
		commands.appendChild(removeButton);

		objectDOM.appendChild(commands);
	});
	document.querySelector(".solicited").innerHTML = "";
	document.querySelector(".solicited").appendChild(table);

	document.querySelector(".solicitation #total").innerHTML = total;
	document.querySelector(".solicitation #remaining").innerHTML = parseFloat(user.available_founds) - total;
}

function refreshNotsolicitedItems() 
{
	user.not_solicited.sort(function(base, comparison) { return base.id - comparison.id });
	let table = createJSONArrayDOM(user.not_solicited, function (objectDOM, object)
	{
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

		objectDOM.appendChild(solicitButton);
	});
	document.querySelector(".not-solicited").innerHTML = "";
	document.querySelector(".not-solicited").appendChild(table);
}