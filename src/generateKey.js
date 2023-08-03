/*
  Encryption Key Generator
  https://stackoverflow.com/a/62362724
 */
let bytesArrToBase64 = (arr) => {
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // base64 alphabet
  const bin = n => n.toString(2).padStart(8, 0); // convert num to 8-bit binary string
  const l = arr.length
  let result = '';

  for(let i = 0; i <= (l - 1) / 3; i++) {
    let c1 = i * 3 + 1 >= l; // case when "=" is on end
    let c2 = i * 3 + 2 >= l; // case when "=" is on end
    let chunk = bin(arr[3 * i]) + bin(c1 ? 0 : arr[3 * i + 1]) + bin(c2 ? 0 : arr[3 * i + 2]);
    let r = chunk.match(/.{1,6}/g).map((x, j) => j == 3 && c2 ? '=' : (j == 2 && c1 ? '=' : abc[ + ('0b' + x)]));
    result += r.join('');
  }

  return result;
}


let generateKey = (len) => {
  let array = new Uint8Array(len);
  crypto.getRandomValues(array);
  return bytesArrToBase64(array);
}

export default generateKey