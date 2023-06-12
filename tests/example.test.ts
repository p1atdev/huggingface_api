import { HFAPIClient } from "../mod.ts"
import { assertEquals } from "./deps.ts"
import { Secret } from "./secret.ts"

Deno.test("example usage on readm", async () => {
    const HF_READ_TOKEN = Secret.HF_READ_TOKEN

    const client = new HFAPIClient({
        accessToken: HF_READ_TOKEN,
    })

    const user = await client.whoami()

    console.log(user)
    /*
    {
        type: "user",
        id: "f99cf739a7c617047a1907a2",
        name: "example",
        fullname: "Example User",
        email: "user@example.com",
        emailVerified: true,
        plan: "NO_PLAN",
        canPay: false,
        isPro: false,
        ...
     */

    assertEquals(user.type, "user")

    const repo = client.createRepoClient({
        id: "DeepFloyd/IF-I-XL-v1.0",
        type: "model",
    })

    const info = await repo.info()

    console.log(info)
    /*
    {
        _id: "642f382128a26b5c89b231fa",
        id: "DeepFloyd/IF-I-XL-v1.0",
        modelId: "DeepFloyd/IF-I-XL-v1.0",
        author: "DeepFloyd",
        sha: "c03d510e9b75bce9f9db5bb85148c1402ad7e694",
        lastModified: "2023-06-02T19:05:00.000Z",
        private: false,
        disabled: false,
        gated: "auto",
        ...
    */

    assertEquals(info.id, "DeepFloyd/IF-I-XL-v1.0")

    console.log(await repo.ls("/text_encoder"))
    /*
    [
        {
            type: "file",
            oid: "0b100db2c06bd17c52d991f78fc3cee9b696c0f5",
            size: 741,
            path: "text_encoder/config.json",
            url: {
                preview: "https://huggingface.co/DeepFloyd/IF-I-XL-v1.0/blob/main/text_encoder/config.json",
                raw: "https://huggingface.co/DeepFloyd/IF-I-XL-v1.0/resolve/main/text_encoder/config.json"
            }
        },
        {
            type: "file",
            oid: "5b46e12f6fd842eae9387f810e0dc5f34cce7340",
            size: 9989150322,
            lfs: {
                oid: "5dfaaab934ff0359d88bda7e732f95e810ab711cf9df86d97856580564a6d3bf",
                size: 9989150322,
                pointerSize: 135
            },
            path: "text_encoder/model-00001-of-00002.safetensors",
            url: {
                preview: "https://huggingface.co/DeepFloyd/IF-I-XL-v1.0/blob/main/text_encoder/model-00001-of-00002.safetensor"... 1 more character,
                raw: "https://huggingface.co/DeepFloyd/IF-I-XL-v1.0/resolve/main/text_encoder/model-00001-of-00002.safeten"... 4 more characters
            }
        },
        ...
    */
})
