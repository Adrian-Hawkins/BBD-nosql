export async function isGitHubTokenValid(token: string): Promise<boolean> {
    const url = "https://api.github.com/user";
    const headers = {
        'Authorization': token,
        'Accept': 'application/json'
    };

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        return response.ok;
    } catch (error) {
        console.error("Error making the request:", error);
        return false;
    }
}
