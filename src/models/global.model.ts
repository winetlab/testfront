import { GitlabProject, IpaGroup } from "./api.model";

export type GlobalContext = {
    openNotification: (message: string, description: string, type: NotificationType) => void
    gitlabProjects: GitlabProject[]
    jenkinsRoles: GitlabProject[]
    rangerPolicies: GitlabProject[]
    ipaGroups: IpaGroup[]
}

export type NotificationType = 'success' | 'info' | 'warning' | 'error';