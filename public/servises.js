async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
   
     return response.json()

}

async function getData(url){
    const response = await fetch(url)

    return  response.json()
}

async function deleteData(url, data){
    const response = await fetch(url, {
        method: 'DELETE'
    })

    return response.json
}