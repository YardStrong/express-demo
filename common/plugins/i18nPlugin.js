/**
 * i18n 语言国际化 internationalization
 */

 const i18n = require('i18n');

 const resultUtil = require('../utils/resultUtil');
 var i18nLanguages = [];

/**
 * @param  {Object} app       [express()]
 * @param  {Array} languages  ['en', 'zh', 'tw']
 */
let init = function(app, languages) {
    if(!Array.isArray(languages) || languages.length == 0) return;
    const path = require('path');

    i18n.configure({
        locales: languages,
        defaultLocale: languages[0],
        directory: path.join(__dirname, '../i18n/locales'),
        cookie: 'i18n',
        updateFiles: false,
        api: {
          '__': 'i18n'
        }
    });
    i18nLanguages = languages;

    app.use(i18n.init);

    // change language 修改语言接口
    app.get('/language/:language', function(req, res) {
        let language = req.params.language;
        if(i18nLanguages.indexOf(language) < 0) {
            return res.json(resultUtil.error('No this language'));
        }
        res.cookie('i18n', language);
        res.json(resultUtil.success({language: req.params.language}));
    });

    // i18n test 测试
    // app.get('/i18n/:key', middleware, function(req, res) {
    //     let value = res.locals.i18n(req.params.key);
    //     res.json(resultUtil.success({value: value, language: req.cookies.i18n}));
    // });
}

// middleware 加载语言
let middleware = function(req, res, next) {
    if(!req.cookies.i18n && i18nLanguages[0]) {
        req.cookies.i18n = i18nLanguages[0];
        res.cookie('i18n', i18nLanguages[0], {httpOnly: true});
    }
    i18n.setLocale(res.locals, req.cookies.i18n);
    // usage in ejs 用法在ejs模版中 <% var value = i18n('key')%>
    next();
}

exports.init = init;
exports.middleware = middleware;
