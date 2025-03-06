function editBtn() {
    fetch("https://jsonplaceholder.typicode.com/todos", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

        })
    }).then(res => {
        return res.json()
    })
        .then(data => console.log(data))
        .catch(error => console.log('ERROR'))
}