function authenticate(req, res, next) {
    console.log('Authentication....');
    next();
}

module.exports = authenticate;