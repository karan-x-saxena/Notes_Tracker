document.addEventListener('DOMContentLoaded', function () {
    const username = document.getElementById('iq-sidebar-toggle');

    // Function to fetch and display all titles
    function fetchUsername() {
        fetch('/blog/api/get_username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ 'Token': getCookie('Token') })
        })
        .then(response => {
            console.log('Response status:', response.status);
                if (response.status === 400) {
                    username.innerText = "Username"
                }
                else {
                    username.innerText = response.json().username
            }
            });
        }

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
        // Initial fetch and display of all titles
        fetchUsername();
    });