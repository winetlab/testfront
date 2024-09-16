import { AuthenticationService } from "../services/authentication.service";

function useAuth() {

    const userData = AuthenticationService.userData

    const userName = userData?.given_name || userData?.name || userData?.preferred_username || userData?.nickname || userData?.sub;
    const userEmail = userData?.email
    const userId = userData?.sub

    function stringToHslColor(s: number, l: number) {
        var hash = 0;
        if (!userName) return '';
        for (var i = 0; i < (userName?.length || 0); i++) {
            hash = (userName || "A").charCodeAt(i) + ((hash << 5) - hash);
        }

        var h = hash % 360;
        return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    }

    const firstLetters = () => {
        return userName?.split(" ").map((word: string) => word.slice(0, 1)).join("").toUpperCase();
    }

    const logout = () => {
        new AuthenticationService().logout();
    }

    return {
        userId,
        userName,
        userEmail,
        stringToHslColor,
        firstLetters,
        logout
    }
}

export default useAuth
