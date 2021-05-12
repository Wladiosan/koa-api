class User {
    constructor(dbRes) {
        this._id = dbRes.id
        this.first_name = dbRes.first_name
        this.last_name = dbRes.last_name
        this.is_active = dbRes.is_active
        this.categoryid = dbRes.categoryid
        this.email = dbRes.email
        this._paswword = dbRes.password
        this.username = dbRes.username
    }

    getInfo(idFlag = false) {
        const responseData = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            is_active: this.is_active,
            categoryid: this.categoryid
        }

        if (idFlag) responseData.id = this._id

        return responseData
    }

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

    getQuickInfo(isFlag = false) {
        const responseDate = {
            email: this.email
        }
        return responseDate
    }


    getId() {
        return this._id
    }
}

module.exports = {User}
