import React from 'react';
import { FullScoreCardProps, BatsmanData, BowlerData, InningsData } from '../types/MatchTypes';
import '../css/FullScoreCard.css';

const FullScoreCard: React.FC<FullScoreCardProps> = ({ scoreCard = [] }) => {
    if (!scoreCard.length) return <p>No scorecard data available.</p>;

    return (
        <div className="full-score-details">
            {scoreCard.map((innings: InningsData, index: React.Key | null | undefined) => (
                <div key={index} className="innings-section">
                    <h4 className="innings-title">{innings?.batTeamDetails?.batTeamName} - Innings {innings?.inningsId}</h4>
                    <h5 className="section-title">Batting</h5>
                    <table className="score-table">
                        <thead>
                        <tr>
                            <th>Batter</th>
                            <th>Dismissal</th>
                            <th>R</th>
                            <th>B</th>
                            <th>4's</th>
                            <th>6's</th>
                            <th>SR</th>
                        </tr>
                        </thead>
                        <tbody>
                        {innings?.batTeamDetails?.batsmenData
                            ? Object.values(innings.batTeamDetails.batsmenData).map((batsman: BatsmanData) => (
                                <tr key={batsman?.batId}>
                                    <td>{batsman?.batName}</td>
                                    <td>{batsman?.outDesc}</td>
                                    <td>{batsman?.runs}</td>
                                    <td>{batsman?.balls}</td>
                                    <td>{batsman?.fours}</td>
                                    <td>{batsman?.sixes}</td>
                                    <td>{batsman?.strikeRate?.toFixed(2)}</td>
                                </tr>
                            ))
                            : <tr><td colSpan={7}>No batting data available</td></tr>}
                        </tbody>
                    </table>
                    <h5 className="section-title">Bowling</h5>
                    <table className="score-table">
                        <thead>
                        <tr>
                            <th>Bowler</th>
                            <th>Overs</th>
                            <th>Runs</th>
                            <th>Wickets</th>
                            <th>Economy</th>
                        </tr>
                        </thead>
                        <tbody>
                        {innings?.bowlTeamDetails?.bowlersData
                            ? Object.values(innings.bowlTeamDetails.bowlersData).map((bowler: BowlerData) => (
                                <tr key={bowler?.bowlerId}>
                                    <td>{bowler?.bowlName}</td>
                                    <td>{bowler?.overs}</td>
                                    <td>{bowler?.runs}</td>
                                    <td>{bowler?.wickets}</td>
                                    <td>{(bowler?.runs / bowler?.overs).toFixed(2)}</td>
                                </tr>
                            ))
                            : <tr><td colSpan={5}>No bowling data available</td></tr>}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default FullScoreCard;
