// $("#register").append("<h1>Hello</h1>") jquery added
const server = 'http://localhost:3000'
const landingPage = $(".landing-page")
const register = $(".register")
const login = $(".login")

$("#home").on("click", () => {
    console.log("Ini ke home")
    landingPage.show()
    register.hide()
    login.hide()
})

$("#btn-nav-register").on("click", () => {
    console.log("Ini ke register")
    landingPage.hide()
    register.show()
    login.hide()
})

$("#btn-nav-login").on("click", () => {
    console.log("Ini ke login")
    landingPage.hide()
    register.hide()
    login.show()
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
        landingPage.hide()
        register.hide()
        login.show()
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
        localStorage.setItem("token", res);
        // sementara redirect ke home
        landingPage.show()
        register.hide()
        login.hide()
    })
    .fail(err => {
        console.log(err)
    })
})
