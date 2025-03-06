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
                                                <th scope="row">
                                                <div class="form-check">
                                                    <input class="form-check-input checkbox" type="checkbox" value=""
                                                        id="flexCheckDefault1" checked />
                                                </div>
                                            </th>
                                             <td>${elemet.userId} </td>
                                           <td> ${elemet.id}</td>
                                            <td> ${elemet.title}</td>
                                            <td> ${elemet.completed}</td>
                                            <td>
                                                <button type="button" class="btn btn-success btn-sm px-2">
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button type="button" class="btn btn-primary btn-sm px-2">
                                                    <i class="fa-solid fa-eye"></i>
                                                </button>
                                                <button type="button" class="btn btn-danger btn-sm px-2">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                            </tr> 
                        `;
        }
        placeholder.innerHTML = out;
    })






























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