document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var username = document.getElementById('floatingInput').value;
    var password = document.getElementById('floatingPassword').value;

    fetch('/blog/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json().then(data => {
            console.log('Response JSON:', data);
            if (response.status === 400) {
                throw data;
            }
            return data;
        });
    })
    .then(data => {
        if (data.token) {
            var date = new Date();
            date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
            document.cookie = "Token=" + data.token + expires + "; path=/";
            document.cookie = "username=" + username + expires + "; path=/";
            window.location.href = '/test_blog/';
        } else {
            document.getElementById('responseMessage').innerText = data.data['username'];
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseMessage').classList.add('error');
        if (error.username && error.password) {
            document.getElementById('responseMessage').innerText = "Username and Password is blank.";
        }
        else if (error.password) {
            document.getElementById('responseMessage').innerText = "Password is blank.";
        }
        else if (error.username) {
            document.getElementById('responseMessage').innerText = "Username is blank.";
        }
        else if (error.non_field_errors) {
            document.getElementById('responseMessage').innerText = error.non_field_errors[0];
        }
        else {
            document.getElementById('responseMessage').innerText = 'Unexpected Error contact Admin.';
        }    
    });
  }
);

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}