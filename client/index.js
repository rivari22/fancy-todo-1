import {afterLogin, beforeLogin} from './routers.js'
const server = 'http://localhost:3000'

$(document).ready(() => {
    const token = localStorage.getItem('token');
    console.log(token ? `${token}, "Token tersedia / sudah login"` : `${token}, "Token tidak tersedia / blm login"`)
    if(token) {
        // landingPage.show()
        // register.hide()
        // login.hide()
        // $("#btn-nav-register").hide()
        // $("#btn-nav-login").hide()
        // $("#btn-nav-logout").show()
        afterLogin()
        renderListTodo()
    } else {
        // landingPage.show()
        // register.hide()
        // login.hide()
        // $("#btn-nav-register").show()
        // $("#btn-nav-login").show()
        // $("#btn-nav-logout").hide()
        beforeLogin()
    }
})

$("#home").on("click", () => {
    console.log("Ini ke home")
    $(".landing-page").show()
    $(".register").hide()
    $(".login").hide()
})

$("#btn-nav-register").on("click", () => {
    console.log("Ini ke register")
    $(".landing-page").hide()
    $(".register").show()
    $(".login").hide()
})

$(".btn-login-page").on("click", () => {
    console.log("Ini ke login")
    $(".landing-page").hide()
    $(".register").hide()
    $(".login").show()
})


//register user
$("#register-form").on("submit", (e) => {
    e.preventDefault()
    const first_name = $("#firstName-register").val()
    const last_name = $("#lastName-register").val()
    const email = $("#email-register").val()
    const password = $("#password-register").val()
    const birth_date = $("#birthDate-register").val()

    $.ajax({
        method: "POST",
        url: server+ "/register",
        data: { first_name, last_name, email, password, birth_date }
    })
    .done(res => {
        console.log(res)
        // localStorage.setItem("token", res);
        // sementara redirect ke login ketika berhasil
        $(".landing-page").hide()
        $(".register").hide()
        $(".login").show()
    })
    .fail(err => {
        console.log(err)
    })

})


// login user
$("#login-form").on("submit", (e) => {
    e.preventDefault()
    const email = $("#email-login").val()
    const password = $("#password-login").val()

    $.ajax({
        method: "POST",
        url: server+ "/login",
        data: { email, password }
    })
    .done(res => {
        console.log(res)
        const token = res.accessToken
        const UserId = res.id
        const fullName = res.name
        localStorage.setItem("token", token);
        localStorage.setItem("UserId", UserId);
        localStorage.setItem("fullName", fullName);
        // sementara redirect ke home
        afterLogin()
        renderListTodo()
    })
    .fail(err => {
        console.log(err)
    })
})

//logout user 
$("#btn-nav-logout").on("click", (e) => {
    e.preventDefault()
    localStorage.removeItem('token');
    localStorage.removeItem('UserId');
    localStorage.removeItem('fullName');
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    beforeLogin()
})

// oauth google 5500
function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This

    const id_token = googleUser.getAuthResponse().id_token;

    // const id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token)
    $.ajax({
        url: server + "/googleLogin",
        method: "POST",
        data: {
            access_token_google: id_token
        }
    })
    .done(res => {
        console.log(res, "ini token jwt dr controller google")
        localStorage.setItem("token", res);
        // sementara redirect ke home
        afterLogin()
    })
    .fail(err => console.log(err))
}


// add todo button
$("#btn-add-task").on("click", () => {
    $("#add-todos").show()
    $("#content").hide()
    $("#title").val("")
    $("#description").val("")
    $("#start-time").val("")
    $("#end-time").val("")
    $("#date").val("")
    $("#category").val("")
})

// add todo form
$("#add-todos-form").on("submit", (e) => {
    e.preventDefault()
    const UserIdFromToken = localStorage.getItem("UserId")
    const title = $("#title").val()
    const description = $("#description").val()
    const start = $("#start-time").val()
    const end = $("#end-time").val()
    const date = $("#date").val()
    const category = $("#category").val()
    const status = false
    const UserId = UserIdFromToken // perlu check ***
   
    const start_date = `${date}:${start}`
    const due_date = `${date}:${end}`
    const token = localStorage.getItem('token');

    $.ajax({
        method: "POST",
        url: server + "/todos",
        data: {
           title, description, start_date, due_date, category, status, UserId 
        },
        headers: {
            token
        }
    })
    .done(res => {
        remove()
        renderListTodo()
        afterLogin()
        console.log(res)
    })
    .fail(err => console.log(err))
})

//get list todo / render list todo
function renderListTodo(date) {
    const token = localStorage.getItem('token');
    if(date) {
        // console.log(date.slice(8))
        $.ajax({
            method: "GET",
            url: server + `/todos/date/${date}`,
            headers:{
                token
            }
        })
        .done(response => {
            remove()
            response.forEach(todo => {
                const start = new Date(todo.start_date).toISOString().split("T")[1].split(".")[0].slice(0,5)
                const end = new Date(todo.due_date).toISOString().split("T")[1].split(".")[0].slice(0,5)
                if(todo.category === "home" && todo.status === false) {
                    renderHomeSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else if(todo.category === "home" && todo.status === true) {
                    renderHomeSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else if(todo.category === "work" && todo.status === false) {
                    renderWorkSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else if(todo.category === "work" && todo.status === true) {
                    renderWorkSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else if(todo.category === "other" && todo.status === false) {
                    renderOtherSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else {
                    renderOtherSection(todo.title, todo.description, start, end, todo.status, todo.id)
                }
            })
    
        })
        .fail(err => console.log(err))
    }
    else {
        $.ajax({
            method: "GET",
            url: server + "/todos",
            headers: {
                token
            }
        })
        .done(response => {
            response.forEach(todo => {
                const start = new Date(todo.start_date).toISOString().split("T")[1].split(".")[0].slice(0,5)
                const end = new Date(todo.due_date).toISOString().split("T")[1].split(".")[0].slice(0,5)
                if(todo.category === "home" && todo.status === false) {
                    renderHomeSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else if(todo.category === "home" && todo.status === true) {
                    renderHomeSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else if(todo.category === "work" && todo.status === false) {
                    renderWorkSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else if(todo.category === "work" && todo.status === true) {
                    renderWorkSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else if(todo.category === "other" && todo.status === false) {
                    renderOtherSection(todo.title, todo.description, start, end, todo.status, todo.id)
                } else {
                    renderOtherSection(todo.title, todo.description, start, end, todo.status, todo.id)
                }
            })
    
        })
        .fail(err => console.log(err))

    }
}

function renderWorkSection(title, description, start, end, status, id){
    if(status === false) {
        $("#work-section-undone").append(`
        <div class="card rounded-manual remove-work-false" id="remove-work-false">
        <div class="card-body d-flex">
          <div class="line" style="border-right: 2px solid blue;"></div>
          <div class="checklist d-flex align-content-center mx-3">
              <div class="icons p-1 d-flex flex-column justify-content-between">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="btn-update-work bi bi-check btn-outline-primary rounded-circle bg-light rounded-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" class="btn-update-work"/>
                </svg>
                <input type="hidden" value="${status},${id}" />
                <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil btn-update-todos p-2 btn-outline-primary ml-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" class="btn-update-todos"/>
                </svg>
                <input type="hidden" value="${status},${id}" />
              </div>
          </div>
          <div class="list-content">
            <div class="title-content">
              <h5>${title}</h5>
            </div>
            <div class="detail-content">
              <p class="text-muted">${description}</p>
            </div>
            <div class="time">
              <span class="text-primary">${start} - ${end}</span>
            </div>
          </div>
        </div>
      </div>
        `)
    } else {
        $("#work-section-done").append(`
        <div class="card rounded-manual bg-info remove-work-true" id="remove-work-true">
        <div class="card-body d-flex">
          <div class="line" style="border-right: 2px solid blue;"></div>
          <div class="checklist d-flex align-content-center mx-3">
              <div class="icons p-1 d-flex flex-column justify-content-between">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="btn-update-work bi bi-check btn-outline-info rounded-circle bg-light rounded-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" class="btn-update-work"/>
                </svg>
                <input type="hidden" value="${status},${id}" />
                <svg width="2.3em" height="2.3em" viewBox="0 0 16 16" class="btn-outline-dark p-2 bi bi-trash-fill btn-delete-todos ml-3 rounded-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" class="btn-delete-todos"/>
                </svg>
                <input type="hidden" value="${status},${id}" />

              </div>
          </div>
          <div class="list-content">
            <div class="title-content">
              <h5>${title}</h5>
            </div>
            <div class="detail-content">
              <p class="text-muted">${description}</p>
            </div>
            <div class="time">
              <span class="text-dark">${start} - ${end}</span>
            </div>
          </div>
        </div>
      </div>
        `)
    }
}

function renderHomeSection(title, description, start, end, status, id){
    if(status === false){
        $("#home-section-undone").append(`
        <div class="card rounded-manual remove-home-false" id="remove-home-false">
        <div class="card-body d-flex">
        <div class="line" style="border-right: 2px solid #ffc107;"></div>
        <div class="checklist d-flex align-content-center mx-3">
            <div class="icons p-1 d-flex flex-column justify-content-between">
              <svg width="4em" height="4em" viewBox="0 0 16 16" class="btn-update-home bg-light rounded-circle  bi bi-check btn-outline-warning rounded-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" class="btn-update-home"/>
              </svg>
              <input type="hidden" value="${status},${id}" />
              <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil btn-update-todos p-2 btn-outline-warning ml-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" class="btn-update-todos"/>
            </svg>
            <input type="hidden" value="${status},${id}" />
            </div>
        </div>
        <div class="list-content">
          <div class="title-content">
            <h5>${title}</h5>
          </div>
          <div class="detail-content">
            <p class="text-muted">${description}</p>
          </div>
          <div class="time">
            <span class="text-warning">${start} - ${end}</span>
          </div>
        </div>
      </div>
      </div>
        `)
    } else {
        $("#home-section-done").append(`
        <div class="card rounded-manual bg-info remove-home-true" id="remove-home-true">
        <div class="card-body d-flex">
          <div class="line" style="border-right: 2px solid blue;"></div>
          <div class="checklist d-flex align-content-center mx-3">
              <div class="icons p-1 d-flex flex-column justify-content-between">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="btn-update-home bi bi-check btn-outline-info rounded-circle bg-light rounded-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" class="btn-update-home"/>
                </svg>
                <input type="hidden" value="${status},${id}" />
                <svg width="2.3em" height="2.3em" viewBox="0 0 16 16" class="btn-outline-dark p-2 bi bi-trash-fill btn-delete-todos ml-3 rounded-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" class="btn-delete-todos"/>
                </svg>
                <input type="hidden" value="${status},${id}" />
              </div>
          </div>
          <div class="list-content">
            <div class="title-content">
              <h5>${title}</h5>
            </div>
            <div class="detail-content">
              <p class="text-muted">${description}</p>
            </div>
            <div class="time">
              <span class="text-dark">${start} - ${end}</span>
            </div>
          </div>
        </div>
      </div>
        `)
    }
}

function renderOtherSection(title, description, start, end, status, id){
    if(status === false) {
        $("#other-section-undone").append(`
        <div class="card rounded-manual remove-other-false" id="remove-other-false">
        <div class="card-body d-flex">
          <div class="line" style="border-right: 2px solid #17a2b8;"></div>
          <div class="checklist d-flex align-content-center mx-3">
            <div class="icons p-1 d-flex flex-column justify-content-between">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="btn-update-other bi bi-check btn-outline-info rounded-circle bg-light p-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" class="btn-update-other"/>
                </svg>
                <input type="hidden" value="${status},${id}" />
                <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-pencil btn-update-todos p-2 btn-outline-info ml-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" class="btn-update-todos"/>
            </svg>
            <input type="hidden" value="${status},${id}" />
            </div>
          </div>
          <div class="list-content">
            <div class="title-content">
              <h5>${title}</h5>
            </div>
            <div class="detail-content">
              <p class="text-muted">${description}</p>
            </div>
            <div class="time">
              <span class="text-info">${start} - ${end}</span>
            </div>
          </div>
        </div>
      </div>
        `)
    } else {
        $("#other-section-done").append(`
        <div class="card rounded-manual bg-info remove-other-true" id="remove-other-true">
        <div class="card-body d-flex">
          <div class="line" style="border-right: 2px solid blue;"></div>
          <div class="checklist d-flex align-content-center mx-3">
              <div class="icons p-1 d-flex flex-column justify-content-between">
                <svg width="4em" height="4em" viewBox="0 0 16 16" class="bg-light rounded-circle bi bi-check btn-outline-info rounded-circle btn-update-other" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z" class="btn-update-other"/>
                </svg>
                <input type="hidden" value="${status},${id}" />
                <svg width="2.3em" height="2.3em" viewBox="0 0 16 16" class="btn-outline-dark p-2 bi bi-trash-fill btn-delete-todos ml-3 rounded-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" class="btn-delete-todos"/>
                </svg>
                <input type="hidden" value="${status},${id}" />
              </div>
          </div>
          <div class="list-content">
            <div class="title-content">
              <h5>${title}</h5>
            </div>
            <div class="detail-content">
              <p class="text-muted">${description}</p>
            </div>
            <div class="time">
              <span class="text-dark">${start} - ${end}</span>
            </div>
          </div>
        </div>
      </div>
        `)
    }
}

// button update status on home
$(document).on("click", ".btn-update-work", (e) => {
    e.preventDefault()
    const status = e.target.nextElementSibling.value.split(',')[0]
    const id = +e.target.nextElementSibling.value.split(',')[1]
    updateStatus(status, id)
})

// button update status on home
$(document).on("click", ".btn-update-home", (e) => {
    e.preventDefault()
    const status = e.target.nextElementSibling.value.split(',')[0]
    const id = +e.target.nextElementSibling.value.split(',')[1]
    updateStatus(status, id)
})


// button update status on other
$(document).on("click", ".btn-update-other", (e) => {
    e.preventDefault()
    const status = e.target.nextElementSibling.value.split(',')[0]
    const id = +e.target.nextElementSibling.value.split(',')[1]
    $("#other-section-undone").append(``)
    $("#other-section-done").append(``)
    updateStatus(status, id)
})


function remove() {
    $(".remove-other-false").remove()
    $(".remove-other-true").remove()
    $(".remove-home-false").remove()
    $(".remove-home-true").remove()
    $(".remove-work-false").remove()
    $(".remove-work-true").remove()
}

// updating status done / undone
function updateStatus(status,id) {
    const token = localStorage.getItem("token")
    $.ajax({
        method: "PATCH",
        headers: {
            token
        },
        data: {
            status
        },
        url: server+`/todos/${id}`
    })
    .done(response => {
        remove()
        renderListTodo()
    })
    .fail(err => console.log(err))
}

// choose by date / search by date
$("#form-date").on("submit", (e) => {
    e.preventDefault()   
    // const token = localStorage.getItem("token")
    const date = $("#pick-date").val()
    console.log(date)
    remove()
    renderListTodo(date)
})


// delete todos done
$(document).on("click", ".btn-delete-todos", e => {
  e.preventDefault()
  const token = localStorage.getItem("token")
  const id = +e.target.nextElementSibling.value.split(',')[1]
  console.log(id)
  $.ajax({
    method: "DELETE",
    url: server + `/todos/${id}`,
    headers: {
      token
    }
  })
  .done(response => {
    console.log(response)
    remove()
    renderListTodo()
  })
  .fail(err => console.log(err))
})

//update todos
$(document).on("click", ".btn-update-todos", e => {
  e.preventDefault()
  const token = localStorage.getItem("token")
  const id = +e.target.nextElementSibling.value.split(',')[1]
  // $("#update-todos").show()
  $.ajax({
    method: "GET",
    url: server + `/todos/${id}`,
    headers: {
        token
    }
  })
  .done(response => {
    renderUpdatePage(response)
    $(document).on("submit", "#update-todos-form", (e) => {
      e.preventDefault()
      const UserIdFromToken = localStorage.getItem("UserId")
      // const token = localStorage.getItem('token');
      const title = $("#title-edit").val()
      const description = $("#description-edit").val()
      const start = $("#start-time-edit").val()
      const end = $("#end-time-edit").val()
      const date = $("#date-edit").val()
      const category = $("#category-edit").val()
      const status = $("#status-edit").val()
      const UserId = UserIdFromToken // perlu check ***
    
      const start_date = `${date}:${start}`
      const due_date = `${date}:${end}`
      $.ajax({
        method: "put",
        url: server + `/todos/${id}`,
        data: {
           title, description, start_date, due_date, category, status, UserId 
        },
        headers: {
            token
        }
    })
    .done(res => {
        remove()
        renderListTodo()
        afterLogin()
    })
    .fail(err => console.log(err))
    })
  })
  .fail(err => console.log(err))
})

// render update todos page
function renderUpdatePage(data) {
  const date = new Date(data[0].start_date).toISOString().split("T")[0]
  const start = new Date(data[0].start_date).toISOString().split("T")[1].split(".")[0].slice(0,5)
  const end = new Date(data[0].due_date).toISOString().split("T")[1].split(".")[0].slice(0,5)
  $("#content").hide()
  $(".form-row-update").remove()
  $("#update-todos").show()
  $("#update-todos").append(`
    <div class="row justify-content-center align-items-center form-row-update">
    <div class="col">
      <div class="card rounded-manual">
        <div class="card-body ml-4 p-5">
          <h5 class="card-title font-weight-bold text-uppercase mb-4">Update Todo</h5>
          <div class="row">
            <div class="col d-sm-flex align-items-center">
              <img src="./assets/undraw_Add_user_re_5oib.svg" alt="add user" class="img-fluid">
            </div>
            <div class="col d-sm-flex justify-content-center">
              <form action="" id="update-todos-form">
                <div class="form-group">
                  <label for="title">Title :</label> <br>
                  <input type="text" name="" id="title-edit" class="form-control" value="${data[0].title}">
                </div>
                <div class="form-group">
                  <label for="description">description :</label> <br>
                  <input type="text" name="" id="description-edit" class="form-control" value="${data[0].description}">
                </div>
                <div class="form-group">
                  <label for="start-time">start time :</label> <br>
                  <select name="" id="start-time-edit">
                    <option value="01:00" ${start == "01:00" ? "selected" : null}>01:00</option>
                    <option value="02:00" ${start == "02:00" ? "selected" : null}>02:00</option>
                    <option value="03:00" ${start == "03:00" ? "selected" : null}>03:00</option>
                    <option value="04:00" ${start == "04:00" ? "selected" : null}>04:00</option>
                    <option value="05:00" ${start == "05:00" ? "selected" : null}>05:00</option>
                    <option value="06:00" ${start == "06:00" ? "selected" : null}>06:00</option>
                    <option value="07:00" ${start == "07:00" ? "selected" : null}>07:00</option>
                    <option value="08:00" ${start == "08:00" ? "selected" : null}>08:00</option>
                    <option value="09:00" ${start == "09:00" ? "selected" : null}>09:00</option>
                    <option value="10:00" ${start == "10:00" ? "selected" : null}>10:00</option>
                    <option value="11:00" ${start == "11:00" ? "selected" : null}>11:00</option>
                    <option value="12:00" ${start == "12:00" ? "selected" : null}>12:00</option>
                    <option value="13:00" ${start == "13:00" ? "selected" : null}>13:00</option>
                    <option value="14:00" ${start == "14:00" ? "selected" : null}>14:00</option>
                    <option value="15:00" ${start == "15:00" ? "selected" : null}>15:00</option>
                    <option value="16:00" ${start == "16:00" ? "selected" : null}>16:00</option>
                    <option value="17:00" ${start == "17:00" ? "selected" : null}>17:00</option>
                    <option value="18:00" ${start == "18:00" ? "selected" : null}>18:00</option>
                    <option value="19:00" ${start == "19:00" ? "selected" : null}>19:00</option>
                    <option value="20:00" ${start == "20:00" ? "selected" : null}>20:00</option>
                    <option value="21:00" ${start == "21:00" ? "selected" : null}>21:00</option>
                    <option value="22:00" ${start == "22:00" ? "selected" : null}>22:00</option>
                    <option value="23:00" ${start == "23:00" ? "selected" : null}>23:00</option>
                    <option value="24:00" ${start == "24:00" ? "selected" : null}>24:00</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="end-time">End time :</label> <br>
                  <select name="" id="end-time-edit">
                  <option value="01:00" ${end == "01:00" ? "selected" : null}>01:00</option>
                  <option value="02:00" ${end == "02:00" ? "selected" : null}>02:00</option>
                  <option value="03:00" ${end == "03:00" ? "selected" : null}>03:00</option>
                  <option value="04:00" ${end == "04:00" ? "selected" : null}>04:00</option>
                  <option value="05:00" ${end == "05:00" ? "selected" : null}>05:00</option>
                  <option value="06:00" ${end == "06:00" ? "selected" : null}>06:00</option>
                  <option value="07:00" ${end == "07:00" ? "selected" : null}>07:00</option>
                  <option value="08:00" ${end == "08:00" ? "selected" : null}>08:00</option>
                  <option value="09:00" ${end == "09:00" ? "selected" : null}>09:00</option>
                  <option value="10:00" ${end == "10:00" ? "selected" : null}>10:00</option>
                  <option value="11:00" ${end == "11:00" ? "selected" : null}>11:00</option>
                  <option value="12:00" ${end == "12:00" ? "selected" : null}>12:00</option>
                  <option value="13:00" ${end == "13:00" ? "selected" : null}>13:00</option>
                  <option value="14:00" ${end == "14:00" ? "selected" : null}>14:00</option>
                  <option value="15:00" ${end == "15:00" ? "selected" : null}>15:00</option>
                  <option value="16:00" ${end == "16:00" ? "selected" : null}>16:00</option>
                  <option value="17:00" ${end == "17:00" ? "selected" : null}>17:00</option>
                  <option value="18:00" ${end == "18:00" ? "selected" : null}>18:00</option>
                  <option value="19:00" ${end == "19:00" ? "selected" : null}>19:00</option>
                  <option value="20:00" ${end == "20:00" ? "selected" : null}>20:00</option>
                  <option value="21:00" ${end == "21:00" ? "selected" : null}>21:00</option>
                  <option value="22:00" ${end == "22:00" ? "selected" : null}>22:00</option>
                  <option value="23:00" ${end == "23:00" ? "selected" : null}>23:00</option>
                  <option value="24:00" ${end == "24:00" ? "selected" : null}>24:00</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="date" class="text-left">Date :</label> <br>
                  <input type="date" name="" id="date-edit" class="form-control" value="${date}">
                </div>
                <div class="form-group">
                  <label for="category" class="text-left">category :</label> <br>
                  <select name="category" id="category-edit">
                    <option value="work" ${data[0].category === "work" ? "selected" : null}>work</option>
                    <option value="home" ${data[0].category === "home" ? "selected" : null}>home</option>
                    <option value="other" ${data[0].category === "other" ? "selected" : null}>other</option>
                  </select>
                </div>
                <div class="form-group">
                  <input type="hidden" name="" id="status-edit" class="form-control" value="${data[0].status}">
                </div>
                <div class="form-group">
                  <input type="hidden" name="" id="UserId-edit" class="form-control" value="${data[0].UserId}">
                </div>
                <button type="button" class="btn btn-danger btn-cancel">Cancel</button>
                <button type="submit" class="btn btn-primary">Update</button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  `)
}

$(document).on("click", ".btn-cancel", (e) => {
  e.preventDefault()
  remove()
  renderListTodo()
  afterLogin()
})