const fs = require('fs');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({message: 'Hello from the server side!', app: 'Natours'});
// });
//
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...')
// });

const vacations = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/vacation-simple-2.json`)
);

app.get('/api/v1/vacations', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: vacations.length,
        data: {
            vacations
        }
    })
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});