const voc = document.querySelector('.vocabluary')
const form = document.querySelector('form')
const btn = form.querySelector('button')
const uaInput = form.querySelector('.ua')
const engInput = form.querySelector('.eng')
const shortInput = form.querySelector('.short')
const longInput = form.querySelector('.long')

getData('/getAllFilles')
    .then((result) => render(result))
    .catch((err) => console.log(err))

voc.addEventListener('click', (e) => {
    const id = e.target.parentElement.parentElement.id

    if (e.target.className == 'trash') {
        deleteData(`/deleteWord/${id}`)
            .then(() => e.target.parentElement.parentElement.remove())
            .catch((err) => console.log(err))

    } else if (e.target.className = 'update') {
        getData(`/findOneWord/${id}`)
            .then((result) => {
                btn.innerText = 'update'
                btn.className = 'update'
                btn.id = id

                uaInput.value = result['ua']
                engInput.value = result['eng']
                shortInput.value = result['short']
                longInput.value = result['long']
            }).catch((err) => console.log(err))
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (btn.className == 'update') {
        console.log('update')
        updateWord()
    } else {
        postNewWord()
    }
})

function render(data) {
    for (const word of data) {
        getVocItem(word)
    }
}

function postNewWord() {
    const formData = new FormData(form)

    postData('/postWord', getDataObject(formData))
        .then((result) => {
            getVocItem(result)
            form.reset()
        })
        .catch((err) => console.log(err))
}

function getDataObject(formData) {
    // const randomId = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    const data = {
        // _id: randomId,
        ua: formData.get('ua'),
        eng: formData.get('eng'),
        short: formData.get('short'),
        long: formData.get('descr')
    }
    return data
}

function updateWord() {
    const formData = new FormData(form)

    updateData(`/updateword/${btn.id}`, getDataObject(formData))
        .then((result) => {
            const parent = document.getElementById(btn.id)
            form.reset()

            parent.innerHTML = getHtml(result)

            btn.innerText = 'send form'
            btn.className = ''
            btn.id = ''
        })
        .catch((err) => console.log(err))
}

function getVocItem(result) {
    const tr = document.createElement('tr')
    tr.className = 'vocabulary-item'
    tr.className = 'vocabulary-item'
    tr.id = [result['_id']]
    tr.innerHTML = getHtml(result)
    voc.append(tr)
}

function getHtml(result) {
    return `
            <td>${result['ua']}</td>
            <td>${result['eng']}</td>
            <td>${result['short']}</td>
            <td class="actions">
                <img class="trash" src="images/icon-trash.png"></img>
                <img class="update" src="images/icon-update.png"></img>
                <img class="view" src="images/icon-view.png"></img>
            </td>
    `
}