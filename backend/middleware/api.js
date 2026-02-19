require('dotenv').config()

const protect = (req, res, next) => {
    let key;
    if (req.headers['kcb-api-key']) {
        key = req.headers['kcb-api-key'];
    }

    if (key == process.env.API_KEY) {
        next()
        return
    }
    return res.status(401).json({
        error: 'Not authorized, no API key',
    })
}

module.exports = protect