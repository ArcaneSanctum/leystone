class Query  {

    constructor() {
        this.query = {}
    }

    addField(fieldKey) {
        this.query.fieldKey = new QueryField();
    }



}


class QueryField {
    constructor() {
        this.value = {}
    }

    valueOf () {
        return this.value;
    }

    set greaterThan(field) {

    }
}

module.exports = {
    QueryBuilder
}