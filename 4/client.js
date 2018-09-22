const http = require("https"),
    events = require("events"),
    R = require('ramda'),
    hostname = "services.odata.org",
    port = 443,
    method = 'POST',
    path = '/v4/TripPinServiceRW/People'
    data = JSON.stringify({
        UserName: 'lewisblack',
        FirstName: 'Lewis',
        LastName: 'Black',
        Emails: [
            'lewisblack@example.com'
        ],
        AddressInfo: [
            {
                Address: '187 Suffolk Ln.',
                City: {
                    CountryRegion: 'United States',
                    Name: 'Boise',
                    Region: 'ID'
                }
            }
        ],
        Gender: 'Male'
    }),
    headers = {
        'OData-Version': '4.0',
        'OData-MaxVersion': '4.0',
        'Content-Type': 'application/json',
        'Content-Length': data.length
    };

let options = {
    hostname,
    path,
    port,
    method,
    headers
};

const req = http.request(options, response => {
    let eventEmitter = new events.EventEmitter(),
        body = '';

    if ([300, 301, 302].includes(response.statusCode)) {
        options = R.set(R.lensProp('path'), response.headers.location, options);

        const req = http.request(options, res => {
            eventEmitter.emit('scream', res);
        }).on('error', err => {
            console.error('ERROR: ' + err.message);
        });

        req.write(data);
        req.end();
    } else {
        eventEmitter.emit('scream', response);
    }

    eventEmitter.on('scream', response => {
        response.on('data', chunk => {
            body += chunk;
        });

        response.on('end', () => {
            console.log(JSON.parse(body));
        });
    });
});

req.on('error', err => {
    console.error('ERROR: ' + err.message);
});

req.write(data);
req.end();
