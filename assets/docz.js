document.addEventListener('DOMContentLoaded', function(e) {
    const sidebar = document.querySelector('aside')
    const nav = document.querySelector('nav')
    const menu = document.querySelector('menu')
    const main = document.querySelector('main')

    const loader = new Image()
    loader.className = 'loading'
    loader.src = '/assets/loader.svg'

    loadDocument(location.hash.substr(1))
    window.onpopstate = () => loadDocument(location.hash.substr(1))

    menu.addEventListener('click', () => {
        sidebar.classList.toggle('slide')
    })
    fetch('/SIDEBAR.md').then(res => res.text()).then(res => {
        nav.innerHTML = marked(res)
        activeCurrentLink(location.hash.substr(1))
        addLinksClick()
    })

    function addLinksClick() {
        const links = sidebar.querySelectorAll('a')
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault()

                const url = this.getAttribute('href')
                loadDocument(url)
                history.pushState(null, '', '#' + url)
                sidebar.classList.toggle('slide')
            })
        })
    }

    function loadDocument(url) {
        activeCurrentLink(url)
        main.innerHTML = ''
        main.appendChild(loader)

        if (!url || url === '/') {
            url = '/README.md'
        }
        if (url.endsWith('.md')) {
            fetch(url).then(res => res.text()).then(res => {
                main.innerHTML = marked(res)
                main.classList.remove('with-frame')
            })
        } else {
            const frame = createFrameElement()
            frame.src = url.endsWith('/') ? url + 'index.html' : url
            frame.onload = () => loader.remove()
        }
    }

    function activeCurrentLink(url) {
        if (window.activedLink) {
            window.activedLink.classList.remove('actived')
        }
        const link = nav.querySelector(`a[href="${url}"]`)
        if (link) {
            link.classList.add('actived')
            window.activedLink = link
        }
    }

    function createFrameElement() {
        let iframe = document.querySelector('iframe')
        if (!iframe) {
            iframe = document.createElement('iframe')
            main.classList.add('with-frame')
            main.appendChild(iframe)
        }
        return iframe
    }
})
