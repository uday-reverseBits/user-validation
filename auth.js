// for home.html

const authToken = localStorage.getItem("token");
if (!authToken) {
    alert("You are not logged in!");
    window.location.href = "index.html";
}


fetch("https://jsonplaceholder.typicode.com/todos")
    .then(function (response) {
        return response.json();
    })
    .then(function (elements) {
        let placeholder = document.getElementById("data-output");
        let out = "";

        for (let elemet of elements) {
            out += `
                        <tr>
                            <td style="border: 1px solid grey;">${elemet.userId} </td>
                            <td style="border: 1px solid grey;"> ${elemet.id}</td>
                            <td style="border: 1px solid grey;"> ${elemet.title}</td>
                            <td style="border: 1px solid grey;"> ${elemet.completed}</td>
                        </tr>   
                        `;
        }
        placeholder.innerHTML = out;
    })
