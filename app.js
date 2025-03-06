// Main JS file for the Todo management system

// Auth check
const authToken = localStorage.getItem("token");
if (!authToken) {
    alert("You are not logged in!");
    window.location.href = "index.html";
}

// API URL
const API_URL = "https://jsonplaceholder.typicode.com/todos";

// Load data on page load
document.addEventListener('DOMContentLoaded', loadData);

// Function to load data from API
function loadData() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(elements => {
            displayData(elements);
            addEventListeners();
        })
        .catch(error => {
            console.error("Failed to fetch data:", error);
            document.getElementById("data-output").innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Failed to load data. Please try again later.
                    </td>
                </tr>
            `;
        });
}

// Function to display data in table
function displayData(elements) {
    let placeholder = document.getElementById("data-output");
    let out = "";

    for (let element of elements) {
        out += `
            <tr data-id="${element.id}">
                <th scope="row">
                    <div class="form-check">
                        <input class="form-check-input checkbox" type="checkbox" value=""
                            id="checkbox-${element.id}" />
                    </div>
                </th>
                <td class="userId-cell">${element.userId}</td>
                <td class="id-cell">${element.id}</td>
                <td class="title-cell">${element.title}</td>
                <td class="completed-cell">${element.completed}</td>
                <td>
                    <button type="button" class="btn btn-success btn-sm px-2 edit-btn">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm px-2 view-btn">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-danger btn-sm px-2 delete-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
    }
    placeholder.innerHTML = out;
}

// Add event listeners to buttons
function addEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', handleEditClick);
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDeleteClick);
    });

    // View buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', handleViewClick);
    });

    // Form submission
    document.getElementById('form').addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit();
    });

    // Add button to the page (since it's missing in your HTML)
    const addButtonHTML = `
        <button id="add-btn" class="btn btn-primary my-3">
            <i class="fa-solid fa-plus"></i> Add New Todo
        </button>
    `;
    document.querySelector('h1').insertAdjacentHTML('afterend', addButtonHTML);
    document.getElementById('add-btn').addEventListener('click', showAddForm);

    // Setup checkbox handlers
    setupCheckboxHandlers();
}

// Handle edit button click
function handleEditClick(e) {
    const row = e.currentTarget.closest('tr');
    const id = row.dataset.id;

    // Get current values
    const userId = row.querySelector('.userId-cell').textContent;
    const title = row.querySelector('.title-cell').textContent;
    const completed = row.querySelector('.completed-cell').textContent;

    // Populate form
    document.getElementById('userId').value = userId;
    document.getElementById('id').value = id;
    document.getElementById('title').value = title;
    document.getElementById('completed').value = completed;

    // Change submit button text
    const submitBtn = document.getElementById('s-btn');
    submitBtn.value = 'Update';
    submitBtn.setAttribute('data-mode', 'edit');
    submitBtn.setAttribute('data-id', id);

    // Show form (you might want to improve this with a modal)
    document.querySelector('fieldset').style.display = 'block';
}

// Handle delete button click
function handleDeleteClick(e) {
    const row = e.currentTarget.closest('tr');
    const id = row.dataset.id;

    if (confirm(`Are you sure you want to delete todo #${id}?`)) {
        deleteItem(id);
    }
}

// Handle view button click
function handleViewClick(e) {
    const row = e.currentTarget.closest('tr');
    const id = row.dataset.id;

    // Fetch and show details
    fetch(`${API_URL}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(`
                Todo Details:
                User ID: ${data.userId}
                ID: ${data.id}
                Title: ${data.title}
                Completed: ${data.completed}
            `);
        })
        .catch(error => {
            console.error("Failed to fetch item details:", error);
            alert("Failed to load item details. Please try again.");
        });
}

// Show add form
function showAddForm() {
    // Reset form
    document.getElementById('form').reset();

    // Change submit button text
    const submitBtn = document.getElementById('s-btn');
    submitBtn.value = 'Add';
    submitBtn.setAttribute('data-mode', 'add');
    submitBtn.removeAttribute('data-id');

    // Show form
    document.querySelector('fieldset').style.display = 'block';
}

// Handle form submission (used for both add and edit)
function handleFormSubmit() {
    const userId = document.getElementById('userId').value;
    const title = document.getElementById('title').value;
    const completed = document.getElementById('completed').value;

    const submitBtn = document.getElementById('s-btn');
    const mode = submitBtn.getAttribute('data-mode');

    if (mode === 'edit') {
        const id = submitBtn.getAttribute('data-id');
        updateItem(id, userId, title, completed);
    } else {
        addItem(userId, title, completed);
    }
}

// Add new item via POST
function addItem(userId, title, completed) {
    // Prepare data
    const data = {
        userId: parseInt(userId),
        title: title,
        completed: completed === 'true',
    };

    // Send POST request
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(`New todo added with ID: ${data.id}`);

            // Refresh data (in a real app, you might just add the new row)
            loadData();

            // Hide form
            document.querySelector('fieldset').style.display = 'none';
        })
        .catch(error => {
            console.error("Failed to add item:", error);
            alert("Failed to add item. Please try again.");
        });
}

// Update item via PUT
function updateItem(id, userId, title, completed) {
    // Prepare data
    const data = {
        id: parseInt(id),
        userId: parseInt(userId),
        title: title,
        completed: completed === 'true',
    };

    // Send PUT request
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert(`Todo #${id} updated successfully`);

            // Refresh data
            loadData();

            // Hide form
            document.querySelector('fieldset').style.display = 'none';
        })
        .catch(error => {
            console.error("Failed to update item:", error);
            alert("Failed to update item. Please try again.");
        });
}

// Delete item via DELETE
function deleteItem(id) {
    // Send DELETE request
    fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert(`Todo #${id} deleted successfully`);

            // Remove row from table
            document.querySelector(`tr[data-id="${id}"]`).remove();
        })
        .catch(error => {
            console.error("Failed to delete item:", error);
            alert("Failed to delete item. Please try again.");
        });
}

// Setup checkbox handlers
function setupCheckboxHandlers() {
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
}

// Make the submit function globally available for the onclick in your HTML
window.submit = handleFormSubmit;