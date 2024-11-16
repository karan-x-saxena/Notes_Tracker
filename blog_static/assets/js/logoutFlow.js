function logout() {
    const logoutLinks = document.querySelectorAll('.logout')

    logoutLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            var cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                let eqPos = cookie.indexOf("=");
                let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }
            
            window.location.reload()
        })
    })
}

logout();