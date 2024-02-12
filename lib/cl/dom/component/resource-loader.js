define(["lodash", "cl/mix/requirejs-exports", "module"], function (_, cl_exports, module) {

    var load = function (callback, requirePlugin) {
            requirePlugin = requirePlugin || this.config().requirePlugin || "text!";
            try {
                require(
                    [this.buildResourcePath(`${requirePlugin}${this.config().resource}`, this.config().componentMap)],
                    response => {
                        try {
                            this.response = response;
                            if (callback) {
                                callback(response);
                            }
                        } catch (e) {
                            console.error(
                                `[${module.uri}]: Error in load callback: `, e,
                                "\n"+"-".repeat(30),
                                "\nCallback dump: ", callback
                            );
                        }
                    }
                );
            } catch (e) {
                console.error(`[${module.uri}] Load failed: `, e);
            }
        },
        getResponse = function () {
            return this.response;
        },
        buildResourcePath = function (resourcePath, componentMap) {
            Object.entries(componentMap || {}).forEach(([componentAlias, componentConfig]) => {
                resourcePath = resourcePath.replace(
                    new RegExp(`\\[${componentAlias}\\]`, "g"),
                    componentConfig.resource.path
                );
            });
            return resourcePath;
        };

    cl_exports(module, {
        "load": load,
        "buildResourcePath": buildResourcePath,
        "getResponse": getResponse
    });

})