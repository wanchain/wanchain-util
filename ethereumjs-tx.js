Object.assign(exports, require('ethereumjs-tx'))

const Transaction = module.exports = function (data) {
  // Define Properties
  const fields = [{
name : 'Txtype',
length:32,
allowLess:true,
default: new Buffer([])
},{
    name: 'nonce',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'gasPrice',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'gasLimit',
    alias: 'gas',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'to',
    allowZero: true,
    length: 20,
    default: new Buffer([])
  }, {
    name: 'value',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'data',
    alias: 'input',
    allowZero: true,
    default: new Buffer([])
  }, {
    name: 'v',
    length: 1,
    default: new Buffer([0x1c])
  }, {
    name: 'r',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 's',
    length: 32,
    allowLess: true,
    default: new Buffer([])
  }, {
    name: 'PublicKeys',
    length: 1,
    default: new Buffer([0xC0])
  }, {
    name: 'KeyImage',
    length: 1,
    default: new Buffer([0xC0])
  }, {
    name: 'W_random',
    length: 1,
    default: new Buffer([0xC0])
  }, {
    name: 'Q_random',
    length: 1,
    default: new Buffer([0xC0])
  }]

  /**
   * Returns the rlp encoding of the transaction
   * @method serialize
   * @return {Buffer}
   */
  // attached serialize
  ethUtil.defineProperties(this, fields, data)

  /**
   * @prop {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
   */
  Object.defineProperty(this, 'from', {
    enumerable: true,
    configurable: true,
    get: this.getSenderAddress.bind(this)
  })

  this._homestead = true
}

Transaction.prototype.hash = function (signature) {
  let toHash

  if (typeof signature === 'undefined') {
    signature = true
  }

  toHash = signature ? this.raw : this.raw.slice(0, 7)//cr@zy

  // create hash
  return ethUtil.rlphash(toHash)
}





