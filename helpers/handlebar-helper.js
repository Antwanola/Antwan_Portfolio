const moment = require('moment')
module.exports = {

    currentUri:(currenturi)=>{
       if(currenturi == '/'){
           return true
       }
    },

    timeFormater:(date, format)=>{
        moment(date).format(format)
    },

select: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
    },

}