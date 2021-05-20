const moment = require('moment')
module.exports = {

    timeFormater:(date, format)=>{
        moment(date).format(format)
    },

select: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
    },

}