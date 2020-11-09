document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelectorAll('.gallery a')
    gallery.forEach(item => {
        item.style.transform = `rotate(${randomBetween(-30, 30)}deg)`
        item.style.top = randomBetween(0, 70) + '%'
        item.style.left = randomBetween(0, 70) + '%'
    })

})

function randomBetween(n, m) {
    return Math.round(Math.random() * (m - n + 1) + n)
}
