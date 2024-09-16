import axios from 'axios';
import qs from 'qs';
import config from '../constants/authConfig'

export type TokenResponse = {
    access_token: string
    refresh_token: string
    scope: string
    id_token: string
    token_type: string
    expires_in: number
}

export type UserDataResponse = {
    sub: string
    given_name?: string
    family_name?: string
    email?: string
    name?: string
    preferred_username?: string
    nickname?: string
}

export class AuthenticationService {

    SESSION_KEY = "AUTH_SESSION"
    SESSION_TOKEN = `${this.SESSION_KEY}_TOKEN`
    SESSION_USER = `${this.SESSION_KEY}_USERINFO`

    async init() {
        return true; new Promise(async (resolve, reject) => {
            if (this.hasUserData()) {
                resolve(null);
                return;
            }

            if (this.hasSessionToken()) {
                await this.getUserData()
                resolve(null);
                return;
            }

            if (this.hasIdTokenHash()) {
                console.info("hasIdTokenParameter")
                const token = this.getIdTokenHash()
                if (token) {
                    this.decodeIdToken(token);
                    this.removeHash()
                    resolve(null);
                    return;
                }
            }

            if (this.hasCodeParameter()) {
                console.info("hasCodeParameter")
                try {
                    await this.getApiTokenFromCode();
                    await this.getUserData()
                    this.removeCodeParameter();
                    resolve(null);
                    return;
                } catch (e) {
                    throw e
                }
            }

            this.gotoLoginPage()
            reject()
        })
    }

    hasSessionToken() {
        return sessionStorage.getItem(this.SESSION_TOKEN) !== null;
    }

    hasUserData() {
        return sessionStorage.getItem(new AuthenticationService().SESSION_USER) !== null;
    }

    hasCodeParameter() {
        const params = new URLSearchParams(window.location.search);
        return params.has('code');
    }

    hasIdTokenHash() {
        const hash = window.location.hash;
        return hash.includes("id_token=")
    }

    getIdTokenHash() {
        const hash = window.location.hash.replace("#", "").split("&");
        const id_token = hash.find(item => item.includes("id_token"))?.replace("id_token=", "")
        return id_token;
    }

    decodeIdToken(token: string): UserDataResponse {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const data = JSON.parse(jsonPayload);
        sessionStorage.setItem(this.SESSION_USER, JSON.stringify(data))
        return data
    }

    getCodeParameter() {
        const params = new URLSearchParams(window.location.search);
        return params.get('code')
    }

    removeCodeParameter() {
        const params = new URLSearchParams(window.location.search);
        params.delete('code');
        params.delete('session_state');
        const newUrl = window.location.origin + '?' + params.toString();
        window.history.replaceState({}, '', newUrl);
    }

    removeHash() {
        window.location.hash = "";
    }

    gotoLoginPage() {
        const url = `${config.baseUrl}/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${config.signinRedirect}&response_type=${config.response_type}&scope=${config.scope.join("+")}&nonce=${Date.now()}`
        window.open(url, "_self");
    }

    async getApiTokenFromCode() {
        const url = `${config.baseUrl}/oauth2/token`
        const data = qs.stringify({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: "authorization_code",
            redirect_uri: config.signinRedirect,
            code: this.getCodeParameter()
        })

        try {
            const response = await axios<TokenResponse>({
                method: "POST",
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                url,
                data
            })
            sessionStorage.setItem(this.SESSION_TOKEN, JSON.stringify(response.data))

        } catch (e) {
            throw e;
        }
    }

    async getUserData() {
        const url = `${config.baseUrl}/oauth2/userinfo`
        try {
            const response = await axios<UserDataResponse>({
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${this.getSessionToken()}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {},
                url
            })
            sessionStorage.setItem(this.SESSION_USER, JSON.stringify(response.data))
        } catch (e) {
            throw e;
        }
    }

    static get userData() {
        const value = sessionStorage.getItem(new AuthenticationService().SESSION_USER);
        if (value) {
            const data = JSON.parse(value) as UserDataResponse
            return data;
        }
    }

    getSessionToken() {
        const data = JSON.parse(sessionStorage.getItem(this.SESSION_TOKEN) || "") as TokenResponse
        return data.access_token
    }

}