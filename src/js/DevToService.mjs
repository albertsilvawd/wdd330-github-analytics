const DEVTO_URL = 'https://dev.to/api';

async function convertToJson(res) {
    const json = await res.json();
    if (res.ok) {
        return json;
    } else {
        throw { name: 'DevToError', message: json.error || 'DEV.to API error' };
    }
}

export default class DevToService {
    async getArticlesByUsername(username) {
        const response = await fetch(
            `${DEVTO_URL}/articles?username=${username}&per_page=4`
        );
        return await convertToJson(response);
    }
}