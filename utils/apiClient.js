
const axios = require('axios');

const apiClient = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    timeout: 10000, // 10 seconds timeout
    maxRetries: 3,
    retryDelay: 2000, // 2 seconds between retries
});

const makeRequestWithRetry = async (url, retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Retry ${i + 1}/${retries} for ${url}`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

module.exports = { makeRequestWithRetry };