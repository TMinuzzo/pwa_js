const API_ROOT = "https://reqres.in/api/";
const nbMaxAttendees = 30;

function fetchAttendees(){
	return fetch(API_ROOT + `users`)
		.then(res => res.json())
		.then(res => res.data || [])
}

function renderAttendees(attendees=[]){
	const attendeesSection = document.getElementById("attendees");
	attendeesSection.innerHTML = `
	<h1>Attendees: ${attendees.length} / ${nbMaxAttendees}</h1>
	<ul>
		${attendees.map(user => `
		<li class='card'>
			<img src="${user.avatar}" alt="Avatar" class="avatar">
			<p>
				<span class="firstname">${user.first_name}</span>
				<br>
				<span class="lastname">${user.last_name}</span>
			</p>
		</li>
		`).join('')}
	</ul>
	`

	const registerSection = document.getElementById("register");
	const isFull = (attendees.length >= nbMaxAttendees);
	registerSection.querySelectorAll("input, button").forEach(elm => { elm.disabled = isFull });
	registerSection.querySelector(".status").innerHTML = isFull
		? `Sorry, this event is full.`
		: `Some places are still available for you to register for this event.`
}

document.addEventListener("DOMContentLoaded", () => {
	fetchAttendees().then(renderAttendees);

	//TODO: Etape 2 - Installation du Service Worker au chargement du document
	const worker = new Worker("worker.js");
	function askWorkerToPerformRecurringTask(){
		// post a sting to the worker
		worker.postMessage("recurring");
	}
	function sendMessageToWorker(){
		// post a sting to the worker
		worker.postMessage("Hello World !");
	}
	// This event is fired when the worker posts a message
	// The value of the message is in messageEvent.data
	worker.addEventListener("message", function(messageEvent){
		const div = document.getElementById("result");
		// Log the received message on the top of the tag
		div.innerHTML = messageEvent.data + "<br>" + div.innerHTML;
	});
	// a function that generates a random number every second and posts it to the main JavaScript
	function generateNumbers(){
		setInterval(function(){
			// post a message to the main JavaScript
			self.postMessage(Math.random());
		}, 1000);
	}

	// This event is fired when the worker recieves a message from the main JavaScript
	// The value of the message is in messageEvent.data
	self.addEventListener("message", function(messageEvent){
		if(messageEvent.data === "recurring"){
			// If the value of the event is "recurring", we launch the above function
			generateNumbers();
		}else{
			// Post a message back to the main JS
			self.postMessage("Hello to you too !");
		}
	});

	if ('serviceWorker' in navigator) {
		console.log("teste")
		navigator.serviceWorker
		  .register('sw.js')
		  .then(serviceWorker => {
			console.log('Service Worker registered: ' + serviceWorker);
		  })
		  .catch(error => {
			console.log('Error registering the Service Worker: ' + error);
		  });
	  }

	//TODO: Etape 4 - Réception de messages depuis le Service Worker
});