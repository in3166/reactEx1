const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://in:qlwl12@cluster0.uygpc.mongodb.net/Cluster0?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err))



app.get('/', (req, res) => res.send('hi'))

app.listen(port, () => console.log(`Listening ${port}!`))