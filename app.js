const qrcode = require('qrcode');
const slugify = require('slugify');

let data = {
    "name": "ahmed", 
    "email": "ahmed@gmail.com", 
    "age": 21, 
    "gender": "male", 
    "id": 123
};

let stJson = JSON.stringify(data);
// console.log(data);

// qrcode.toString(stJson, function(err, result) {
//     if (err) return console.log(err);
//     console.log(result);
// });

// qrcode.toDataURL(stJson, function(err, result) {
//     console.log(result);
// });

const path = slugify(data.name, { lower: true });
// console.log(Path);
qrcode.toFile(`./${path}.png`, stJson, function(err, result) {
    if (err) 
        return console.log(err);
});
