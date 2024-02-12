define(["lodash", "cl/mix/requirejs-exports", "module"], function (_, cl_exports, module) {


    var resourceLoaderConfig = [],
        getResource = function () {
            return this.resource;
        },
        parseResource = function (resource) {

            return resource;
        },
        configureResourceLoader = function () {
            const loaderUid = `${this.config().uid}-loader`;
            return this.resourceLoaderConfig[loaderUid] = _.merge(
                {},
                this.config(),
                { "loaderUid": loaderUid }
            );
        },
        load = function () {
            var resourceLoaderUid = `clr-${this.config().uid}`;
            require.config({
                "paths": {
                    [resourceLoaderUid]: `${this.config().resourceLoader.path}?${resourceLoaderUid}`
                },
                "config": {
                    [resourceLoaderUid]: this.configureResourceLoader()
                }
            });
            require([resourceLoaderUid], (loader) => {
                try {
                    loader.config(this.resourceLoaderConfig[loader.config().loaderUid]);
                    loader.load(
                        resource => {
                            this.updateDOM(this.parseResource(resource), document, this.config().textPosition)
                        }
                        ,"text!"
                        );
                } catch (e) {
                    console.error(
                        `[${module.uri}]: Error request loader: `, e,
                        "\n"+"-".repeat(30),
                        "\nLoader dump: ", loader
                    );
                }
            })
            return this;
        },
        updateDOM = function (resource, context, textPosition) {
            context = context || document;
            with (this) {
                try {
                    var node = context.querySelector(`[cl-uid=${config().uid}]`).insertAdjacentHTML(textPosition || 'beforeend', resource);
                    context.querySelector(`[cl-uid=${config().uid}]`).removeAttribute(config().configAttr);
                    context.querySelector(`[cl-uid=${config().uid}]`).removeAttribute("cl-uid");
                } catch (e) {
                    console.error(
                        `[${module.uri}]: Error updateting DOM (posible problem: node was not found): `, e,
                        "\n"+"-".repeat(30),
                        "\nConfig dump: ", this.config()
                    );
                }
            }

            //handle added node
            require(['cl/dom/handler'], handler => handler.handle(node));
            return this;
        };

    cl_exports(module, {
        "resourceLoaderConfig": resourceLoaderConfig,
        "configureResourceLoader": configureResourceLoader,
        "load": load,
        "getResource": getResource,
        "parseResource": parseResource,
        "updateDOM": updateDOM
    });

})