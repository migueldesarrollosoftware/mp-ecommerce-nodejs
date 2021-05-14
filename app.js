var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 80
const path = require('path')
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales
mercadopago.configure({
  access_token: "APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439",
  integrator_id: 'dev_2e4ad5dd362f11eb809d0242ac130004',
});

//cambio

var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('assets'));


app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/img/:img',function (req, res) {

    res.sendFile(path.join(__dirname,`/assets/${req.params.img}`))
})

app.get('/success', function (req, res) {
    res.render('success',req.query);
});
app.get('/failure', function (req, res) {
    res.render('failure');
});
app.get('/pending', function (req, res) {
    res.render('pending');
});
app.post('/webhook',function (req, res) {
    console.log('WEBHOOK:')
    console.log('query')
    console.log(req.query)
    console.log('body')
    console.log(req.body)
    res.json({success:'ok'}).status(200)
})
app.get('/detail', function (req, res) {

    let { title,price,unit,img} = req.query 

    console.log(`------------------   title ${title} img ${img} price ${price}`) 
    // Create Preference
    let preference = {        
        items: [
            {
            id:1234,
            title: title,
            description:`Dispositivo móvil de Tienda e-commerce`,
            picture_url:`https://migueldesar-mp-commerce-nodejs.herokuapp.com/img/${img}`,
            unit_price: parseInt(price),
            quantity: 1,
            }

        ],
        external_reference: "miguel.ram.dev01@gmail.com",
        payer: {
            phone: {
                area_code: "52",
                number: 5549737300
            },
            address: {
                zip_code: "03940",
                street_name: "Insurgentes Sur",
                street_number: 1602
            },
            email: "test_user_46542185@testuser.com",
            identification: {
                number: "22334445",
                type: "DNI"
            },
            name: "Lalo",
            surname: "Landa",
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: "diners"
                },
            ],
            excluded_payment_types: [
                {
                    id: "atm"
                }
            ],
            installments: 6
        },
        back_urls: {
            success: `https://migueldesar-mp-commerce-nodejs.herokuapp.com/success`,
            failure: `https://migueldesar-mp-commerce-nodejs.herokuapp.com/failure`,
            pending: `https://migueldesar-mp-commerce-nodejs.herokuapp.com/pending`,
        },
        auto_return: "approved",
        notification_url:`https://migueldesar-mp-commerce-nodejs.herokuapp.com/webhook`
    }
    mercadopago.preferences.create(preference)
        .then(function(response){
    // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        console.log("ID PREFERENCIA"+response.body.id)
        init_point = response.body.init_point 
        res.render('detail', {title,price,unit,img,init_point});
    }).catch(function(error){
        console.log(error);
    });

});


app.listen(port,"172.26.13.95");

