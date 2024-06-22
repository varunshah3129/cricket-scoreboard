import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define types for the cricket scores
type CricketScore = {
    league: string;
    matchInfo: string;
    score: string;
};

const ScoreBoard: React.FC = () => {
    const [scores, setScores] = useState<CricketScore[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await axios.get('https://api.rapidapi.com/scores', {
                    headers: {
                        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY, // Use the API key from the .env file
                        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
                    }
                });
                setScores(response.data); // Replace with actual data path
            } catch (error) {
                setError('Failed to fetch scores');
                console.error(error);
            }
        };

        fetchScores();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="scoreboard">
            {scores.map((score, index) => (
                <div key={index} className="match">
                    <div className="league">{score.league}</div>
                    <div className="matchInfo">{score.matchInfo}</div>
                    <div className="score">{score.score}</div>
                </div>
            ))}
        </div>
    );
};

export default ScoreBoard;
