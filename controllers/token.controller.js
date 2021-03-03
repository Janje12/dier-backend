const jwt = require('jsonwebtoken');

exports.extractUserInfo = async (headers, token = undefined) => {
    try {
        if (token === undefined)
            token = headers['authorization'].split(' ')[1];
        return jwt.decode(token).data;
    } catch (err) {
        console.log('[METHOD-ERROR]: ', err);
        throw new Error(err);
    }
};

exports.generateAccessToken = async (user, company) => {
    let expirePeriod = '30m';
    if (user.rememberMe)
        expirePeriod = '730h';
    const accessToken = jwt.sign({
        data: {
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: user.token,
            },
            company: {
                _id: company._id,
                operations: company.operations,
            },
        }
    }, process.env.ACCESS_TOKEN, {expiresIn: expirePeriod});
    return accessToken;
};

exports.generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({
        data: {
            user: {
                username: user.username, firstName: user.firstName, lastName: user.lastName,
            },
        }
    }, process.env.REFERSH_TOKEN);
    return refreshToken;
};
