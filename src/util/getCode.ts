export async function getGitHubDeviceCode() {
    const url = "https://github.com/login/device/code";
    const body = {
        client_id: "Ov23li4oSOJnog3suy7M",
        scope: "user"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error making the request:", error);
        throw error;
    }
}
