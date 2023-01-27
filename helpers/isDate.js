const dayJS = require('dayjs');
const isDate = (value, {req, location, path}) => {


    if (!value) return false;

    const date = dayJS(value);
    if (date.isValid()) {
        return true;
    }

}


module.exports = {
    isDate
}