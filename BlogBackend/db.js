const mongoose = require('mongoose');
const mongURI = process.env.MONGO_URL;

const connectToMongo = () => {
    mongoose.connect(mongURI, { useNewUrlParser: true, useUnifiedTopology: true },
    )
        .then(() => console.log('connected'))
        .catch(e => console.log(e));
}


module.exports = connectToMongo;