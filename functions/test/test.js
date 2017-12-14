const https = require('https');

var assert = require('assert');
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});
describe('HTTPS', function () {
    describe('#get()', function () {
        it('should print city, latitude, longitutde to console', function (done) {
            const url =
                "https://maps.googleapis.com/maps/api/geocode/json?address=a34a343434a";
            https.get(url, res => {
                res.setEncoding("utf8");
                let body = "";
                res.on("data", data => {
                    body += data;
                }).on("end", () => {
                    let result = null;
                    try {
                        body = JSON.parse(body);
                        result = {
                            City: ` ${body.results[0].formatted_address} -`,
                            Latitude: ` ${body.results[0].geometry.location.lat} -`,
                            Longitude: ` ${body.results[0].geometry.location.lng}`
                        };
                    } catch (err) {
                        done(err)
                    }
                    const expected = {
                        City: ' Florence, Metropolitan City of Florence, Italy -',
                        Latitude: ' 43.7695604 -',
                        Longitude: ' 11.2558136'
                    }
                    assert.deepEqual(result, expected);
                    done();
                });
            }).on("error", (err) => {
                done(err);
            });
        });
    });
});