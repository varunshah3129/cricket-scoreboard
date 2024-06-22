import React, { useEffect, useState } from 'react';
import { fetchPointsTable } from '../api/apiClient';
import '../css/PointsTable.css';

interface PointsTableProps {
    seriesId: number;
}

const PointsTable: React.FC<PointsTableProps> = ({ seriesId }) => {
    const [pointsTableData, setPointsTableData] = useState<any>(null);
    const [activeGroup, setActiveGroup] = useState<number | null>(null);

    useEffect(() => {
        const loadPointsTableData = async () => {
            try {
                const response = await fetchPointsTable(seriesId);
                setPointsTableData(response.pointsTable);
                if (response.pointsTable.length > 0) {
                    setActiveGroup(0);
                }
            } catch (error) {
                console.error('Failed to load points table data:', error);
            }
        };

        loadPointsTableData();
    }, [seriesId]);

    const renderPointsTable = () => {
        if (!pointsTableData) {
            return null;
        }

        const group = pointsTableData[activeGroup!];

        return (
            <div className="points-table-group">
                <h3>{group.groupName}</h3>
                <table className="points-table">
                    <thead>
                    <tr>
                        <th>POS</th>
                        <th>TEAM</th>
                        <th>PLAYED</th>
                        <th>WON</th>
                        <th>LOST</th>
                        <th>N/R</th>
                        <th>TIED</th>
                        <th>NET RR</th>
                        <th>POINTS</th>
                    </tr>
                    </thead>
                    <tbody>
                    {group.pointsTableInfo.map((team: any, idx: number) => (
                        <tr key={team.teamId}>
                            <td>{idx + 1}</td>
                            <td className="team-name">
                                <img
                                    src={`https://www.cricbuzz.com/a/img/v1/50x50/i1/c${team.teamImageId}/team-flag.jpg`}
                                    alt={team.teamName}
                                    className="team-flag"
                                />
                                {team.teamName}
                            </td>
                            <td>{team.matchesPlayed}</td>
                            <td>{team.matchesWon}</td>
                            <td>{team.matchesLost || 0}</td>
                            <td>{team.matchesNR || 0}</td>
                            <td>{team.matchesTied || 0}</td>
                            <td>{team.nrr}</td>
                            <td>{team.points}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="points-table-container">
            {pointsTableData && pointsTableData.length > 1 && (
                <div className="subgroup-filter-buttons">
                    {pointsTableData.map((group: any, index: number) => (
                        <button
                            key={index}
                            className={`group-subgroup-filter-button ${activeGroup === index ? 'active' : ''}`}
                            onClick={() => setActiveGroup(index)}
                        >
                            {group.groupName}
                        </button>
                    ))}
                </div>
            )}
            {pointsTableData && pointsTableData.length > 0 ? (
                <div className="points-table-grid">
                    {renderPointsTable()}
                </div>
            ) : (
                <p className="no-points-table">No points table available.</p>
            )}
        </div>
    );
};

export default PointsTable;
