const express = require('express');
const qrcode = require('qrcode');

let data = {
    "name": "test", 
    "email": "test@example.com", 
    "gender": "male", 
    "id": 123
};

let stJson = JSON.stringify(data);

// qrcode.toString(stJson, function(err, result) {
//     if (err) return console.log(err);
//     console.log(result);
// });

// qrcode.toDataURL(stJson, function(err, result) {
//     console.log(result);
// });

qrcode.toFile('./qrcodes.png', stJson, function(err, result) {
    if (err) 
        return console.log(err);
});