document.addEventListener('DOMContentLoaded', function(e) {
    const sidebar = document.querySelector('aside')
    const nav = document.querySelector('nav')
    const menu = document.querySelector('menu')
    const main = document.querySelector('main')

    function toggleSidebar() {
        if (sidebar.isOpen) {
            sidebar.isOpen = false
            sidebar.style.left = '-300px'
        } else {
            sidebar.isOpen = true
            sidebar.style.left = 0
        }
    }

    function createFrame() {
        let iframe = document.querySelector('iframe')
        if (!iframe) {
            iframe = document.createElement('iframe')
            main.classList.add('with-frame')
            main.appendChild(iframe)
        }
        return iframe
    }

    function createLoader() {
        const loader = new Image()
        loader.className = 'loading'
        loader.src = '/assets/loader.svg'
        main.innerHTML = ''
        main.appendChild(loader)
        return loader
    }

    function addLinksClick() {
        const links = sidebar.querySelectorAll('a')
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault()
                toggleSidebar()

                let url = this.getAttribute('href')
                if (url.endsWith('/')) {
                    url += 'index.html'
                }
                const loader = createLoader()
                if (url.endsWith('.md')) {
                    fetch(url).then(res => res.text()).then(res => {
                        main.innerHTML = marked(res)
                        main.classList.remove('with-frame')
                    })
                } else {
                    const frame = createFrame()
                    frame.src = url
                    frame.onload = () => loader.remove()
                }
            })
        })
    }

    menu.addEventListener('click', toggleSidebar)
    fetch('/README.md').then(res => res.text()).then(res => {
        main.innerHTML = marked(res)
    })
    fetch('/SIDEBAR.md').then(res => res.text()).then(res => {
        nav.innerHTML = marked(res)
        addLinksClick()
    })
})
