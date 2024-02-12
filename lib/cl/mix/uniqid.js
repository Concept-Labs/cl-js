define(() => {

    return function (prefix) {
        if (window.performance) {
            var s = performance.timing.navigationStart;
            var n = performance.now();
            var base = Math.floor((s + Math.floor(n)) / 1000);
        } else {
            var n = new Date().getTime();
            var base = Math.floor(n / 1000);
        }
        var ext = Math.floor(n % 1000 * 1000);
        var now = ("00000000" + base.toString(16)).slice(-8) + ("000000" + ext.toString(16)).slice(-5);
        if (now <= window.my_las_uid) {
            now = (parseInt(window.my_las_uid ? window.my_las_uid : now, 16) + 1).toString(16);
        }
        window.my_las_uid = now;
        return (prefix ? prefix : '') + now;
    }
})