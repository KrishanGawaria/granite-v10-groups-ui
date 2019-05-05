var mongoose = require('mongoose')

var performaSchema = new mongoose.Schema({

  quantity : {
    type : Number
  },

  price_per_quantity : {
    type : Number
  },

  tax : {
    type : Number
  },

  total_amount : {
    type : Number
  }

})

var Performa = mongoose.model('Performa', performaSchema)

module.exports = Performa
