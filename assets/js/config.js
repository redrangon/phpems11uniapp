import CryptoJS from 'crypto-js'
const hashkey = '12345678123456781234567812345678';
const hashiv = '1234567812345678';
const hashdata = false;
export default {
	host:'http://127.0.0.1/phpems11/',
	hashkey,
	hashiv,
	hashdata,
	decode: data => {
		if(!hashdata)return data;
		else 
		{
			return CryptoJS.AES.decrypt(decodeURIComponent(data),CryptoJS.enc.Utf8.parse(hashkey),{
				iv:CryptoJS.enc.Utf8.parse(hashiv),
				mode:CryptoJS.mode.CBC, 
				padding:CryptoJS.pad.Pkcs7
			}).toString(CryptoJS.enc.Utf8); 
		}
	},
	encode:data => {
		if(!hashdata)return data;
		else return encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(data),CryptoJS.enc.Utf8.parse(hashkey),{
			iv:CryptoJS.enc.Utf8.parse(hashiv),
			mode:CryptoJS.mode.CBC, 
			padding:CryptoJS.pad.Pkcs7
		}).ciphertext.toString(CryptoJS.enc.Base64));
	},
}