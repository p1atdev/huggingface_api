export interface HFAuth {
    accessToken: string
}

export interface HFOrg {
    type: "org"
    id: string
    name: string
    fullname: string
    email: string | null
    apiToken: string
    periodEnd: string | null
    plan: "NO_PLAN" | string // "PREMIUM" ?
    canPay: boolean
    avatarUrl: string
    roleInOrg: "contributor" | "write" | "read"
}

export interface HFUser {
    type: "user"
    id: string
    name: string
    fullname: string
    email: string
    emailVerified: boolean
    plan: "NO_PLAN" | string // "PREMIUM" ?
    canPay: boolean
    isPro: boolean
    periodEnd: string | null
    avatarUrl: string
    orgs: HFOrg[]
    auth: {
        type: "cookie" | "access_token"
        accessToken?: {
            displayName: "Read"
            role: "read"
        }
    }
}
