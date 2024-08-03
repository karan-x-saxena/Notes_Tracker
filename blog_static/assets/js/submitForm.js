document.addEventListener("DOMContentLoaded", function() {
    // Function to get the value of a cookie by its name
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Get the CSRF token from cookies
    const csrftoken = getCookie('csrftoken');

    // Check if the CSRF token is available
    if (csrftoken) {
        // Get the form by its ID
        const form = document.getElementById('body-form');

        // Create a new hidden input element
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfmiddlewaretoken';
        csrfInput.value = csrftoken;

        // Append the hidden input to the form
        form.appendChild(csrfInput);
    } else {
        console.error('CSRF token not found in cookies');
    }
});
