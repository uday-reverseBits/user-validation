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
                                                
                                             <td>${elemet.userId} </td>
                                           <td> ${elemet.id}</td>
                                            <td> ${elemet.title}</td>
                                            <td> ${elemet.completed}</td>
                                            <td>
                                                <button type="button" class="btn btn-success btn-sm px-2"  id="editBtn" onclick="editRecord()">
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button type="button" class="btn btn-primary btn-sm px-2">
                                                    <i class="fa-solid fa-eye"></i>
                                                </button>
                                                <button type="button" class="btn btn-danger btn-sm px-2" onclick="deleteRecord()" >
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                            </tr> 
                        `;
        }
        placeholder.innerHTML = out;
    })









//for thr modal

document.querySelector("#form").addEventListener("submit", function (event) {
    event.preventDefault();
    submit();
});

function submit() {
    var formData = readFormData();
    fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            insertNewRecord(data);
            document.getElementById("form").reset();
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function readFormData() {
    return {
        userId: document.getElementById("userId").value,
        id: document.getElementById("id").value,
        title: document.getElementById("title").value,
        completed: document.getElementById("completed").value === "true"
    };
}

function insertNewRecord(data) {
    var tableBody = document.getElementById("data-output");


    var newRow = `
        <tr data-id="${data.id}">
           
            <td>${data.userId}</td>
            <td>${data.id}</td>
            <td>${data.title}</td>
            <td>${data.completed}</td>
            <td>
                <button type="button" class="btn btn-success btn-sm px-2 edit-btn" onclick="editRecord(${data.id})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm px-2 view-btn" onclick="viewRecord(${data.id})">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm px-2 delete-btn" onclick="deleteRecord(${data.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `;


    tableBody.innerHTML += newRow;


    updateCheckboxEvents();
}







function editRecord(id) {
    // alert("I am working")
    // window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });

    const row = document.querySelector(`tr[data-id="${id}"]`);
    const cells = row.getElementsByTagName("td");

    document.getElementById("userId").value = cells[0].textContent;
    document.getElementById("id").value = cells[1].textContent;
    document.getElementById("title").value = cells[2].textContent;
    document.getElementById("completed").value = cells[3].textContent;

    const submitBtn = document.getElementById("s-btn");
    submitBtn.value = "Update";
    submitBtn.onclick = function () {
        updateRecord(id);
    };
}

function updateRecord(id) {
    const formData = readFormData();

    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Update Success:", data);

            const row = document.querySelector(`tr[data-id="${id}"]`);
            const cells = row.getElementsByTagName("td");

            cells[0].textContent = data.userId;
            cells[1].textContent = data.id;
            cells[2].textContent = data.title;
            cells[3].textContent = data.completed;

            document.getElementById("form").reset();
            const submitBtn = document.getElementById("s-btn");
            submitBtn.value = "Submit";
            submitBtn.onclick = submit;
        })
        .catch(error => {
            console.error("Error:", error);
        });
}




function deleteRecord(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${authToken}`
            }
        })
            .then(response => {
                if (response.ok) {
                    const row = document.querySelector(`tr[data-id="${id}"]`);
                    row.remove();
                    console.log("Delete Success");
                } else {
                    throw new Error("Failed to delete");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
}

















































$(document).ready(function () {
    // Select/deselect all checkboxes
    $('#select_all').click(function () {
        if ($(this).is(':checked')) {
            $('.checkbox').prop('checked', true);
        } else {
            $('.checkbox').prop('checked', false);
        }
    });

    // If all checkboxes are selected, select the top checkbox
    $('.checkbox').click(function () {
        if ($('.checkbox:checked').length === $('.checkbox').length) {
            $('#select_all').prop('checked', true);
        } else {
            $('#select_all').prop('checked', false);
        }
    });
});