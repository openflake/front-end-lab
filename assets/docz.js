document.addEventListener('DOMContentLoaded', function(e) {
    const sidebar = document.querySelector('aside')
    const nav = document.querySelector('nav')
    const menu = document.querySelector('menu')
    const main = document.querySelector('main')

    const loader = new Image()
    loader.className = 'loading'
    loader.src = '/assets/loader.svg'

    menu.addEventListener('click', toggleSidebar)
    fetch('/README.md').then(res => res.text()).then(res => {
        main.innerHTML = marked(res)
    })
    fetch('/SIDEBAR.md').then(res => res.text()).then(res => {
        nav.innerHTML = marked(res)
        addLinksClick()
    })

    function addLinksClick() {
        const links = sidebar.querySelectorAll('a')
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault()
                toggleSidebar()
                main.innerHTML = ''
                main.appendChild(loader)

                let url = this.getAttribute('href')
                if (url.endsWith('/')) {
                    url += 'index.html'
                }
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

    function createFrame() {
        let iframe = document.querySelector('iframe')
        if (!iframe) {
            iframe = document.createElement('iframe')
            main.classList.add('with-frame')
            main.appendChild(iframe)
        }
        return iframe
    }

    function toggleSidebar() {
        if (sidebar.isOpen) {
            sidebar.isOpen = false
            sidebar.style.left = '-300px'
        } else {
            sidebar.isOpen = true
            sidebar.style.left = 0
        }
    }
})
