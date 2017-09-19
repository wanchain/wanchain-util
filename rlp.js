
Object.assign(exports, require('rlp'))

exports.encode = function (input) {
  console.log("running here");
  if (input instanceof Array) {
    var output = []
    for (var i = 0; i < input.length; i++) {
      output.push(exports.encode(input[i]))
    }
    var buf = Buffer.concat(output)
    return Buffer.concat([encodeLength(buf.length, 192), buf])
  } else {
    input = toBuffer(input)
    if ((input.length === 1 && input[0] < 128 ) || (input.length === 1 && input[0] === 0xC0 )) {//if (input.length === 1 && input[0] < 128 ) {
      return input
    } else {
      return Buffer.concat([encodeLength(input.length, 128), input])
    }
  }
}

