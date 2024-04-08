import ImageKit from "imagekit"

export default new ImageKit({
    urlEndpoint: process.env.IK_URL,
    publicKey: process.env.IK_PUBLIC,
    privateKey: process.env.IK_PRIVATE,
})
