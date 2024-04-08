// this file for encryption and decryption the cart (might use this for a different thing)
import crypto from "node:crypto"

export function generateIv() {
    return crypto.randomBytes(16).toString("base64")
}

export function getKey() {
    return Buffer.from(process.env.CIPHER_KEY, "base64")
}

export function encrypt<T>(data: T): [string, string] {
    const iv = generateIv()
    const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), Buffer.from(iv, "base64"))

    let encryption = cipher.update(JSON.stringify(data), "utf8", "base64")
    encryption += cipher.final("base64")

    return [iv, encryption]
}

export function decrypt<T>(iv: string, encryption: string): T | null {
    try {
        const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), Buffer.from(iv, "base64"))
        let decryption = decipher.update(encryption, "base64", "utf8")
        decryption += decipher.final("utf8")

        return JSON.parse(decryption) as T
    } catch {
        return null
    }
}
