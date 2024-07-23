const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = 'your_twilio_account_sid';
const authToken = 'your_twilio_auth_token';
const client = new twilio(accountSid, authToken);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// ENDPOINT
app.post('/call', (req, res) => {
    const { from, to } = req.body;

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.dial(to);

    res.type('text/xml');
    res.send(twiml.toString());
});

app.post('/bridge', (req, res) => {
    const { from, to } = req.body;

    client.calls
        .create({
            url: 'http://your_server_url/call', // URL that Twilio will request when the call connects
            to: to,
            from: from
        })
        .then(call => {
            console.log(call.sid);
            res.send(`Call initiated with SID: ${call.sid}`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Failed to initiate call');
        });
});
