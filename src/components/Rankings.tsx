import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchRankings } from '../api/apiClient';
import '../css/Ranking.css';

const Rankings = () => {
    const [formatFilter, setFormatFilter] = useState<'test' | 'odi' | 't20'>('test');
    const [categoryFilter, setCategoryFilter] = useState<'teams' | 'batsmen' | 'bowlers' | 'allrounders'>('teams');
    const [rankingsData, setRankingsData] = useState<any[]>([]);

    const setFormat = (format: 'test' | 'odi' | 't20') => {
        setFormatFilter(format);
        setCategoryFilter('teams'); // Reset subfilter to 'teams' when main filter changes
    };

    const setCategory = (category: 'teams' | 'batsmen' | 'bowlers' | 'allrounders') => {
        setCategoryFilter(category);
    };

    useEffect(() => {
        const loadRankings = async () => {
            try {
                const data = await fetchRankings(formatFilter, categoryFilter);
                setRankingsData(data.rank);
            } catch (error) {
                console.error(`Failed to load ${formatFilter} ${categoryFilter} rankings:`, error);
            }
        };

        loadRankings();
    }, [formatFilter, categoryFilter]);

    const getTitle = () => {
        const formatTitles = {
            test: 'Test',
            odi: 'ODI',
            t20: 'Twenty20'
        };

        const categoryTitles = {
            teams: 'Teams',
            batsmen: 'Batsmen',
            bowlers: 'Bowlers',
            allrounders: 'Allrounders'
        };

        return `ICC ${formatTitles[formatFilter]} Rankings - ${categoryTitles[categoryFilter]}`;
    };

    return (
        <div className="rankings-container">
            <div className="rankings-filter-buttons">
                <button className={`rankings-filter-button ${formatFilter === 'test' ? 'active' : ''}`}
                        onClick={() => setFormat('test')}>Test
                </button>
                <button className={`rankings-filter-button ${formatFilter === 'odi' ? 'active' : ''}`}
                        onClick={() => setFormat('odi')}>ODI
                </button>
                <button className={`rankings-filter-button ${formatFilter === 't20' ? 'active' : ''}`}
                        onClick={() => setFormat('t20')}>T20
                </button>
            </div>

            <div className="rankings-subfilter-buttons d-flex justify-content-center">
                {['teams', 'batsmen', 'bowlers', 'allrounders'].map(category => (
                    <button
                        key={category}
                        onClick={() => setCategory(category as 'teams' | 'batsmen' | 'bowlers' | 'allrounders')}
                        className={`btn btn-sm rankings-sub-filter-button ${categoryFilter === category ? 'btn-primary' : 'btn-outline-primary'} m-1`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        {categoryFilter === category && <FontAwesomeIcon icon={faTimes}/>}
                    </button>
                ))}
            </div>

            <div className="rankings-list">
                <div className='row justify-content-center'>
                    <div className='col-lg-6 col-sm-12 col-md-8'>
                        <h4 className="rankings-title">{getTitle()}</h4>
                        <table>
                            <thead>
                            {categoryFilter === 'teams' ? (
                                <tr>
                                    <th>Position</th>
                                    <th>Team</th>
                                    <th>Rating</th>
                                    <th>Points</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th>Rank</th>
                                    <th>Name</th>
                                    <th>Country</th>
                                    <th>Rating</th>
                                </tr>
                            )}
                            </thead>
                            <tbody>
                            {rankingsData.map((item: any) => (
                                categoryFilter === 'teams' ? (
                                    <tr key={item.id}>
                                        <td data-label="Position">{item.rank}</td>
                                        <td data-label="Team">{item.name}</td>
                                        <td data-label="Rating">{item.rating}</td>
                                        <td data-label="Points">{item.points}</td>
                                    </tr>
                                ) : (
                                    <tr key={item.id}>
                                        <td data-label="Rank">{item.rank}</td>
                                        <td data-label="Name">{item.name}</td>
                                        <td data-label="Country">{item.country}</td>
                                        <td data-label="Rating">{item.rating}</td>
                                    </tr>
                                )
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rankings;
