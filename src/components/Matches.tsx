import React, { useState, useEffect } from 'react';
import { ApiResponse, Match } from '../types/MatchTypes';
import { fetchMatches } from '../api/apiClient';
import LiveMatchScoreCard from './LiveMatchScoreCard';
import RecentMatchScoreCard from './RecentMatchScoreCard';
import UpcomingMatchScoreCard from './UpcomingMatchScoreCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../css/Matches.css';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const Matches = () => {
    const [matchesData, setMatchesData] = useState<ApiResponse | null>(null);
    const [matchFilter, setMatchFilter] = useState<'live' | 'recent' | 'upcoming'>('live');
    const [matchTypeFilters, setMatchTypeFilters] = useState(new Set(['International']));
    const [matchFormatFilters, setMatchFormatFilters] = useState(new Set(['TEST', 'ODI', 'T20']));
    const [showSpinner, setShowSpinner] = useState(false);
    const [lastRefreshTime, setLastRefreshTime] = useState<string | null>(null);
    const [expandedMatchId, setExpandedMatchId] = useState<number | null>(null);

    useEffect(() => {
        const loadMatches = async () => {
            try {
                const response = await fetchMatches(matchFilter);
                setMatchesData(response);
                setLastRefreshTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
            } catch (error) {
                console.error(`Failed to load ${matchFilter} matches:`, error);
            }
        };

        loadMatches();
    }, [matchFilter]);

    useEffect(() => {
        if (matchFilter === 'live') {
            const intervalId = setInterval(async () => {
                try {
                    const response = await fetchMatches('live');
                    setMatchesData(response);
                    setLastRefreshTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
                } catch (error) {
                    console.error('Failed to refresh live matches:', error);
                }
            }, 60000);

            const timeoutId = setTimeout(() => setShowSpinner(true), 50000); // Show spinner after 50 seconds
            const hideSpinnerTimeout = setTimeout(() => setShowSpinner(false), 60000); // Hide spinner after 60 seconds

            return () => {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                clearTimeout(hideSpinnerTimeout);
            };
        }
    }, [matchFilter]);

    const filterMatches = (): Match[] => {
        if (!matchesData || !matchesData.typeMatches) return [];

        return matchesData.typeMatches.flatMap(series =>
            series.seriesMatches.flatMap(seriesMatch =>
                seriesMatch.seriesAdWrapper?.matches.map(match => ({
                    ...match,
                    seriesName: seriesMatch.seriesAdWrapper?.seriesName
                })).filter((match: any) => {
                    if (matchTypeFilters.size > 0 && !matchTypeFilters.has(series.matchType)) {
                        return false;
                    }

                    const state = match.matchInfo.state;
                    if (matchFilter === 'live') return ['In Progress', 'Stumps', 'Complete'].includes(state) && match.matchScore;
                    if (matchFilter === 'recent')
                        return state === 'Complete' || match.matchInfo.status.toLowerCase().includes('abandoned');
                    if (matchFilter === 'upcoming') return state === 'Upcoming';
                    return false;
                }).sort((a, b) => new Date(a.matchInfo.startDate).getTime() - new Date(b.matchInfo.startDate).getTime()) ?? []
            )
        );
    };

    const toggleMatchTypeFilter = (type: string) => {
        const updatedFilters = new Set(matchTypeFilters);
        if (updatedFilters.has(type)) {
            updatedFilters.delete(type);
        } else {
            updatedFilters.add(type);
        }
        setMatchTypeFilters(updatedFilters);
    };

    const toggleMatchFormatFilter = (format: string) => {
        const updatedFilters = new Set(matchFormatFilters);
        if (updatedFilters.has(format)) {
            updatedFilters.delete(format);
        } else {
            updatedFilters.add(format);
        }
        setMatchFormatFilters(updatedFilters);
    };

    const resetFilters = () => {
        setMatchTypeFilters(new Set(['International']));
        setMatchFormatFilters(new Set(['TEST', 'ODI', 'T20']));
    };

    const setFilter = (filterType: 'live' | 'recent' | 'upcoming') => {
        setMatchFilter(filterType);
        resetFilters();
    };

    const handleMatchClick = async (matchId: number) => {
        if (expandedMatchId === matchId) {
            setExpandedMatchId(null); // Collapse if the same match is clicked again
        } else {
            setExpandedMatchId(matchId); // Expand the clicked match
        }
    };

    return (
        <div className="matches-container">
            <div className="filter-buttons">
                <button className={`filter-button ${matchFilter === 'live' ? 'active' : ''}`} onClick={() => setFilter('live')}>Live Score</button>
                <button className={`filter-button ${matchFilter === 'recent' ? 'active' : ''}`} onClick={() => setFilter('recent')}>Match Results</button>
                <button className={`filter-button ${matchFilter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>Upcoming Fixtures</button>
            </div>

            {(matchFilter === 'live' || matchFilter === 'recent' || matchFilter === 'upcoming') && matchesData?.filters.matchType && (
                <div className="subfilter-buttons">
                    <button className="btn btn-sm reset-filter-button m-1 btn-outline-info" onClick={resetFilters}>
                        Reset
                    </button>
                    <span className="filter-divider">|</span>
                    {matchesData.filters.matchType.map(type => {
                        const hasMatches = matchesData.typeMatches.some(series =>
                            series.seriesMatches.some(seriesMatch =>
                                seriesMatch.seriesAdWrapper?.matches.some(match =>
                                        series.matchType === type && (
                                            (matchFilter === 'live' && ['In Progress', 'Stumps', 'Complete'].includes(match.matchInfo.state)) ||
                                            (matchFilter === 'recent' && match.matchInfo.state === 'Complete') ||
                                            (matchFilter === 'upcoming' && match.matchInfo.state === 'Upcoming')
                                        )
                                )
                            )
                        );

                        return (
                            <button
                                key={type}
                                onClick={() => toggleMatchTypeFilter(type)}
                                className={`btn btn-sm sub-filter-button ${matchTypeFilters.has(type) ? 'btn-primary' : 'btn-outline-primary'} ${!hasMatches ? '' : 'has-matches'} m-1`}
                                disabled={!hasMatches}>
                                {type === 'International' ? "Int'l" : type}
                                {matchTypeFilters.has(type) && <FontAwesomeIcon icon={faTimes} />}
                            </button>
                        );
                    })}

                    {/* Rendering subfilter buttons for match format */}
                    {['TEST', 'ODI', 'T20'].map(format => {
                        const hasMatches = matchesData.typeMatches.some(series =>
                            series.seriesMatches.some(seriesMatch =>
                                seriesMatch.seriesAdWrapper?.matches.some(match =>
                                        match.matchInfo.matchFormat === format && (
                                            (matchFilter === 'live' && ['In Progress', 'Stumps', 'Complete'].includes(match.matchInfo.state)) ||
                                            (matchFilter === 'recent' && match.matchInfo.state === 'Complete') ||
                                            (matchFilter === 'upcoming' && match.matchInfo.state === 'Upcoming')
                                        )
                                )
                            )
                        );

                        return (
                            <button
                                key={format}
                                onClick={() => toggleMatchFormatFilter(format)}
                                className={`btn btn-sm sub-filter-button ${matchFormatFilters.has(format) ? 'btn-primary' : 'btn-outline-primary'} ${!hasMatches ? '' : 'has-matches'} m-1`}
                                disabled={!hasMatches}>
                                {format}
                                {matchFormatFilters.has(format) && <FontAwesomeIcon icon={faTimes} />}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="matches-list">
                {matchesData?.typeMatches.map((typeMatch, index) => (
                    (matchTypeFilters.size === 0 || matchTypeFilters.has(typeMatch.matchType)) && (
                        <div className="match-types-div" key={index}>
                            <div className='row justify-content-center'>
                                <div className='col-lg-8 col-sm-6 col-md-6'>
                                    <h4 className='match-level text-align-center'>{typeMatch.matchType}</h4>
                                </div>
                            </div>
                            <div className={`row justify-content-center match-type-${typeMatch.matchType}`}>
                                {typeMatch.seriesMatches.flatMap(seriesMatch =>
                                    seriesMatch.seriesAdWrapper?.matches.filter(match =>
                                            matchTypeFilters.has(typeMatch.matchType) && (
                                                (matchFilter === 'live' && ['In Progress', 'Stumps', 'Complete'].includes(match.matchInfo.state)) ||
                                                (matchFilter === 'recent' && match.matchInfo.state === 'Complete') ||
                                                (matchFilter === 'upcoming' && match.matchInfo.state === 'Upcoming')
                                            )
                                    ).map(match => (
                                        <div key={match.matchInfo.matchId}
                                             className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                                            <div className="match-card-container" onClick={() => handleMatchClick(match.matchInfo.matchId)}>
                                                {renderMatchCard(matchFilter, {
                                                    ...match,
                                                    seriesName: seriesMatch.seriesAdWrapper?.seriesName || ''
                                                }, lastRefreshTime, showSpinner)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );

    function renderMatchCard(filter: 'live' | 'recent' | 'upcoming', match: Match & { seriesName: string }, lastRefreshTime: string | null, showSpinner: boolean) {
        const commonProps = {
            seriesName: match.seriesName,
            matchStatus: match.matchInfo.state,
            team1: match.matchInfo.team1.teamSName,
            team2: match.matchInfo.team2.teamSName,
            matchFormat: match.matchInfo.matchFormat,
            startDate: match.matchInfo.startDate,
            venue: match.matchInfo.venueInfo,
        };

        switch (filter) {
            case 'live':
                return (
                    <LiveMatchScoreCard
                        {...commonProps}
                        team1Score={match.matchScore?.team1Score || {}}
                        team2Score={match.matchScore?.team2Score || {}}
                        matchResult={match.matchInfo.status}
                        lastRefreshTime={lastRefreshTime}
                        showSpinner={showSpinner}
                        matchId={match.matchInfo.matchId}
                    />
                );
            case 'recent':
                return (
                    <RecentMatchScoreCard
                        {...commonProps}
                        team1Score={match.matchScore?.team1Score || {}}
                        team2Score={match.matchScore?.team2Score || {}}
                        matchResult={match.matchInfo.status}
                        matchId={match.matchInfo.matchId}
                    />
                );
            case 'upcoming':
                return (
                    <UpcomingMatchScoreCard
                        {...commonProps}
                        matchStatus={match.matchInfo.matchDesc}
                        matchResult={match.matchInfo.status}
                    />
                );
            default:
                return null;
        }
    }
};

export default Matches;
