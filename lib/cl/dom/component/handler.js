/**
 * 
 */
define(["lodash", "cl/mix/uniqid", "cl/mix/requirejs-exports", "module"], function (_, uniqid, cl_exports, module) {


    var nodeConfig = [],
        buildComponentPath = function (component) {
            var path = component;
            Object.entries(this.config().componentMap || {}).forEach(([componentAlias, componentMapConfig]) => {
                path = path.replace(
                    new RegExp(`\\[${componentAlias}\\]`, "gi"),
                    componentMapConfig.path
                );
            });

            return path;
        },
        configureNode = function (node) {
            var uid = uniqid('cl-component-');
            this.nodeConfig[uid] = _.merge(
                {},
                this.config() || {},
                JSON.parse(node.getAttribute(this.config().configAttr) || {}) || {},
                { "uid": uid, DOMNode: node }
            );
            this.nodeConfig[uid].componentPath = this.buildComponentPath(this.nodeConfig[uid].component);
            node.setAttribute('cl-uid', uid);
            return this.nodeConfig[uid];
        },
        handleNode = function (nodeConfig) {
            try {
                require.config({
                    "paths": { [nodeConfig.uid]: `${nodeConfig.componentPath}?${nodeConfig.uid}` },
                    "config": { [nodeConfig.uid]: nodeConfig }
                });
//@TODO                
nodeConfig.DOMNode.removeAttribute(this.config().configAttr);
                require([nodeConfig.uid], component => {
                    try {
                        component.config(this.nodeConfig[component.config().uid])
                        component.load();
                    } catch (e) {
                        console.error(
                            `[${module.uri}]: error while loading component: `, e,
                            "\n"+"-".repeat(10),
                            "\nComponent dump: ", component,
                            "\nNode dump: ", (component && component.uid) ? this.nodeConfig[component.uid].DOMNode : '',
                            '\n...Continue next node'
                        )
                    }
                }
                );
            } catch (e) {
                console.error("cl/dom/component/handler: Error handling node. Check Config & Node:", nodeConfig && nodeConfig.DOMNode || "Node is null", e);
            }
            return this;
        },
        handle = function (context) {
            context = context || document;
            context.querySelectorAll(`[${this.config().configAttr}]`).(for)Each((node) => {
                try {
                    this.handleNode(this.configureNode(node));
                } catch (e) {
                    console.error(
                        `[${module.uri}]: error while handling node: `, e,
                        "\n"+"-".repeat(30),
                        "\nNode dump: ", node
                        );
                }
            })
        };

    cl_exports(module, {
        "nodeConfig": nodeConfig,
        "configureNode": configureNode,
        "buildComponentPath": buildComponentPath,
        "handleNode": handleNode,
        "handle": handle
    });
});