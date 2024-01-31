const express = require('express');
const path = require('path');
const port = 8000;


const db = require('./config/mongoose');
const Contact = require('./models/contact');

const app = express();

app.set('view engine', 'ejs');

// every teammates current working directory is different that's why we use __dirname
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded()); //middleware
app.use(express.static('assets'));


// // middlewar 1
//     app.use(function(request, respond, next){
//         request.myName = 'simran';
//         // console.log('middleware 1 called');
//         next();
//     });

// // middleware 2
//     app.use(function(request, respond, next){
//         console.log('My Name from MW2 ', request.myName);
//         // console.log('middleware 2 called');
//         next();
//     });


var contactList = [
    {
        name: 'Simran',
        phone: '111119999'
    },
    {
        name: 'Tony Stark',
        phone: '222228888'
    },
    {
        name: 'coding ninjas',
        phone: '333337777'
    }
]



// insted of switch cases for different webpage we use get() in ejs
app.get('/', function(request, respond){

            // console.log('from the get route controller',request.myName);
    // instead of end() we use send() in ejs
    // respond.send('<h1>cool, it is running or is it?</h1>');
    


    Contact.find({}, function(err, contacts){
        if(err){
            console.log('Error in featching contacts from db');
            return;
        }

        return respond.render('home', {
            title: 'Contact List',
            contact_list: contacts
        });
    });

});


app.get('/practice', function(request, respond){
    return respond.render('practice', {
        title: 'Let us play with ejs'
    });
})

app.post('/create-contact', async function(request, respond){
    // return respond.redirect('/practice');


// 1.
    // contactList.push({
    //     name: request.body.name,
    //     phone: request.body.phone
    // });
// 2. Same
    // contactList.push(request.body);

    let newContact = await Contact.create({
        name: request.body.name,
        phone: request.body.phone
    })

        console.log('********', newContact);
        return respond.redirect('back');

         // return respond.redirect('/');
    // return respond.redirect('back');
        // when url are longer and can't remember it we can use back to app in just going current back page 

});


// for deleting a contact
app.get('/delete-contact', function(request, respond){

//1.
    // console.log(request.params);
    // let phone = request.params.phone;
            // we did not need to declare app.use(express.urlencoded()); for params

// 2. same
    // console.log(request.query);
        // get query from url
   
   
   console.log("");
    //get the id from query in the url
    let id = request.query.id;
    //find the contact in the database using id and delete

    Contact.findByIdAndDelete(id, function(err){
        if(err){
            console.log('error in deleting an object from database');
            return;
        }
        return respond.redirect('back');
    });
    
        // Used below when not using database just using static files 
        // let contactIndex = contactList.findIndex(contact => contact.phone == phone);
        // if(contactIndex != -1){
        //     contactList.splice(contactIndex, 1);
        // }
        // return respond.redirect('back');
});


app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup!My Server is running on Port', port);
});