const app = require('./server.js');
const { port, host }= require('./config/generalConfig');
const {startMongoAtlas} = require('./services/dbService')



//startMongoAtlas();

app.listen(port, ()=>{
    console.log(`http://${host}:${port}/`)
})