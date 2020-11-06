document.addEventListener('DOMContentLoaded', async function(e) {
    let res = await fetch('/README.md')
    const main = document.querySelector('main')
    main.innerHTML = marked(await res.text())

    res = await fetch('/SIDEBAR.md')
    const menu = document.querySelector('menu')
    menu.innerHTML = marked(await res.text())

    const sidebar = document.querySelector('aside')
    const links = sidebar.querySelectorAll('a')
    links.forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault()

            let url = this.getAttribute('href')
            if (url.endsWith('.md')) {
                res = await fetch(url)
                main.innerHTML = marked(await res.text())
                main.classList.remove('with-frame')
                return
            }
            if (url.endsWith('/')) {
                url += 'index.html'
            }
            main.innerHTML = `<iframe src="${url}"></iframe>`
            main.classList.add('with-frame')
        })
    })
})
