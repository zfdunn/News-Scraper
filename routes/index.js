module.exports = function (app) {
    require('./htmlRoutes')(app);
    require('./apiRoutes')(app)
};