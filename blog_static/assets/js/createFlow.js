function loadFormData() {
    console.log('Loading form data...');
    const form = document.getElementById('body-form');
    for (let element of form.elements) {
        if (element.name && !element.hasAttribute('data-ignore-cache') && localStorage.getItem(element.name)) {
            element.value = localStorage.getItem(element.name);
        }
    }
    // Load Froala Editor content
    // const froalaContent = localStorage.getItem('froalaContent');
    // if (froalaContent) {
    //     froalaEditor.html.set(froalaContent);
    // }
}

document.addEventListener('DOMContentLoaded', function () {
    // Ensure the form exists
    const form = document.getElementById('body-form');
    const folder = document.getElementById('folder');
    const cancelButton = document.getElementById('cancel-button');
    // if (!form) {
    //     console.error('Form with ID "myForm" not found.');
    //     return;
    // }

    // Initialize Froala Editor

    // Function to save form data to localStorage
    function saveFormData() {
        console.log('Saving form data...');
        for (let element of form.elements) {
            if (element.name && !element.hasAttribute('data-ignore-cache')) {
                localStorage.setItem(element.name, element.value);
            }
        }
    }

    // Function to load form data from localStorage
    

    // Load form data when the page is loaded
    loadFormData();

    // Save form data on input change
    form.addEventListener('input', saveFormData);

    // Handle form submission
    const saveButton = document.getElementById('test-button')

    saveButton.addEventListener('click', function () {
        let payload = {
            "title": "",
            "slug_heading": "",
            "priority": null,
            "body": null,
            "tags": [],
            "parent_note": folder.textContent,
            "author": getCookie('username')
        }
        let method = 'POST';
        let api = '/blog/api/notes_title/';
        if (localStorage.getItem('update_title')) {
            old_title = localStorage.getItem('update_title')
            method = 'PUT';
            api = `/blog/api/update_notes_title/${old_title}/`
            console.log(api)
        }

        for (let element of form.elements) {
            if (element.name in payload) {
                console.log(element.value)
                value = element.value
                if (element.name == 'tags') {
                    valuesArray = element.value.split(',').map(word => word.trim());
                    value = valuesArray.map(value => ({ name: value }));
                }

                else if (element.name == 'body') {
                    value = localStorage.getItem('froalaContent')
                }

                payload[element.name] = value
            }
        }
        console.log(payload)
        fetch(api, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'Authorization': 'Token' + ' ' + getCookie('Token')
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json().then(data => {
                    console.log('Response JSON:', data);
                    if (response.status == 201 || response.status == 200) {
                        return data;
                    }
                    throw data;
                });
            })
            .then(data => {
                localStorage.clear();
                form.reset();
                document.getElementById('toggle-button').click();
                document.getElementById('previous-title').click();
            })
            .catch(error => {
                console.error('Error:', error);

                for (key in error) {
                    if ('detail' == key) {
                        const value = error.detail
                        document.getElementById('submitResponse').innerText = value.join(", ");
                        delete error['detail']
                    }

                    else if ('tags' == key) {
                        document.getElementById(`label_${key}`).classList.add('error');
                        console.log(error[key])
                        document.getElementById(`id_${key}`).placeholder = 'This field may not be blank.';
                    }
                    else {
                        document.getElementById(`label_${key}`).classList.add('error');
                        console.log(error[key])
                        document.getElementById(`id_${key}`).placeholder = error[key].join(", ");
                    }

                }

                // document.getElementById('label_title').classList.add('error');
                // if (error.title) {
                //     document.getElementById('id_title').placeholder = error.key.join(", ");
                // }
                // else if (error.password) {
                //     document.getElementById('responseMessage').innerText = "Password is blank.";
                // }
                // else if (error.username) {
                //     document.getElementById('responseMessage').innerText = "Username is blank.";
                // }
                // else if (error.non_field_errors) {
                //     document.getElementById('responseMessage').innerText = error.non_field_errors[0];
                // }
                // else {
                //     document.getElementById('responseMessage').innerText = 'Unexpected Error contact Admin.';
                // }    
            });
        // alert('Form submitted and cache cleared!');
    });

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
});