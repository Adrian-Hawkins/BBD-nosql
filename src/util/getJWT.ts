export async function pollGitHubDeviceCode(device_code: string) {
    const url = "https://github.com/login/oauth/access_token";
    const body = {
        client_id: "Ov23li4oSOJnog3suy7M",
        device_code: device_code,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code"
    };

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    while (true) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error === 'authorization_pending') {
                    await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds before retrying
                    continue;
                } else {
                    throw new Error(`Error: ${errorData.error_description}`);
                }
            }

            return await response.json();
        } catch (error) {
            console.error("Error making the request:", error);
            throw error;
        }
    }
}