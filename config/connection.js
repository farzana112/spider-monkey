// const mongoose = require('mongoose');
// mongoose.set('strictQuery', false);
// module.exports.connect = ()=>{
//     mongoose.connect(`${process.env.URI}`, { useNewUrlParser: true, useUnifiedTopology: true})
// .then(()=>{
//   console.log('Database connected');
// })
// .catch((error) => {
//     console.log(error);
// });

// }

const mongoose = require('mongoose')

const connectDB = (url) => {
    return mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
}

module.exports = connectDB








