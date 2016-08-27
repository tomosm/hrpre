// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
'use strict';

{

  let _findNext2QuoteChar = (str, position = 0) => {
    let closePosition = str.indexOf('"', position);
    if (closePosition === -1) {
      return -1;
    }

    if (str[closePosition - 1] === '\\') {
      return _findNext2QuoteChar(str, closePosition + 1);
    } else {
      return closePosition;
    }
  };

  let _parseAsString = (str, position = 0) => {
    let closePosition = _findNext2QuoteChar(str, position);
    if (closePosition === -1) {
      throw new SyntaxError('unexpected end of JSON input');
    }
    // delete close char and replace \" => " and replace \\\\ => \\
    return str.substring(position, closePosition).replace(/\\"/ig, '"').replace(/\\\\/ig, '\\');
  };

  let _parseAsPair = (obj, str) => {
    if (str.length === 0) {
      return obj;
    }

    let key = null;
    let value = null;
    for (let i = 0, l = str.length; i < l; i++) {
      let c = str[i];
      switch (c) {
      case '"':
        if (key === null) {
          key = _parseAsString(str, i + 1);
        }
        break;
      case ':':
        value = _parseAsValue(str, i + 1);
        i = l;
        break;
      }
    }
    if (key === null) {
      throw new SyntaxError('unexpected end of JSON input (key is null)');
    }
    obj[key] = value;
    return obj;
  };

  let _parseAsObjectAndArray = (str, position = 0, onSuccess, onCheckCloseChar) => {
    let pair = '';
    let stringMode = false;
    let openArrayNum = 0;
    let openObjectNum = 0;
    for (let i = position, l = str.length; i < l; i++) {
      let c = str[i];
      switch (c) {
      case '{':
        openObjectNum++;
        pair += c;
        break;
      case '[':
        openArrayNum++;
        pair += c;
        break;
      case '}':
        openObjectNum--;
        pair += c;
        break;
      case ']':
        openArrayNum--;
        pair += c;
        break;
      case ',':
        if (openObjectNum === 0 && openArrayNum === 0 && !stringMode) {
          onSuccess(pair);
          pair = '';
        } else {
          pair += c;
        }
        break;
      case '"':
        if (pair[pair.length - 1] === '\\') {
          pair += c;
        } else {
          stringMode = !stringMode;
          pair += c;
        }
        break;
      case ' ':
      case '\t':
      case '\n':
      case '\r':
        if (stringMode) {
          pair += c;
        }
        break;
      default:
        pair += c;
        break;
      }
    }

    if (stringMode) {
      throw new SyntaxError('unexpected end of JSON input (missing " character)');
    }

    if (pair.length !== 0) {
      onCheckCloseChar(pair[pair.length - 1]);
      let val = pair.substring(0, pair.length - 1);
      if (val !== '') {
        onSuccess(val);
      }
    }
  };

  let _parseAsObject = (str, position = 0) => {
    let obj = {};

    _parseAsObjectAndArray(str, position,
      val => _parseAsPair(obj, val),
      closeChar => {
        if (closeChar !== '}') {
          throw new SyntaxError('unexpected end of JSON input (missing } character)');
        }
      });

    return obj;
  };

  let _parseAsArray = (str, position = 0) => {
    let array = [];

    _parseAsObjectAndArray(str, position,
      val => array.push(_parseAsValue(val)),
      closeChar => {
        if (closeChar !== ']') {
          throw new SyntaxError('unexpected end of JSON input (missing ] character)');
        }
      });

    return array;
  };

  let _parseAsValue = (str, position = 0) => {
    str = String(str);

    let val = '';
    for (let i = position, l = str.length; i < l; i++) {
      let c = str[i];
      switch (c) {
      case '{':
        return _parseAsObject(str, i + 1);
      case '[':
        return _parseAsArray(str, i + 1);
      case '"':
        return _parseAsString(str, i + 1);
      default:
        val += c;
        break;
      }
    }

    switch (val) {
    case '':
      return '';
    case 'null':
      return null;
    case 'true':
      return true;
    case 'false':
      return false;
    }

    if (!isNaN(Number(val))) {
      return Number(val);
    }

    throw new SyntaxError('unexpected end of JSON input');
  };

  global.parseJSON = json => {
    return _parseAsValue(json)
  };

}
