const Method = require("web3/lib/web3/method");
const formatters = require('web3/lib/web3/formatters');


function Wan(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function(p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });
}

var methods = function () {
    var pendingTransactions = new Method({
        name: 'pendingTransactions',
        call: 'eth_pendingTransactions',
        params: 1
    });
    var getOTAMixSet = new Method({
        name: 'getOTAMixSet',
        call: 'wan_getOTAMixSet',
        params: 2
    });
    var getOTABalance = new Method({
        name: 'getOTABalance',
        call: 'eth_getOTABalance',
        params: 1
    });

    var getWanAddress = new Method({
        name: 'getWanAddress',
        call: 'wan_getWanAddress',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter]
    });

    return [
        pendingTransactions,
        getOTAMixSet,
        getOTABalance,
        getWanAddress
    ];
};
var properties = function () {
    return [];
};
module.exports = Wan;