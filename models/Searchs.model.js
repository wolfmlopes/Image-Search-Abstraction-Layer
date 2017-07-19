'use strict'
const mongoose = require('mongoose')
let Schema = mongoose.Schema
let searchsSchema = new Schema({
	term: String,
	when: Date,
})

module.exports = mongoose.model('searchs', searchsSchema)
