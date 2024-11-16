function setupEventListeners(titlesDict) {
    // Get all trigger links
    const triggerLinks = document.querySelectorAll('.edit_note');
    console.log('Trigger links:', triggerLinks);

    // Add event listener to each trigger link
    triggerLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default action of the link
            const title = link.getAttribute("title");
            localStorage.clear()

            const titleData = titlesDict[title];
            console.log(titlesDict, title, titleData)
            for (const key in titleData) {
                let set_key = key;
                if (key == 'body') {
                    set_key = 'froalaContent';
                }
                localStorage.setItem(set_key, titleData[key]);
            }

            localStorage.setItem('update_title', title)

            $('.fr-element.fr-view').html(localStorage.getItem('froalaContent'));
            loadFormData();
            const targetLink = document.getElementById('target-link')
            
            if (targetLink.getAttribute('aria-expanded') == "false") {
                targetLink.click();
            }
        });
    });
}