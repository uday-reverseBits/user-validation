// for home.html

const authToken = localStorage.getItem("token");
if (!authToken) {
    alert("You are not logged in!");
    window.location.href = "index.html";
}

const editModal = new bootstrap.Modal(document.getElementById('editModal'));
let currentEditId = null;
let isAddMode = false;

fetch("https://jsonplaceholder.typicode.com/todos")
    .then(function (response) {
        return response.json();
    })
    .then(function (elements) {
        let placeholder = document.getElementById("data-output");
        let out = "";

        for (let element of elements) {
            out += `
                <tr data-id="${element.id}">
                    <td>${element.userId}</td>
                    <td>${element.id}</td>
                    <td>${element.title}</td>
                    <td>${element.completed}</td>
                    <td>
                        <button type="button" class="btn btn-success btn-sm px-2" onclick="editRecord(${element.id})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm px-2" onclick="deleteRecord(${element.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        }
        placeholder.innerHTML = out;
    });

function showAddModal() {
    isAddMode = true;
    document.getElementById("editModalLabel").textContent = "Add New Record";
    document.getElementById("editSubmitBtn").textContent = "Add Record";
    document.getElementById("editForm").reset();
    editModal.show();
}

document.getElementById("editSubmitBtn").addEventListener("click", function () {
    if (isAddMode) {
        addNewRecord();
    } else if (currentEditId) {
        updateRecord(currentEditId);
    }
});

document.getElementById("editResetBtn").addEventListener("click", function () {
    document.getElementById("editForm").reset();
});






function addNewRecord() {
    const formData = {
        userId: document.getElementById("editUserId").value,
        id: document.getElementById("editId").value,
        title: document.getElementById("editTitle").value,
        completed: document.getElementById("editCompleted").value === "true"
    };

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
            console.log("Add Success:", data);
            var tableBody = document.getElementById("data-output");
            var newRow = `
                <tr data-id="${data.id}">
                    <td>${data.userId}</td>
                    <td>${data.id}</td>
                    <td>${data.title}</td>
                    <td>${data.completed}</td>
                    <td>
                        <button type="button" class="btn btn-success btn-sm px-2" onclick="editRecord(${data.id})">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm px-2" onclick="deleteRecord(${data.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
            tableBody.insertAdjacentHTML('beforeend', newRow);

            editModal.hide();
            document.getElementById("editForm").reset();
            isAddMode = false;
            document.getElementById("editModalLabel").textContent = "Edit Record";
            document.getElementById("editSubmitBtn").textContent = "Save changes";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to add the record. Please try again.");
        });
}

function editRecord(id) {
    isAddMode = false;
    currentEditId = id;
    document.getElementById("editModalLabel").textContent = "Edit Record";
    document.getElementById("editSubmitBtn").textContent = "Save changes";

    const row = document.querySelector(`tr[data-id="${id}"]`);
    const cells = row.getElementsByTagName("td");

    document.getElementById("editUserId").value = cells[0].textContent;
    document.getElementById("editId").value = cells[1].textContent;
    document.getElementById("editTitle").value = cells[2].textContent;
    document.getElementById("editCompleted").value = cells[3].textContent.toLowerCase() === 'true' ? 'true' : 'false';

    editModal.show();
}

function updateRecord(id) {
    const formData = {
        userId: document.getElementById("editUserId").value,
        id: document.getElementById("editId").value,
        title: document.getElementById("editTitle").value,
        completed: document.getElementById("editCompleted").value === "true"
    };

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

            editModal.hide();
            document.getElementById("editForm").reset();
            currentEditId = null;
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to update the record. Please try again.");
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
                    if (row) {
                        row.remove();
                        console.log("Delete Success");
                    }
                } else {
                    throw new Error("Failed to delete");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Failed to delete the record. Please try again.");
            });
    }
}

const oldForm = document.querySelector("#form");
if (oldForm) {
    oldForm.remove();
}

$(document).ready(function () {
    $('#select_all').click(function () {
        if ($(this).is(':checked')) {
            $('.checkbox').prop('checked', true);
        } else {
            $('.checkbox').prop('checked', false);
        }
    });

    $('.checkbox').click(function () {
        if ($('.checkbox:checked').length === $('.checkbox').length) {
            $('#select_all').prop('checked', true);
        } else {
            $('#select_all').prop('checked', false);
        }
    });
});