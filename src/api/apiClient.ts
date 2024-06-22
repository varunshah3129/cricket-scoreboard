import axios, { AxiosInstance } from 'axios';
import { testRankingsStub } from '../stub/testRankingsStub';
import { odiRankingsStub } from '../stub/odiRankingsStub';
import { t20RankingsStub } from '../stub/t20RankingsStub';
import { liveStub } from '../stub/live_stub_data';
import { recentStub } from '../stub/recent_stub_data';
import { upComingStub } from '../stub/upcoming_stub_data';

const USE_STUB_DATA: boolean = false; // Set to true for using stub data

const BASE_URL: string = process.env.REACT_APP_API_BASE_URL || '';
const API_KEY: string = process.env.REACT_APP_API_KEY || '';

const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com',
    }
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const updateApiHitCount = () => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date
    const apiHitData = JSON.parse(localStorage.getItem('apiHitData') || '{}');
    if (apiHitData.date !== currentDate) {
        // Reset the counter if the date has changed
        apiHitData.date = currentDate;
        apiHitData.count = 0;
    }
    apiHitData.count += 1;
    localStorage.setItem('apiHitData', JSON.stringify(apiHitData));
};

const retryRequest = async (fn: () => Promise<any>, retries: number = 3, delayMs: number = 1000): Promise<any> => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0 && error.response && error.response.status === 429) {
            // 429 is the HTTP status code for rate limiting
            await delay(delayMs);
            return retryRequest(fn, retries - 1, delayMs * 2); // Exponential backoff
        } else {
            throw error;
        }
    }
};

apiClient.interceptors.request.use(config => {
    updateApiHitCount();
    return config;
});

export const fetchMatches = async (matchType: 'live' | 'recent' | 'upcoming'): Promise<any> => {
    if (USE_STUB_DATA) {
        console.log(`Using stub data for ${matchType} due to flag setting.`);
        switch (matchType) {
            case 'live':
                return liveStub;
            case 'recent':
                return recentStub;
            case 'upcoming':
                return upComingStub;
            default:
                throw new Error('Invalid match type');
        }
    } else {
        return retryRequest(() => apiClient.get(`/matches/v1/${matchType}`)).then(response => response.data);
    }
};

export const fetchMatchScoreCard = async (matchId: number): Promise<any> => {
    const url = `/mcenter/v1/${matchId}/hscard`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
        }
    };

    return retryRequest(() => apiClient.get(url, options)).then(response => response.data);
};

export const fetchFlagUrl = async (imageId: number): Promise<string> => {
    const url = `/img/v1/i1/c${imageId}/i.jpg`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
        }
    };

    return retryRequest(() => apiClient.get(url, options)).then(response => response.request.responseURL);
};

export const fetchRankings = async (formatType: 'test' | 'odi' | 't20', category: 'teams' | 'batsmen' | 'bowlers' | 'allrounders'): Promise<any> => {
    if (USE_STUB_DATA) {
        console.log(`Using stub data for ${formatType} ${category} rankings due to flag setting.`);
        switch (formatType) {
            case 'test':
                return testRankingsStub[category];
            case 'odi':
                return odiRankingsStub[category];
            case 't20':
                return t20RankingsStub[category];
            default:
                throw new Error('Invalid format type');
        }
    } else {
        const url = `/stats/v1/rankings/${category}?formatType=${formatType}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
            }
        };

        return retryRequest(() => apiClient.get(url, options)).then(response => response.data);
    }
};

export const fetchSeries = async (category: string): Promise<any> => {
    const url = `/series/v1/${category}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
        }
    };

    try {
        const response = await apiClient.get(url, options);
        return response.data;
    } catch (error) {
        console.error('Error fetching series data:', error);
        throw error;
    }
};

export const fetchPointsTable = async (seriesId: number): Promise<any> => {
    const url = `/stats/v1/series/${seriesId}/points-table`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
        }
    };

    return retryRequest(() => apiClient.get(url, options)).then(response => response.data);
};

export default apiClient;
