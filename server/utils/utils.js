var jwt = require('jsonwebtoken');


// This can be used to generate a verification token for email verification

// const generateVerificationToken = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
// }

const generateTokenAndSetCookie = (res, user) => {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
        httpOnly: true, // to prevent client side JS from reading the cookie and xss attacks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // to prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
}

module.exports = {
    // generateVerificationToken,
    generateTokenAndSetCookie
};