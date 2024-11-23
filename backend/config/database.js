const mongoose = require("mongoose");

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlparser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`mongo is connected to the host:${con.connection.host}`)
    })

}

module.exports = connectDatabase; 