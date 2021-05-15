class User {
    constructor(dbRes) {
        this._id = dbRes.id
        this._first_name = dbRes.first_name
        this._last_name = dbRes.last_name
        this._email = dbRes.email
        this._username = dbRes.username
        this._paswword = dbRes.password
        this._is_admin = dbRes.is_admin
        this._category = dbRes.category
        this._gender = dbRes.gender
        this._photo = dbRes.photo
        this._country = dbRes.country
        this._stack = dbRes.stack
        this._phone = dbRes.phone
        this._rate = dbRes.rate
    }

    getInfo(idFlag) {
        const responseData = {
            first_name: this._first_name,
            last_name: this._last_name,
            email: this._email,
            username: this._username,
            is_admin: this._is_admin,
            category: this._category,
            gender: this._gender,
            photo: this._photo,
            country: this._country,
            stack: this._stack,
            phone: this._phone,
            rate: this._rate,
        }

        if (idFlag) responseData.id = this._id

        return responseData
    }

    /*getInfo(idFlag = false) {
        const responseData = {
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name
        }

        if (idFlag) responseData.id = this._id

        return responseData
    }*/

    getInfoUser(idFlag = false) {
        const responseDate = {
            email: this.email,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
        }
        if (idFlag) responseDate.id = this.id
        return responseDate
    }

    getInfoAdmin(idFlag = false) {
        const responseData = {
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            country: this.country,
            status: this.status
        }

        if (idFlag) responseData.id = this._id

        return responseData
    }

    getId() {
        return this._id
    }
}

module.exports = {User}
