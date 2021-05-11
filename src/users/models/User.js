class User {
    constructor(dbRes) {
        this._id = dbRes.id
        this.first_name = dbRes.first_name
        this.last_name = dbRes.last_name
        this.is_Active = dbRes.is_active
        this.categoryid = dbRes.categoryid
        this.email = dbRes.email
        this._paswword = dbRes.password
    }

    getInfo(idFlag = false) {
        const responseData = {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email
        }

        if (idFlag) responseData.id = this._id

        return responseData
    }

    getId() {
        return this._id
    }
}

module.exports = {User}
