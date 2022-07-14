var views = 0;
var jdata;

$(document).ready(function() {
	$.get('sources/get_current_date.php',
		function(data) {
			$('#date').text(data);
		});
});

// Clear all animals
function clearAll() {
    $("#animals").empty();
	$('select').prop('selectedIndex', 0);
}

// Format date to string "yyyymmdd" format
function dateToString(date) {
	const d = String(date.getDate()).padStart(2, "0");
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const y = String(date.getFullYear());
	return y + m + d;
}

// Get the amount of views on Wikipedia at last week
function getViews(name) {
	let date = new Date();
	const till = dateToString(date);
	date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
	const from = dateToString(date);
	$.ajax('https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/' + name + '/daily/' + from + '/' + till + '', {
		dataType: 'json',
		timeout: 1000,
		success: function(data) {
			views = 0;
			data.items.forEach((item) => {
				views += Number(item.views);
			});
			$("#views").text(views);
		},
		error: function() {
			views = 0;
			$("#views").text("No information");
		}
	});
}

// Check that all properties are exists
function checkProperties(animal) {
	if (!('names' in animal)) animal.names = "";
	if (!('animal_type' in animal)) animal.animal_type = "";
	if (!('diet' in animal)) animal.diet = "";
	if (!('lifespan' in animal)) animal.lifespan = "";
	if (!('length_min' in animal)) animal.length_min = "";
	if (!('length_max' in animal)) animal.length_max = "";
	if (!('weight_min' in animal)) animal.weight_min = "";
	if (!('weight_max' in animal)) animal.weight_max = "";
}

// Show animal facts by clicking the specific row
function getDetails(num) {
	const animal = jdata[num];
	checkProperties(animal);
	$("#desc").html("<h2>" + animal.name + "</h2><br><table class='desc'><tr><td>Family:</td><td>" + animal.animal_type + "</td></tr><tr><td>Food:</td><td>" + animal.diet + "</td></tr><tr><td>Lifespan:</td><td>" + animal.lifespan + " years</td></tr><tr><td>Length:</td><td>" + (animal.length_min / 3.2808).toFixed(2) + "m - " + (animal.length_max / 3.2808).toFixed(2) + "m</td></tr><tr><td>Weight:</td><td>" + (animal.weight_min / 2.2046).toFixed(2) + "kg - " + (animal.weight_max / 2.2046).toFixed(2) + "kg</td></tr><tr><td>Views:</td><td id='views'>" + getViews(animal.name) + "</td></tr></table>");
	window.location = "#show";
}

// Show the animals by user choice
function showAnimals(num) {
	$.ajax('https://zoo-animal-api.herokuapp.com/animals/rand/' + num, {
		dataType: 'json',
		timeout: 1000,
		success: function(data) {
			jdata = data;
			let html = '<tr class="title"><td>#</td><td>Name</td><td>Image</td></tr>';
			data.forEach((obj, index) => {
				html += ('<tr onclick="getDetails(' + index + ')"><td><b>' + (index + 1) + '</b></td><td>' + JSON.stringify(obj.name).slice(1, -1) + '</td><td><img src=' + JSON.stringify(obj.image_link) + '/></td></tr>');
			});
			$('#animals').addClass('table');
			$('#animals').html(html);
		},
		error: function() {
			alert("Error Loading Data");
		}
	});
}

mybutton = document.getElementById("myBtn");

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}