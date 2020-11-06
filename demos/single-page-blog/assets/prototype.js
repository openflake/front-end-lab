window.$ = function(selector) {
  selector = selector.replace('/\n/mg', '').trim()
  if (selector.indexOf('<') === 0) {
    let div = document.createElement('div')
    div.innerHTML = selector
    return div.childNodes[0]
  } else {
    return document.querySelector(selector)
  }
}

window.extend = function(to, from) {
  Object.keys(from).forEach(function(key) {
    to[key] = from[key]
  })
  return to
}

const domMethods = {
  isElement: function() {
    return this.nodeType === 1
  },

  isText: function() {
    return this.nodeType === 3
  },

  isScript: function() {
    return this.tagName === 'SCRIPT'
  },

  val: function() {
    if (this.value) {
      this.value = this.value.trim()
      return this.value
    }
  },

  before: function(node) {
    if (this.parentNode) {
      this.parentNode.insertBefore(node, this)
    }
  },

  remove: function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  },

  replace: function(node) {
    if (this.parentNode) {
      this.parentNode.replaceChild(node, this)
    }
  },

  prev: function() {
    return this.previousElementSibling
  },

  next: function() {
    return this.nextElementSibling
  },

  attrs: function() {
    if (this.isElement() && this.hasAttributes()) {
      return Array.prototype.slice.call(this.attributes)
    }
  },

  addClass: function(name) {
    this.classList.add(name)
    return this
  },

  removeClass: function(name) {
    this.classList.remove(name)
  },

  on: function(event, fn) {
    this.addEventListener(event, fn)
  },

  off: function(event, fn) {
    this.removeEventListener(event, fn)
  },

  tap: function(fn) {
    this.on('click', fn)
  },

  show: function() {
    let temp = this.appendChild(document.createElement(this.tagName))
    this.style.display = getComputedStyle(temp, false)['display']
    temp.remove()
  },

  hide: function() {
    this.style.display = 'none'
  }
}

extend(Document.prototype, domMethods)
extend(DocumentFragment.prototype, domMethods)
extend(Element.prototype, domMethods)
extend(Text.prototype, domMethods)
extend(Comment.prototype, domMethods)
