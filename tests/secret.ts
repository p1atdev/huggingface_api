import { load } from "./deps.ts"

await load({ envPath: ".env.local", export: true, allowEmptyValues: true })

interface Secret {
    HF_READ_TOKEN: string
}

export const Secret: Secret = {
    HF_READ_TOKEN: Deno.env.get("HF_READ_TOKEN")!,
}
