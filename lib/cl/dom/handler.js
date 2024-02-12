/**
 * 
 */
define(['lodash', "cl/mix/requirejs-exports", "module"], function (_, cl_exports, module) {
    var handle = function (context) {
        try {
            if ((!this.config && !this.config().components)) {
                throw new Error("There are no componets found in config");
            }
            Object.entries(this.config().components || {}).forEach(([componentHandler, componentConfig]) => {
                require.config({
                    "config": { [componentHandler]: _.merge({}, componentConfig, { componentHandler: componentHandler }) }
                });
                require([componentHandler], handler => {
                    try {
                        handler.handle(context || this.config().context || document);
                    } catch (e) {
                        console.error(
                            "Component handler failed:", e,
                            "\n"+"-".repeat(30),
                            "\nHandler dump: ", handler
                        );
                    }
                }
                );
            });
        } catch (e) {
            console.error(`Master handler("cl/dom/handler") fail. Possible bad config `, e);
        }
    };

    cl_exports(
        module,
        { handle: handle }
    );
});