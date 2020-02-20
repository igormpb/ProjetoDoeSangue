require('./models/user')
const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks')
const session = require('express-session');
const mongoose = require('mongoose')
const User = mongoose.model('users')
const app = express();
//session

app.use(session({
    secret: 'blood',
    resave: true,
    saveUninitialized: true
}));

//configuração mongoose
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/doeSangue",{ useNewUrlParser: true,useUnifiedTopology: true }).then(()=>{
    console.log('servidor funcionado')
}).catch((err)=>{
    console.log(err)
})
//config do servidor
app.use(express.static('public'))
//template
nunjucks.configure('./',{express: app,
    noCache:true,})

//bodyparser 
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
//

app.get('/', (req,res)=>{
    
    User.find().sort({id:'desc'}).then((users)=>{
        res.render('index.html',{users:users})
    }).catch((err)=>{
        console.log(err)
    })

})
app.post('/',(req,res)=>{
    var erros = []
   const reqBlood = req.body.blood
    if(reqBlood != "O-" && reqBlood != "O+" && reqBlood != "B-" && reqBlood != "B+" 
    && reqBlood != "A-" && reqBlood != "A+" &&reqBlood != "AB-" && reqBlood != "AB+"){

    }else{
    const newDonor ={
        name: req.body.name,
        email:req.body.email,
        blood:req.body.blood
    }

    new User(newDonor).save().then(()=>{
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    })
}})
//servidor
const PORT = 3003;
app.listen(PORT,()=>{
    console.log('entrou!')
    
})