import axios from 'axios'
import { GitlabProject, IpaGroup, Policy, User } from '../models/api.model'

const BASE_URL = import.meta.env.VITE_API_URL

const API_TOKEN_URL = import.meta.env.VITE_API_TOKEN_URL || ""
const API_CONSUMER_KEY = import.meta.env.VITE_API_CONSUMER_KEY || ""
const API_CONSUMER_SECRET = import.meta.env.VITE_API_CONSUMER_SECRET || ""

class ApiClient {
    instance;

    constructor() {
        const APPLICATION_CONTENT_TYPE = 'application/json'
        const APPLICATION_ACCEPT = 'application/json'

        this.instance = axios.create({
            baseURL: 'http://localhost:5000',
            //BASE_URL,
            headers: {
                common: { Accept: APPLICATION_ACCEPT },
                get: { 'Content-Type': APPLICATION_CONTENT_TYPE },
                post: { 'Content-Type': APPLICATION_CONTENT_TYPE },
                put: { 'Content-Type': APPLICATION_CONTENT_TYPE },
            }
        })

    }

    async generateToken() {
        try {

            const basic64 = btoa(`${API_CONSUMER_KEY}:${API_CONSUMER_SECRET}`)

            const encodedParams = new URLSearchParams();
            encodedParams.set('grant_type', 'client_credentials');

            var options = {
                method: 'POST',
                url: API_TOKEN_URL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${basic64}`,
                },
                data: encodedParams,
            };

            const response = await axios.request(options);
            return response.data.access_token;
        } catch (err: any) {
            console.error(err);
            return { error: true, message: err.message };
        }
    }

    async getApiToken() {
        // return import.meta.env.VITE_API_TOKEN;
        if (sessionStorage.getItem("API_TOKEN")) {
            return sessionStorage.getItem("API_TOKEN")
        } else {
            return await this.generateToken()
        }
    }

    async get(url: string, config: any = {}) {
        config.headers = {
            Authorization: `Bearer ${await this.getApiToken()}`
        }
        return this.instance.get(url, { ...config, data: {} })
    }

    async delete(url: string, data = {}, config: any = {}) {
        config.headers = {
            Authorization: `Bearer ${await this.getApiToken()}`
        }
        return this.instance.delete(url, { ...config, data })
    }

    async post(url: string, data = {}, config: any = {}) {
        config.headers = {
            Authorization: `Bearer ${await this.getApiToken()}`
        }
        return this.instance.post(url, data, config)
    }

    async put(url: string, data = {}, config: any = {}) {
        config.headers = {
            Authorization: `Bearer ${await this.getApiToken()}`
        }
        return this.instance.put(url, data, config)
    }

    async getAllUsers(): Promise<User[]> {
        const response = await this.get('/user')
        return response.data
    }

    async getAllPolicies(): Promise<Policy[]> {
        const response = await this.get('/policy')
        return response.data
    }

    async getUser(username: string): Promise<User> {
        const response = await this.get(`/user?username=${username}`)
        return response.data
    }

    async createUser(data: any): Promise<string> {
        const response = await this.post('/user', data)
        return response.data
    }

    async createUserServices(username: string): Promise<string> {
        const response = await this.post('/user/create', { username })
        return response.data
    }

    async updateUser(userupdate: string, data: any): Promise<string> {
        const sendData = {
            userupdate,
            firstName: data.firstname,
            lastName: data.lastname,
            email: data.email,
            username: data.username
        }
        const response = await this.put('/user', sendData)
        return response.data
    }

    async updateUserStatus(username: string, newStatus: string): Promise<string> {
        const data = {
            username,
            validation: newStatus
        }
        const response = await this.put('/validateUser', data)
        return response.data
    }

    async deleteUser(usertodelete: string): Promise<string> {
        const data = {
            usertodelete
        }
        const response = await this.delete('/user', data)
        return response.data
    }

    async getGitlabProjects(): Promise<GitlabProject[]> {
        const response = await this.get(`/gitlab/project`)
        return response.data
    }

    async getJenkinsRoles(): Promise<GitlabProject[]> {
        const response = await this.get(`/jenkins/getRoles`)
        return response.data
    }

    async getRangerPolicies(): Promise<GitlabProject[]> {
        const response = await this.get(`/ranger/getPolicies`)
        return response.data
    }

    async getIpaGroups(): Promise<IpaGroup[]> {
        const response = await this.get(`/ipa/getGroups`)
        return response.data
    }

    async createGroup(data: any): Promise<string> {
        const response = await this.post('/policy', data)
        return response.data
    }

    async updateGroup(data: any): Promise<string> {
        const response = await this.put('/policy', data)
        return response.data
    }

    async updateGroupMembers(policyid: number, usernames: string[]): Promise<string> {
        const response = await this.post('/user/policy', { policyid, usernames })
        return response.data
    }

    async getGroup(policyid: string): Promise<Policy> {
        const response = await this.get(`/policy?policyid=${policyid}`)
        return response.data
    }

    async deleteGroup(policytodelete: string): Promise<string> {
        const response = await this.delete(`/policy`, { policytodelete })
        return response.data
    }

    async addUserToGitlab(usernames: string[], projects: any[]): Promise<string> {
        const data: { usernames: string[], projects: any } = {
            usernames,
            projects
        }
        const response = await this.post(`/gitlab/project`, data)
        return response.data
    }

    async addUserToJenkins(usernames: string[], rolejenkins: any[]): Promise<string> {
        const data = {
            usernames,
            rolejenkins
        }
        const response = await this.post(`/jenkins/assignRole`, data)
        return response.data
    }

    async addUserToRanger(usernames: string[], rangerpolicies: any[]): Promise<string> {
        const data = {
            usernames,
            rangerpolicies
        }
        const response = await this.post(`/ranger/addToPolicy`, data)
        return response.data
    }

    async addUserToFreeIpa(usernames: string[], groupIPA: any[]): Promise<string> {
        const data = {
            usernames,
            groupIPA
        }
        const response = await this.post(`/ipa/group`, data)
        return response.data
    }


}

export default ApiClient
