const voc = document.querySelector('.vocabluary')
const form = document.querySelector('form')
const btn = form.querySelector('button')
const uaInput = form.querySelector('.ua')
const engInput = form.querySelector('.eng')
const shortInput = form.querySelector('.short')
const longInput = form.querySelector('.long')

getData('/getAllFilles')
    .then((result) => {
        render(result)
    })
    .catch((err) => {
        console.log(err)
    })


voc.addEventListener('click', (e) => {
    const id = e.target.parentElement.parentElement.id
    if (e.target.className == 'trash') {
        deleteData(`/deleteWord/${id}`)
            .then((result) => {
                console.log(result)
                e.target.parentElement.parentElement.remove()
            })
            .catch((err) => {
                console.log(err)
            })
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
            })
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
        const div = document.createElement('div')
        div.className = 'vocabulary-item'
        div.id = [word['_id']]
        div.innerHTML = `
                <span>${word['ua']}</span>
                <span>${word['eng']}</span>
                <span>${word['short']}</span>
                <span class="actions">
                    <img class="trash" src="images/icon-trash.png"></img>
                    <img class="update" src="images/icon-update.png"></img>
                    <img class="view" src="images/icon-view.png"></img>
                </span>
        `
        voc.append(div)
    }
}


function postNewWord() {
    const formData = new FormData(form)

    postData('/postWord', getDataObject(formData))
        .then((result) => {
            console.log(result)
            form.reset()
        })
        .catch((err) => {
            console.log(err)
        })
}


function getDataObject(formData) {
    const data = {
        ua: formData.get('ua'),
        eng: formData.get('eng'),
        short: formData.get('short'),
        long: formData.get('descr')
    }

    return data
}

function updateWord() {
    const formData = new FormData(form)
    console.log(getDataObject(formData))
    updateData(`/updateword/${btn.id}`, getDataObject(formData))
        .then((result) => {
            console.log(result)
            form.reset()
            btn.innerText = 'send form'
            btn.className = ''
            btn.id = ''
           
        })
        .catch((err) => {
            console.log(err)
        })
}