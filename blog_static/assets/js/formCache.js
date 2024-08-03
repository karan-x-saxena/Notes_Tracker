
document.addEventListener('DOMContentLoaded', function() {
    // Ensure the form exists
    const form = document.getElementById('body-form');
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
    function loadFormData() {
        console.log('Loading form data...');
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

    // Load form data when the page is loaded
    loadFormData();

    // Save form data on input change
    form.addEventListener('input', saveFormData);

    // Handle form submission
    document.getElementById('test-button').addEventListener('click', function () {
        for (let element of form.elements) {
            if (element.name && !element.hasAttribute('data-ignore-cache') && localStorage.getItem(element.name)) {
                element.value = localStorage.getItem(element.name);
            }
        }
        alert('Form submitted and cache cleared!');
        localStorage.clear();
        form.reset();
        
    });
});