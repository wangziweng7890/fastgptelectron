import CryptoJs, { MD5 } from 'crypto-js'

export default {
  /**
     * 加密
     * 密钥必须16位
     */
  encrypt(word: any, keyStr = '1234567890ABCDEF') {
    const key = CryptoJs.enc.Utf8.parse(keyStr)
    const srcs = CryptoJs.enc.Utf8.parse(word)
    const encrypted = CryptoJs.AES.encrypt(srcs, key, {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7,
    })
    return encrypted.toString()
  },

  /**
     * 解密
     * 密钥必须16位
     */
  decrypt(word: any, keyStr = '1234567890ABCDEF') {
    const key = CryptoJs.enc.Utf8.parse(keyStr)
    const decrypt = CryptoJs.AES.decrypt(word, key, {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7,
    })
    return CryptoJs.enc.Utf8.stringify(decrypt).toString()
  },

  MD5(word: any) {
    return MD5(word).toString()
  },
}
