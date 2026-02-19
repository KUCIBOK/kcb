const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Bypass token ID for offline mode
const BYPASS_USER_ID = 'bypass-admin-id';

// Logidoo API key for external integration
const LOGIDOO_API_KEY = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGY1NmM3OGYyNDkyN2U3ODg1NDJhYWUiLCJpYXQiOjE3NjM1OTAyNTEsImV4cCI6MTkyMTM3ODI1MX0.yrw6_713Nucr_xnEdjPW1szk6riiwjZbM_IYBEUDUxmRVSSqVd4IUz3uhFDI7o88hEd50dAzVZV4_ggbtW-b6HO5Wpc6ruq33yHQfDBxwPCoMywUGeK9lw_BrAGwm3L7QyBe9oa048m0cyeApiofYIYTrp1yV0iCQR_1VM58wk0fmZj6ocd1LqDinCsyJ18W-XiiCWVOJsLLIaP8iTzyn0axkhel8mKPMtmijeDyhL32BykKrKPyCWM7nSkSI-AokUedgQFm2v4UJRsTEWNPZnEJWa2qkQOikl8b5kxz7Iph4lRW4x4rehh6fqBk-2dWqf8F8ubPxiwLEBgyLjFyu6-mO0g_hF7LjA5rAwu1NFT4-IIgxtkIVuGCC_F1bZD5cUKbHKgYqsV7gN_K7_hmgRWNYAotT7dSZLKsbseM4PpOUsrmm_E_6AY8sW2F5i9cQidX-nCIO1dJxWG_mTAeIQEoy66UQZ8dxVpVjiw5IcKTlJ9ELp7WOOnCKZFOX8XINrSVVFgXC7oEcW1KykJ85pEAj5ksxRZJDbistgc_ESVhhbAP_Ri2hffr9lRjr3adBGRqcXKlxqbes-YOSVN2Q1hk6dD-ZNG0f4c4iikcRzRi0lgG_NoHe_bjeH7-K1WtdgYZQuZZRq_luFXcwXh_vGQ5gjAy1Zex04l7ean4Wdk';

exports.auth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check for malformed, empty, null, or undefined token
    if (!token || token === 'null' || token === 'undefined' || typeof token !== 'string' || !token.trim()) {
        return res.status(401).json({ message: 'Not authorized, invalid or missing token' });
    }

    try {
        // Check if this is the Logidoo API key
        if (token === LOGIDOO_API_KEY) {
            req.user = {
                _id: 'logidoo-service',
                name: "Logidoo Service",
                email: "service@logidoo.co",
                role: "service",
                isActive: true,
                isEmailVerified: true
            };
            return next();
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Bypass: accept bypass token without database lookup
        if (decoded._id === BYPASS_USER_ID) {
            req.user = {
                _id: BYPASS_USER_ID,
                name: "Admin User",
                email: "admin@kucibok.com",
                role: "admin",
                isActive: true,
                isEmailVerified: true
            };
            return next();
        }
        
        req.user = await User.findById(decoded._id).select('-password');
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}

exports.admin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }


    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        // Check if this is the Logidoo API key
        if (token === LOGIDOO_API_KEY) {
            req.user = {
                _id: 'logidoo-service',
                name: "Logidoo Service",
                email: "service@logidoo.co",
                role: "service",
                isActive: true,
                isEmailVerified: true
            };
            return next();
        }
        
        // Check if token is a non-empty string
        if (typeof token !== 'string' || !token.trim()) {
            return res.status(401).json({ message: 'Not authorized, invalid token format' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Bypass: accept bypass token without database lookup
        if (decoded._id === BYPASS_USER_ID) {
            req.user = {
                _id: BYPASS_USER_ID,
                name: "Admin User",
                email: "admin@kucibok.com",
                role: "admin",
                isActive: true,
                isEmailVerified: true
            };
            return next();
        }
        
        req.user = await User.findById(decoded._id)
        if(req.user.role == "admin"){
            next()
            return
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' }); 
    }
}

exports.artist = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null' || token === 'undefined' || typeof token !== 'string' || !token.trim()) {
        return res.status(401).json({ message: 'Not authorized, invalid or missing token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded._id)
        if(req.user.role == "artist"){
            next()
            return
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' }); 
    }
}

exports.collector = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null' || token === 'undefined' || typeof token !== 'string' || !token.trim()) {
        return res.status(401).json({ message: 'Not authorized, invalid or missing token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded._id)
        if(req.user.role == "collector"){
            next()
            return
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' }); 
    }
}

exports.professional = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null' || token === 'undefined' || typeof token !== 'string' || !token.trim()) {
        return res.status(401).json({ message: 'Not authorized, invalid or missing token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded._id)
        if(req.user.role == "professional"){
            next()
            return
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' }); 
    }
}