import React, { useState, useEffect } from 'react';
import { fetchSeries } from '../api/apiClient';
import PointsTable from './PointsTable';
import '../css/Standings.css';

const Standings = () => {
    const [seriesData, setSeriesData] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<'international' | 'league' | 'women'>('international');
    const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);

    useEffect(() => {
        const loadSeriesData = async (category: 'international' | 'league' | 'women') => {
            try {
                const response = await fetchSeries(category);
                setSeriesData(response.seriesMapProto);
            } catch (error) {
                console.error('Failed to load series data:', error);
            }
        };

        loadSeriesData(activeFilter);
    }, [activeFilter]);

    const handleFilterClick = (filter: 'international' | 'league' | 'women') => {
        setActiveFilter(filter);
        setSelectedSeriesId(null); // Reset the selected series when filter changes
    };

    const handleSeriesClick = (seriesId: number) => {
        setSelectedSeriesId(seriesId);
    };

    const renderSeries = () => {
        return seriesData
            .flatMap((group) => group.series)
            .filter((series) => activeFilter === 'league' ? true : series.name.startsWith('ICC'))
            .map((series) => (
                <div
                    key={series.id}
                    className={`standings-sub-filter-button btn btn-sm btn-outline-primary m-1 ${selectedSeriesId === series.id ? 'active' : ''}`}
                    onClick={() => handleSeriesClick(series.id)}
                >
                    {series.name}
                </div>
            ));
    };

    return (
        <div className="standings-container">
            <div className="standings-filter-buttons">
                <button
                    className={`standings-filter-button ${activeFilter === 'international' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('international')}
                >
                    International
                </button>
                <button
                    className={`standings-filter-button ${activeFilter === 'league' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('league')}
                >
                    League
                </button>
                <button
                    className={`standings-filter-button ${activeFilter === 'women' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('women')}
                >
                    Women
                </button>
            </div>
            <div className="standings-subfilter-buttons">{renderSeries()}</div>
            {selectedSeriesId && <PointsTable seriesId={selectedSeriesId} />}
        </div>
    );
};

export default Standings;
