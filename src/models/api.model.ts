
export type User = {
    email: string
    firstname: string
    fullname: string
    lastname: string
    policyid: number[]
    username: string
    validation: string
    iscreatedipa?: boolean
    iscreatedgitlab?: boolean
}

export type Policy = {
    date_added: string
    groupipa: string
    members: string[]
    name: string
    policiesranger: any,
    policyid: number,
    projectsgitlab: any,
    rolesjenkins: any
}

export type GitlabProject = {
    label: string
    value: number
}

export type IpaGroup = {
    name: string
    id: string
}