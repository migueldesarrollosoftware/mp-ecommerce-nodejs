var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000
const mercadopago = require('mercadopago')

mercadopago.configure({
    access_token: 'PROD_ACCESS_TOKEN'
});


  

var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    // Create Preference
    let preference = {
        items: [
        {
            title: 'Mi producto',
            unit_price: 100,
            quantity: 1,
        }
        ]
    };
    
    mercadopago.preferences.create(preference)
    .then(function(response){
    // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        global.id = response.body.id;
    }).catch(function(error){
        console.log(error);
    });
    
    res.render('detail', req.query);
});

app.listen(port);