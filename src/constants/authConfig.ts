export default {
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
    clientSecret: import.meta.env.VITE_AUTH_CLIENT_SECRET,
    baseUrl: import.meta.env.VITE_AUTH_URL,
    signinRedirect: import.meta.env.VITE_AUTH_REDIRECT_URL,
    response_type: "id_token",
    scope: ["openid", "profile", "email"]
}