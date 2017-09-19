
Object.assign(exports, require('ethereumjs-util'))


exports.otaHash = function(){
    if(arguments.length < 1){
        throw "invalid parameters";
    }
    var buf = new Buffer([]);
    for (let i = 0; i < arguments.length; i++){
        let item = exports.toBuffer(arguments[i]);
        buf = Buffer.concat([buf, item]);
    }
    return exports.sha3(buf);
}

//strstrPrivateKey shouldn't have 0x prefix
exports.otaSign = function(hashSrc, strPrivateKey){
    var privateKey = new Buffer(strPrivateKey, 'hex')
    return exports.ecsign(hashSrc, privateKey);
}


exports.ascii_to_hexa = function (str)
  {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n ++) 
     {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
   }
  return arr1.join('');
}

//convert number to bytes32 for compatible with contract evm hash implements
//TODO: validate input
exports.numberToBytes32 = function(input){
  if(!input){
    return '';
  }
  var inputStr = input.toString();
  var a2hStr = exports.ascii_to_hexa(inputStr);
  var padding = "";
  for (var i = 0; i < 64 - a2hStr.length; i++){
    padding += "0"
  }
  return '0x' + a2hStr + padding;
}

/**
 * get public key string from private key string
 * @param private key string
 * @return {String|null}
 */
exports.publicKeyFromPrivateKey = function (privateKey) {
  if(!privateKey.startsWith('0x')){
    privateKey = '0x' + privateKey;
  }
  return exports.bufferToHex(exports.privateToPublic(privateKey), 'hex');
}

function _generatePrivateKey(){
  var randomBuf = crypto.randomBytes(32);
  if (secp256k1.privateKeyVerify(randomBuf)){
    return randomBuf;
  } else {
    return _generatePrivateKey();
  }
}

function _generateA1(RPrivateKeyDBytes, pubKeyA,  pubKeyB){
  A1 = secp256k1.publicKeyTweakMul(pubKeyA, RPrivateKeyDBytes, false);
  A1Bytes = exports.sha3(A1);
  A1 = secp256k1.publicKeyTweakAdd(pubKeyB, A1Bytes, false);
  return A1;
}

function _generateOTAPublicKey(pubKeyA, pubKeyB){
  let RPrivateKey = _generatePrivateKey();
  let A1 = _generateA1(RPrivateKey, pubKeyA, pubKeyB);
  return {
    OtaA1: exports.bufferToHex(A1).slice(4),
    OtaS1: exports.bufferToHex(exports.privateToPublic(RPrivateKey)).slice(2)
  };
}

//input is 128 or 130 byte
function _utilPubkey2SecpFormat(utilPubKeyStr) {
  if(utilPubKeyStr.startsWith('0x')){
    utilPubKeyStr = utilPubKeyStr.slice(2);
  }
  utilPubKeyStr = '04' + utilPubKeyStr;
  return secp256k1.publicKeyConvert(new Buffer(utilPubKeyStr, 'hex'));
}

exports.pubkeyStrCompressed = function(pubStr){
  buf = _utilPubkey2SecpFormat(pubStr);
  return exports.bufferToHex(buf);
}

//get secp256k1 format public key buf
function _secpPUBKBufFromPrivate(privateKey) {
  var pubStr = exports.pulicKeyFromPrivateKey(privateKey);
  return _utilPubkey2SecpFormat(pubStr);
}

exports.generateOTAPublicKey = function (A, B) {
  var pubKeyA =  _utilPubkey2SecpFormat(A);
  var pubKeyB = _utilPubkey2SecpFormat(B);
  return _generateOTAPublicKey(pubKeyA, pubKeyB);
}

function _privateKeyStr2Buf(s) {
  if(s.startsWith('0x')){
    s = s.slice(2);
  }
  return new Buffer(s, 'hex');
}

exports.computeOTAPrivateKey = function(A, S, a, b){
  var otaPubS1 = _utilPubkey2SecpFormat(S);
  var privatekey_a =_privateKeyStr2Buf(a);
  var privatekey_b = _privateKeyStr2Buf(b);
  var pub = secp256k1.publicKeyTweakMul(otaPubS1, privatekey_b, false);
  k = exports.sha3(pub);
  k = secp256k1.privateKeyTweakAdd(k, privatekey_a);
  return k;
}
/*
usage:
 var tprivatekey = 'daa2fbee5ee569bc64842f5a386e7037612e0736b52e41749d52b616beaca65e';
 var tAddress = '0xc29258c409380d34c9255406e8204212da552f92'
 var pubstr = '0x3174229c8eb8ed336f5e58bdd7441873e4b0c8d17646ef27f42985b35619b9cd44726f7a2a1d692658269deb4cdea6324cab7e680d910925575f8c6323ad49c4'
 ota = ethUtil.generateOTAPublicKey(pubstr, pubstr)
 bufOTAPrivate = ethUtil.computeOTAPrivateKey(ota.OtaA1, ota.OtaS1, tprivatekey,tprivatekey)
*/
