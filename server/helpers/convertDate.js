function convertDate(date) {
    let converted = new Date(date).toISOString().split("T")[0]
    return converted
}

module.exports = convertDate
