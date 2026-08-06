import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.NEXT_PUBLIC_HASH as string, {
    pbkdf2Iterations: 1,
    saltLength: 10
});

export function Encrypt(text: string){
    return cryptr.encrypt(text);
}


export function Decrypt(text: string){
    try {
        return cryptr.decrypt(text);
    } catch (error) {
        return null;
    }
}