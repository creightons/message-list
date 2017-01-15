(function() {
	
/*
Makes an ajax call

Parameters:
	An object with:
		method: Str, the HTTP method
		url: Str, the url
	
	Callback - A function of the form
		func(err, data)
*/

function ajax(args, callback) {
	var method = args.method,
		url = args.url,
		request = new XMLHttpRequest();
		
	request.open(method, url, true);
	
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = request.responseText
				? JSON.parse(request.responseText)
				: null;
				
			return callback(null, data);
		}
		else {
			return callback(new Error("Error Occured"));
		}
	};
	
	request.onerror = function() {
		return callback(new Error("Error Occured"));
	};
	
	request.send();
}

/*
Makes a modal notification visible for two seconds
before hiding it again.

Parameters
	el - an element node for the piece of dom
		to display momentarily
*/
function displayModal(el) {
	el.classList.remove('hidden');
	setTimeout(
		() => el.classList.add('hidden'),
		1000
	);
}

/*
Covers the main div in a dimmer when an Ajax request
is being processed.

Parameters:
	status: Boolean, true if Ajax request has been started,
		false otherwise. On True, dimmer is applied; on false,
		dimmer is removed.
*/
function setDimmer(status) {
	if (status === true) {
		main.classList.add('processing');
	} else {
		main.classList.remove('processing');
	}
}
	
/*
Takes a button node and an email node and ads a
click event handler that sends an ajax call to
the server upon the node attributes.

Parameters:
	buttonNode - a dom node with the HTTP method
		and url set as data attributes
		
	emailNode - the dom node for the email input element

*/
function addButtonHandler(buttonNode, emailNode) {
	
	
	buttonNode.addEventListener('click', function(event) {
		var method = buttonNode.getAttribute('data-method'),
			url = buttonNode.getAttribute('data-url'),
			email = emailNode.value;
		
		var fullUrl = url + '/' + email;
		
		setDimmer(true);
		ajax({ method: method, url: fullUrl}, function(err) {
			setDimmer(false);
			if(err) {
				displayModal(error);
			} else {
				displayModal(success);
			}
		});
	});
}

var input = document.getElementsByClassName('email')[0],
	join = document.getElementsByClassName('join')[0],
	quit = document.getElementsByClassName('quit')[0],
	suspend = document.getElementsByClassName('suspend')[0],
	resume = document.getElementsByClassName('resume')[0],
	main = document.getElementsByClassName('main')[0],
	success = document.getElementById('success'),
	error = document.getElementById('error');

	
addButtonHandler(join, input);
addButtonHandler(quit, input);
addButtonHandler(suspend, input);
addButtonHandler(resume, input);

})();