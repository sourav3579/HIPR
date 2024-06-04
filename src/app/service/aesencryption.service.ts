import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
const HASHKEY = "B@j@j@123%&~";
@Injectable({
  providedIn: 'root'
})
export class AESEncryptionService {
  secretKey = "YourSecretKeyForEncryption&Descryption";
  constructor() { }
  //object encrytpion
  encrypt(valueToEncrypt: any){
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(valueToEncrypt), HASHKEY).toString();
    return ciphertext;
  }
  decrypt(valueToDecrypt: any){
    var bytes  = CryptoJS.AES.decrypt(valueToDecrypt, HASHKEY);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
}