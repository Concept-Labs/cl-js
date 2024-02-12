define(["lodash", "module"], (_, module) => {

    return (module, exports) => {
        module.exports = _.merge(
            {},
            module.exports,
            {
                uid: module.config && module.config() ? module.config().uid : null,
                config: module.config ? module.config : () => { },
                configObject: module.config && module.config() ? module.config() : {},
                id: module.id,
                uri: module.uri
            },
            exports,
        );
        //return module;
        // module.exports.init = module
        //     module.config( nomerge ? config : _.merge({}, module.config(), config));
        // };
    };
});