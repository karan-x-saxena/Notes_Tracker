document.addEventListener('DOMContentLoaded', function () {
    const sidebarToggle = document.getElementById('iq-sidebar-toggle');
    const notesCard = document.getElementById('notes-cards');
    const notesColumn = document.getElementById('notes-column');
    const folder = document.getElementById('folder');
    const previousTitlesButton = document.getElementById('previous-title');
    const modal = document.getElementById('modal');
    const priorityMap = { Highest: "danger", High: "warning", Medium: "purple", Low: "info", Lowest: "success", medium: "purple" }
    let folderStack = []

    // Function to fetch and display all titles
    function fetchAllTitles() {
        const username = getCookie('username')

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
    function fetchRelatedTitles(title) {
        fetch(`/blog/api/notes_title/?title=${encodeURIComponent(title)}`, {
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
            fetchRelatedTitles(title)
        }

    }
    // Function to display main titles and their related subtitles
    function displayTitles(titlesData) {
        sidebarToggle.innerHTML = '';  // Clear the container
        notesCard.innerHTML = '';
        let notesCardInnerHTML = '';
        let notesColumnInnerHTML = '';
        let modalHTML = '';
        let index = 0;

        for (const titles of titlesData) {
            console.log(titles)
            const liElement = document.createElement('li');
            liElement.className = '';

            const aElement = document.createElement('a');
            aElement.href = '#';
            aElement.addEventListener('click', function (event) {
                event.preventDefault();
                fetchRelatedTitles(titles.title);
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

            // const subTitles = titles.sub_titles;

            // subTitles.forEach(subTitle => {
            //     const subLiElement = document.createElement('li');
            //     subLiElement.className = '';

            //     const subAElement = document.createElement('a');
            //     subAElement.href = '#';
            //     subAElement.className = 'svg-icon';
            //     subAElement.addEventListener('click', function(event) {
            //         event.preventDefault();
            //         fetchRelatedTitles(titles.title);
            //       });

            //     const subIElement = document.createElement('i');
            //     subIElement.innerHTML = `
            //     <svg width="20" class="svg-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            //         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            //     </svg>
            //     `;

            //     const subSpanElement = document.createElement('span');
            //     subSpanElement.innerText = subTitle;

            //     subAElement.appendChild(subIElement);
            //     subAElement.appendChild(subSpanElement);
            //     subLiElement.appendChild(subAElement);
            //     ulElement.appendChild(subLiElement);
            // });
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
                            <a href="#" class="dropdown-item edit-note1" data-toggle="modal" data-target="#edit-note1"><i class="las la-pen mr-3"></i>Edit</a>
                            <a class="dropdown-item" data-extra-toggle="delete" data-closest-elem=".card" href="#"><i class="las la-trash-alt mr-3"></i>Delete</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body rounded">
                <h4 class="card-title">${titles.title}</h4>
                <p class="mb-3 card-description short">${titles.slug_field}</p>                                                            
            </div>
            <div class="card-footer">
                <div class="d-flex align-items-center justify-content-between note-text note-text-info">
                    <a href="#" data-toggle="modal" data-target="#new-note${index}"><i class="las la-eye mr-2 font-size-20"></i>View</a>
                    <a href="#" class=""><i class="las la-calendar mr-2 font-size-20"></i>${titles.created_at}</a>
                </div>
            </div>
        </div>
    </div>`;
            
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
                            <h4 class="mb-2">${titles.title}</h4>
                            <span>${titles.slug_field}</span>
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
        }
        notesCard.innerHTML = notesCardInnerHTML;
        notesColumn.innerHTML = notesColumnInnerHTML;
        modal.innerHTML = modalHTML;

        $('[data-extra-toggle="delete"]').on('click', function (e) {
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
    previousTitlesButton.addEventListener('click', function () {
        previousTitles();
    });
    fetchAllTitles();
});
