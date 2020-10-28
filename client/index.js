// $("#register").append("<h1>Hello</h1>") jquery added
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