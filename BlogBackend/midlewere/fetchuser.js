const { request } = require('express');
const jwt = require('jsonwebtoken');
const JWT_SCERET = 'Yashisagoodboy';

const fetchUser = (req, res, next) => {
    const token = req.header('authorization');

    if (!token) {
        let Auth = true;
        res.status(401).send({ errors: 'please authenticate using a valid token', Auth: Auth });
    }
    try {
        const data = jwt.verify(token, JWT_SCERET);
        req.user = data.user;
        next();
    } catch (e) {
        let Auth = true;
        res.status(401).send({ errors: 'please authenticate using a valid token', Auth: Auth });
    }
}

module.exports = fetchUser;