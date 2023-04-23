const voc = document.querySelector('.vocabluary')
const form = document.querySelector('form')


getData('/getAllFilles')
    .then((result) => {
        render(result)
    })
    .catch((err) =>{
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
    .then((result) =>{
        console.log(result)
    })
    .catch((err) =>{
        console.log(err)
    })
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
                    <img src="images/icon-trash.png"></img>
                    <img src="images/icon-update.png"></img>
                    <img src="images/icon-view.png"></img>
                </span>
            
        `

        voc.append(div)
    }
}