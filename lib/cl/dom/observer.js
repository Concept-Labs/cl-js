define(["cl/mix/requirejs-exports", "module"], function (cl_exports, module) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        onDOMNodeUpdate = function (context, callback) {
            if (this.MutationObserver) {
                var mutationObserver = new this.MutationObserver(callback)

                mutationObserver.observe(context, { attributes: true, childList: true, subtree: true })
                return mutationObserver
            }
            // browser support fallback
            else if (window.addEventListener) {
                context.addEventListener('DOMNodeInserted', callback, false)
                context.addEventListener('DOMNodeRemoved', callback, false)
            }
        };

    cl_exports(
        module,
        {
            "MutationObserver": MutationObserver,
            "onDOMNodeUpdate": onDOMNodeUpdate
        }
    );
});