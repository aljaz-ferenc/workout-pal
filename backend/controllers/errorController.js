module.exports = (err, req, res, next) => {

    res.status(500).json({
        status: 'fail',
        message: err.message
    })
}