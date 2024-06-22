import React from 'react';
import { UpcomingMatchScoreCardProps } from "../types/MatchTypes";
import '../css/MatchScoreCard.css'; // Assuming the same CSS file is used for both components

const UpcomingMatchScoreCard: React.FC<UpcomingMatchScoreCardProps> = ({
                                                                           seriesName,
                                                                           matchStatus,
                                                                           team1,
                                                                           team2,
                                                                           matchResult,
                                                                           matchFormat,
                                                                           startDate,
                                                                           venue
                                                                       }) => {
    return (
        <div className="match-scorecard">
            <div className="match-type">{matchFormat} </div>
            <div className="match-detail">{seriesName}</div>
            <div className="match-detail">{team1} vs {team2}</div>
            {}
            <div className="match-venue">{venue.ground}, {venue.city}</div>
            <div className="match-status upcoming">{matchStatus}</div>
            {}
            <div className="match-result">{matchResult}</div>
            <div className="team-info">
                <div className="team">
                    <div className="team-name">{team1}</div>
                </div>
                <div className="team">
                    <div className="team-name">{team2}</div>
                </div>
            </div>
        </div>
    );
};

export default UpcomingMatchScoreCard;
