const validator = require('validator');
console.log('Original:', 'RUKESHSG0001@GMAIL.COM');
console.log('Normalized:', validator.normalizeEmail('RUKESHSG0001@GMAIL.COM'));
