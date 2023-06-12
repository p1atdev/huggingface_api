import { assertExists } from "./deps.ts"
import { Secret } from "./secret.ts"

Deno.test("check if secret is loaded or not", () => {
    assertExists(Secret.HF_READ_TOKEN)
})
