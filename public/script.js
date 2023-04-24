const voc = document.querySelector('.vocabluary')
const form = document.querySelector('form')


    getData('/getAllFilles')
        .then((result) => {
            render(result)
        })
        .catch((err) => {
            console.log(err)
        })

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)

    const data = {
        ua: formData.get('ua'),
        eng: formData.get('eng'),
        short: formData.get('short'),
        long: formData.get('descr')
    }
    console.log(data)
    postData('/postWord', data)
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
})

voc.addEventListener('click', (e) =>{
    if (e.target.className == 'trash'){
        const id = e.target.parentElement.parentElement.id
        console.log(id)
        deletedDta(`/deleteWord/${id}`)
        .then((result) =>{
            console.log(result)
            e.target.parentElement.parentElement.remove()
        })
        .catch((err) =>{
            console.log(err)
        })
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