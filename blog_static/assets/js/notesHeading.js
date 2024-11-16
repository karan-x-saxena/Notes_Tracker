const sidebarToggle = document.getElementById('iq-sidebar-toggle');
const notesCard = document.getElementById('notes-cards');
const pinNotesCard = document.getElementById('pin-notes-cards');
const pinNotesColumn = document.getElementById('pin-notes-columns');
const notesColumn = document.getElementById('notes-column');
const folder = document.getElementById('folder');
const previousTitlesButton = document.getElementById('previous-title');
const modal = document.getElementById('modal');
const usernameHeadings = document.querySelectorAll('.username');
const priorityMap = { highest: "danger", high: "warning", medium: "purple", low: "info", lowest: "success", medium: "purple" }
let folderStack = []

// Function to fetch and display all titles
function fetchAllTitles() {
    const username = getCookie('username')

    usernameHeadings.forEach(usernameHeading => {
        usernameHeading.innerText = username;
    });

    fetch(`/blog/api/notes_title/?username=${username}`, {

        method: 'GET',

        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token' + ' ' + getCookie('Token')
        }
    })
        .then(response => response.json())
        .then(data => {
            displayTitles(data);
        });
}
function fetchRelatedTitles(title, search) {
    console.log(search)
    let api = `/blog/api/notes_title/?title=${encodeURIComponent(title)}`;
    if (search) {
        username = getCookie('username');
        api = `/blog/api/search_notes/?title=${encodeURIComponent(title)}&&username=${username}`
    }
    fetch(api, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token' + ' ' + getCookie('Token')
        }
    })
        .then(response => response.json())
        .then(data => {
            folder.innerHTML = `<i class="las la-folder pr-2"></i>${title}`
            if (folderStack.length == 0 || folderStack[folderStack.length - 1] != title) {
                folderStack.push(title)
            }
            displayTitles(data);
        });
}

function previousTitles() {
    console.log(folderStack)
    folderStack.pop()
    const stackLength = folderStack.length

    if (stackLength == 0) {
        fetchAllTitles();
    }

    else {
        const title = folderStack[stackLength - 1]
        fetchRelatedTitles(title, false)
    }

}
// Function to display main titles and their related subtitles
function displayTitles(titlesData) {
    sidebarToggle.innerHTML = '';  // Clear the container
    notesCard.innerHTML = '';
    pinNotesCard.innerHTML = '';
    pinNotesColumn.innerHTML = '';
    let notesCardInnerHTML = '';
    let pinNotesCardInnerHTML = '';
    let pinNotesColumnInnerHTML = '';
    let notesColumnInnerHTML = '';
    let modalHTML = '';
    let index = 0;
    let titlesDict = {};

    for (const titles of titlesData) {
        const liElement = document.createElement('li');
        liElement.className = '';

        const aElement = document.createElement('a');
        aElement.href = '#';
        aElement.addEventListener('click', function (event) {
            event.preventDefault();
            fetchRelatedTitles(titles.title, false);
        });
        aElement.className = 'collapsed svg-icon';
        aElement.setAttribute('data-toggle', 'collapse');
        aElement.setAttribute('aria-expanded', 'false');

        const iElement = document.createElement('i');
        iElement.innerHTML = `
        <svg width="20" class="svg-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
    `;

        const spanElement = document.createElement('span');
        spanElement.innerText = titles.title;

        const arrowRightElement = document.createElement('i');
        arrowRightElement.className = 'las la-angle-right iq-arrow-right arrow-active';

        const arrowDownElement = document.createElement('i');
        arrowDownElement.className = 'las la-angle-down iq-arrow-right arrow-hover';

        aElement.appendChild(iElement);
        aElement.appendChild(spanElement);
        aElement.appendChild(arrowRightElement);
        aElement.appendChild(arrowDownElement);

        const ulElement = document.createElement('ul');
        ulElement.className = 'iq-submenu collapse';
        ulElement.setAttribute('data-parent', '#iq-sidebar-toggle');
        ulElement.id = titles.title;

        const priority = titles.priority;
        const priorityURL = staticURL + `priority/${priority}.png`;

        liElement.appendChild(aElement);
        liElement.appendChild(ulElement);
        sidebarToggle.appendChild(liElement);
        notesCardInnerHTML += `<div class="col-lg-4 col-md-6">
        <div class="card card-block card-stretch card-height card-bottom-border-${priorityMap[priority]} note-detail">
            <div class="card-header d-flex justify-content-between pb-1">
                <img class="" src=${priorityURL} width="70" height="35">
                <div class="card-header-toolbar d-flex align-items-center">
                    <div class="dropdown">
                        <span class="dropdown-toggle dropdown-bg" id="note-dropdownMenuButton4"
                            data-toggle="dropdown" aria-expanded="false" role="button">
                            <i class="ri-more-fill"></i>
                        </span>
                        <div class="dropdown-menu dropdown-menu-right"
                            aria-labelledby="note-dropdownMenuButton4" style="">
                            <a href="#" class="dropdown-item pin_content" pin="true" title="${titles.title}" data-toggle="modal"><i class="las la-thumbtack mr-2"></i>Pin</a>
                            <a href="#" class="dropdown-item edit_note" title="${titles.title}" data-toggle="modal" data-target="#edit-note1"><i class="las la-pen mr-3"></i>Edit</a>
                            <a class="dropdown-item" data-extra-toggle="delete" title="${titles.title}" data-closest-elem=".card" href="#"><i class="las la-trash-alt mr-3"></i>Delete</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body rounded">
                <h4 class="card-title">${titles.title}</h4>
                <p class="mb-3 card-description short">${titles.slug_heading}</p>                                                            
            </div>
            <div class="card-footer">
                <div class="d-flex align-items-center justify-content-between note-text note-text-info">
                    <a href="#" data-toggle="modal" data-target="#new-note${index}"><i class="las la-eye mr-2 font-size-20"></i>View</a>
                    <a href="#" class=""><i class="las la-calendar mr-2 font-size-20"></i>${titles.created_at}</a>
                </div>
            </div>
        </div>
    </div>`;

        if (titles.pin_note) {
            pinNotesCardInnerHTML += `<div class="col-lg-4 col-md-6">
        <div class="card card-block card-stretch card-height card-bottom-border-${priorityMap[priority]} note-detail">
            <div class="card-header d-flex justify-content-between pb-1">
                <img class="" src=${priorityURL} width="70" height="35">
                <div class="card-header-toolbar d-flex align-items-center">
                    <div class="dropdown">
                        <span class="dropdown-toggle dropdown-bg" id="note-dropdownMenuButton4"
                            data-toggle="dropdown" aria-expanded="false" role="button">
                            <i class="ri-more-fill"></i>
                        </span>
                        <div class="dropdown-menu dropdown-menu-right"
                            aria-labelledby="note-dropdownMenuButton4" style="">
                            <a href="#" class="dropdown-item pin_content" pin="false" title="${titles.title}" data-toggle="modal"><i class="las la-thumbtack mr-2"></i>Unpin</a>
                            <a href="#" class="dropdown-item edit_note" title="${titles.title}" data-toggle="modal" data-target="#edit-note1"><i class="las la-pen mr-3"></i>Edit</a>
                            <a class="dropdown-item" data-extra-toggle="delete" title="${titles.title}" data-closest-elem=".card" href="#"><i class="las la-trash-alt mr-3"></i>Delete</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body rounded">
                <h4 class="card-title">${titles.title}</h4>
                <p class="mb-3 card-description short">${titles.slug_heading}</p>                                                            
            </div>
            <div class="card-footer">
                <div class="d-flex align-items-center justify-content-between note-text note-text-info">
                    <a href="#" data-toggle="modal" data-target="#new-note${index}"><i class="las la-eye mr-2 font-size-20"></i>View</a>
                    <a href="#" class=""><i class="las la-calendar mr-2 font-size-20"></i>${titles.created_at}</a>
                </div>
            </div>
        </div>
    </div>`;

            pinNotesColumnInnerHTML += `<div class="col-lg-12">
        <div class="table-responsive">
            <table class="table  tbl-server-info">
                <thead>
                    <tr class="ligth">
                        <th class="w-50" scope="col">Title</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <h4 class="mb-2">${titles.title} <a href="#" class="pin_content" data-toggle="tooltip"
                                                                        data-placement="top" pin="false" title="${titles.title}"
                                                                        data-original-title="pin content"><i
                                                                            class="las la-thumbtack mr-2"></i></a></h4>
                            <span>${titles.slug_heading}</span>
                        </td>
                        <td>
                        <img class="" src=${priorityURL} width="70" height="35">
                        </td>
                        <td>${titles.created_at}</td>
                        <td>
                            <div>
                                <a href="#" class="badge badge-${priorityMap[priority]} mr-3" data-toggle="modal" data-target="#test"><i class="las la-pen mr-0"></i></a>
                                <a href="#" class="badge badge-${priorityMap[priority]} mr-3" data-toggle="modal" data-target="#new-note${index}"><i class="las la-eye mr-0"></i></a>
                                <a href="#" class="badge badge-${priorityMap[priority]}" data-extra-toggle="delete" data-closest-elem="tr"><i class="las la-trash-alt mr-0"></i></a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`;
        }

        modalHTML += `<div class="modal fade" id="new-note${index}" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="popup text-left">
                                <div class="media align-items-top justify-content-between">
                                    <h3 class="mb-3">${titles.title}</h3>
                                    <div class="btn-cancel p-0" data-dismiss="modal"><i class="las la-times"></i></div>
                                </div>
                                <div class="content create-workform">
                                    ${titles.body}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;


        notesColumnInnerHTML += `<div class="col-lg-12">
        <div class="table-responsive">
            <table class="table  tbl-server-info">
                <thead>
                    <tr class="ligth">
                        <th class="w-50" scope="col">Title</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <h4 class="mb-2">${titles.title} <a href="#" class="pin_content" data-toggle="tooltip"
                                                                        data-placement="top" pin="true" title="${titles.title}"
                                                                        data-original-title="pin content"><i
                                                                            class="las la-thumbtack mr-2"></i></a></h4>
                            <span>${titles.slug_heading}</span>
                        </td>
                        <td>
                        <img class="" src=${priorityURL} width="70" height="35">
                        </td>
                        <td>${titles.created_at}</td>
                        <td>
                            <div>
                                <a href="#" class="badge badge-${priorityMap[priority]} mr-3" data-toggle="modal" data-target="#test"><i class="las la-pen mr-0"></i></a>
                                <a href="#" class="badge badge-${priorityMap[priority]} mr-3" data-toggle="modal" data-target="#new-note${index}"><i class="las la-eye mr-0"></i></a>
                                <a href="#" class="badge badge-${priorityMap[priority]}" data-extra-toggle="delete" data-closest-elem="tr"><i class="las la-trash-alt mr-0"></i></a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`;

        index += 1;
        titlesDict[titles.title] = titles
    }
    notesCard.innerHTML = notesCardInnerHTML;
    notesColumn.innerHTML = notesColumnInnerHTML;
    modal.innerHTML = modalHTML;
    pinNotesCard.innerHTML = pinNotesCardInnerHTML;
    pinNotesColumn.innerHTML = pinNotesColumnInnerHTML;

    $('[data-extra-toggle="delete"]').on('click', function (e) {
        const deleteTitle = $(this).attr('title')
        const closestElem = $(this).attr('data-closest-elem')
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-primary ml-2'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            showClass: {
                popup: 'animate__animated animate__zoomIn'
            },
            hideClass: {
                popup: 'animate__animated animate__zoomOut'
            }
        })
            .then((willDelete) => {
                if (willDelete.isConfirmed) {
                    fetch(`/blog/api/update_notes_title/${deleteTitle}/`, {

                        method: 'DELETE',

                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Token' + ' ' + getCookie('Token')
                        }
                    })
                        .then(response => {
                            if (response.status == 204) {
                                return data;
                            }
                            throw data;

                        })
                        .then(data => {
                            swalWithBootstrapButtons.fire({
                                title: 'Deleted!',
                                text: "Your note has been deleted.",
                                icon: 'success',
                                showClass: {
                                    popup: 'animate__animated animate__zoomIn'
                                },
                                hideClass: {
                                    popup: 'animate__animated animate__zoomOut'
                                }
                            }
                            ).then(() => {
                                if (closestElem == '.card') {
                                    $(this).closest(closestElem).parent().remove()
                                } else {
                                    $(this).closest(closestElem).remove()
                                }
                            })
                        });

                } else {
                    swalWithBootstrapButtons.fire({
                        title: "Your note is safe!",
                        showClass: {
                            popup: 'animate__animated animate__zoomIn'
                        },
                        hideClass: {
                            popup: 'animate__animated animate__zoomOut'
                        }
                    });
                }
            });
    })

    setupEventListeners(titlesDict);

    const pinLinks = document.querySelectorAll('.pin_content')
    pinLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const title = link.getAttribute('title')
            const pin = link.getAttribute('pin')
            var boolPin = (pin === 'true');

            console.log(Boolean(pin))
            fetch(`/blog/api/update_notes_title/${title}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Authorization': 'Token' + ' ' + getCookie('Token'),

                },
                body: JSON.stringify({ "pin_note": boolPin})
            })
        })
        })
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


document.addEventListener('DOMContentLoaded', function () {


    // Initial fetch and display of all titles
    const searchLinks = document.querySelectorAll('.search-title');
    searchLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            console.log(link)
            const inputId = link.getAttribute("input-id");
            console.log(inputId);
            searchInput = document.getElementById(inputId);
            console.log(searchInput.value);
            fetchRelatedTitles(searchInput.value, true);
        });
    });

    

    previousTitlesButton.addEventListener('click', function () {
        previousTitles();
    });
    fetchAllTitles();
});
