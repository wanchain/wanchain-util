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

    var generateOneTimeAddress = new Method({
        name: 'generateOneTimeAddress',
        call: 'wan_generateOneTimeAddress',
        params: 1,
        inputFormatter: [null]
    });

    var sendPrivacyCxtTransaction = new Method({
        name: 'sendPrivacyCxtTransaction',
        call: 'personal_sendPrivacyCxtTransaction',
        params: 2,
        inputFormatter: [formatters.inputTransactionFormatter, null]
    });

    var computeOTAPPKeys = new Method({
        name: 'computeOTAPPKeys',
        call: 'wan_computeOTAPPKeys',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, null]
    });

    var genRingSignData = new Method({
        name: 'genRingSignData',
        call: 'personal_genRingSignData',
        params: 3,
    });

    var getOTABalance = new Method({
        name: 'getOTABalance',
        call: 'wan_getOTABalance',
        params: 2,
        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: formatters.outputBigNumberFormatter
    });

    var scanOTAbyAccount = new Method ({
        name: 'scanOTAbyAccount',
        call: 'wan_scanOTAbyAccount',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter,formatters.inputBlockNumberFormatter]
    });

    var getSupportWanCoinOTABalances = new Method ({
        name: 'getSupportWanCoinOTABalances',
        call: 'wan_getSupportWanCoinOTABalances',
        params: 0,
    });

    var getSupportStampOTABalances = new Method ({
        name: 'getSupportStampOTABalances',
        call: 'wan_getSupportStampOTABalances',
        params: 0,
    });

    return [
        pendingTransactions,
        computeOTAPPKeys, 
        getOTAMixSet,
        getOTABalance,
        getWanAddress,
        generateOneTimeAddress,
        sendPrivacyCxtTransaction,
        genRingSignData,
        getOTABalance,
        scanOTAbyAccount,
        getSupportWanCoinOTABalances,
        getSupportStampOTABalances
    ];
};
var properties = function () {
    return [];
};
module.exports = Wan;