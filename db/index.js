const add = require('./add');
const del = require('./delete');
const edit = require('./edit');
const get = require('./get');

module.exports = {
    ...add,
    ...del,
    ...edit,
    ...get
}
