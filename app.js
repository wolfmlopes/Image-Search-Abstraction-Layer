'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const googleImages = require('google-images')
const googleClient = new googleImages('003962465415375838159:ejj6zmgaz4i', 'AIzaSyAW8DiIAL0_ohMnW_Dt-mL45gbrEudiLS0')



//Express
const app = express()
app.use(express.static('public'))

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

//CORS
app.use(cors())

//Mongoose
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_DB, { useMongoClient: true })

//EJS
//app.set('view engine', 'ejs')
let lastedResults = []
function listLastedResults(result){
	lastedResults = result
}
app.use('/latest', function(req,res,next){


	let Searchs = require('./models/Searchs.model')
	Searchs.find().sort({'when': -1}).limit(3).exec(function(err, result){

		listLastedResults(result)
		
	})


let itens = lastedResults
res.json([{term: itens[0]['term'],when: itens[0]['when']},{term: itens[1]['term'],when: itens[1]['when']},{term: itens[2]['term'],when: itens[2]['when']}])

	return next()
})

app.use('/:search', function(req,res){

	let pageNumber = 1
	if(!isNaN(req.query['offset'])) pageNumber = req.query['offset']

	googleClient.search(req.params.search,{page: pageNumber})
    .then(images => {
	res.json({images})
    })
    let Searchs = require('./models/Searchs.model')
    let Search = new Searchs({term: req.params.search, when: new Date()})
    Search.save()

})


app.listen(process.env.PORT || 3000, function(){
	console.log('Server is running.')
})
