import bcrypt from "bcrypt"

const hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10)
    return new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                throw reject(err)
            } else {
                resolve(hash)
            }
        })
    })
}
const comparePassword = (password: string, hash: string) => {
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if (err) {
                throw reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

export {hashPassword, comparePassword}