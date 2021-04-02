const searchApi = 'https://api.github.com/search/code'
const searchKey = encodeURIComponent('border-radius: 19px')
const designPrice = 2e6

const nRepo = document.getElementById('repo') as HTMLInputElement
const nBubble = document.getElementById('bubble') as HTMLDivElement
const nResult = document.getElementById('result') as HTMLDivElement
const nNotify = document.getElementById('notify') as HTMLDivElement

const announce = (message: string) => {
  nResult.innerHTML = message
  nResult.classList.add('show')
}

const dismissAnnounce = () => {
  nResult.classList.remove('show')
}

const notify = Object.assign(
  (message: string) => {
    notify.nid && clearTimeout(notify.nid)
    nNotify.innerHTML = message
    nNotify.classList.add('show')
  },
  { nid: NaN }
)

const dismissNotify = () => {
  nNotify.classList.remove('show')
  notify.nid = undefined
}

const reqGithubApi = (url: string) =>
  new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          try {
            const body = xhr.responseText
            const data = JSON.parse(body)
            resolve(data)
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error('Request github api failed.'))
        }
      }
    }

    xhr.open('GET', url)
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json')
    xhr.send()
  })

const getValue = async () => {
  const { value: repo } = nRepo
  if (repo && /^\w+\/\w+/g.test(repo)) {
    const data = await reqGithubApi(`${searchApi}?q=${searchKey}+repo:${encodeURIComponent(repo)}`)
    return data?.items?.length || 0
  }

  return null
}

const onSearch = async () => {
  try {
    const result = await getValue()
    if (typeof result === 'number') {
      if (result > 0) {
        const worth = (result * designPrice).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })

        announce(`Your code is worth <b>${worth}</b>`)
      } else {
        announce('Your code is worthless')
      }
    } else {
      dismissAnnounce()
    }
  } catch (error) {
    notify(`Oops, ${error?.message || 'Something went wrong'}`)
  }
}

const onReset = () => {
  dismissAnnounce()
  dismissNotify()
}

const bubble = () => {
  if (nBubble.childNodes.length > 1000) {
    return
  }

  const nDollar = document.createElement('span') as HTMLSpanElement
  nDollar.classList.add('dollar')
  nDollar.style.fontSize = 20 + Math.random() * 40 + 'px'
  nDollar.style.left = Math.random() * window.innerWidth + 'px'
  nDollar.style.animationDuration = 1 + Math.random() * 3 + 's'
  nDollar.innerHTML = '&#36;'

  const remove = () => {
    nDollar.removeEventListener('animationend', remove)
    nBubble.removeChild(nDollar)
  }

  nDollar.addEventListener('animationend', remove)
  nBubble.appendChild(nDollar)
}

const init = () => {
  nRepo.addEventListener('change', onSearch)
  nRepo.addEventListener('keyup', onReset)
  setInterval(bubble, 30)
}

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    init()
  }
})
