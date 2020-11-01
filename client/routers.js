function afterLogin() {
    $("#landing-page").hide()
    $(".register").hide()
    $(".login").hide()
    $("#btn-nav-register").hide()
    $("#btn-nav-login").hide()
    $("#btn-nav-logout").show()
    $("#content").show()
    $("#header").hide()
    $("#update-todos").hide()
    $("#add-todos").hide()
}

function beforeLogin() {
    $(".landing-page").show()
    $(".register").hide()
    $(".login").hide()
    $("#btn-nav-register").show()
    $("#btn-nav-login").show()
    $("#btn-nav-logout").show()
    $("#content").hide()
    $("#header").show()

}

export { afterLogin, beforeLogin }