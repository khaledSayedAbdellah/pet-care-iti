const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://khaled_2020:khaled_2020@cluster0.nhym7.mongodb.net/firstDbMongo?retryWrites=true&w=majority',
 {useNewUrlParser: true})
 .then( () => {
    console.log('Connected to database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
});
