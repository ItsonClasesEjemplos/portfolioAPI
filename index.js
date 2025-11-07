const app = require('./server.js');
const { port, host }= require('./config/generalConfig');
const {startMongoAtlas} = require('./services/dbService.js');

(async () => {
    try {
        await startMongoAtlas();
        app.listen(port, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
    }
})();

app.listen(port, ()=>{
    console.log(`http://${host}:${port}/`)
})