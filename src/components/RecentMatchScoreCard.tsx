import React, { useState } from 'react';
import { MatchScoreCardProps, TeamScoreDetail, InningsData } from "../types/MatchTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import FullScoreCard from './FullScoreCard';
import { fetchMatchScoreCard } from '../api/apiClient';
import '../css/MatchScoreCard.css';

interface RecentMatchScoreCardProps extends MatchScoreCardProps {
    matchId: number;
}

const RecentMatchScoreCard: React.FC<RecentMatchScoreCardProps> = ({
                                                                       seriesName,
                                                                       matchStatus,
                                                                       team1,
                                                                       team2,
                                                                       team1Score,
                                                                       team2Score,
                                                                       matchResult,
                                                                       matchFormat,
                                                                       startDate,
                                                                       venue,
                                                                       matchId
                                                                   }) => {
    const [expanded, setExpanded] = useState(false);
    const [fullScoreCard, setFullScoreCard] = useState<InningsData[]>([]);
    const [loading, setLoading] = useState(false);

    const renderScore = (score: TeamScoreDetail | undefined, inningsTitle: string) => {
        return score ? (
            <div className="team-score">
                <strong>{inningsTitle}: {score.runs}/{score.wickets} ({score.overs} Ov)</strong>
            </div>
        ) : null;
    };

    const renderMatchResult = (result: string) => {
        return result ? <div className="match-result"><strong>{result}</strong></div> : null;
    };

    const renderMatchStartTime = (startDate: string) => {
        const date = new Date(Number(startDate));
        return `${date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}`;
    };

    const toggleExpand = async () => {
        setExpanded(!expanded);

        if (!expanded && fullScoreCard.length === 0) {
            setLoading(true);
            try {
                const scoreCardData = await fetchMatchScoreCard(matchId);
                setFullScoreCard(scoreCardData.scoreCard);
            } catch (error) {
                console.error("Error fetching full scorecard data:", error);
            }
            setLoading(false);
        }
    };

    return (
        <div className={`match-scorecard ${expanded ? 'expanded' : ''}`}>
            <div className={`match-status ${matchStatus.toLowerCase() === "in progress" ? "in-progress" : matchStatus.toLowerCase()}`}>{matchStatus}</div>
            <div className="match-detail">{seriesName}</div>
            <div className="match-detail">{team1} vs {team2}</div>
            <div className="match-type">{matchFormat} </div>
            <div className="match-venue">{venue.ground}, {venue.city}</div>
            <div className="match-start-time">{renderMatchStartTime(startDate)}</div>
            <div className="team-info">
                <div className="team">
                    <div className="team-name">{team1}</div>
                    {team1Score?.inngs1 && renderScore(team1Score.inngs1, 'Inngs 1')}
                    {team1Score?.inngs2 && renderScore(team1Score.inngs2, 'Inngs 2')}
                </div>
                <div className="team">
                    <div className="team-name">{team2}</div>
                    {team2Score?.inngs1 && renderScore(team2Score.inngs1, 'Inngs 1')}
                    {team2Score?.inngs2 && renderScore(team2Score.inngs2, 'Inngs 2')}
                </div>
            </div>
            {renderMatchResult(matchResult)}
            {expanded && (
                <div className="expanded-scorecard">
                    {loading ? (
                        <div className="spinner-container">
                            <FontAwesomeIcon icon={faSpinner} spin />
                        </div>
                    ) : (
                        <FullScoreCard scoreCard={fullScoreCard} />
                    )}
                </div>
            )}
            <div className="expand-icon-container" onClick={toggleExpand} title={expanded ? "Hide Full scorecard" : "See Full scorecard"}>
                <FontAwesomeIcon icon={expanded ? faCircleChevronUp : faCircleChevronDown} className="expand-icon" />
                <span className="expand-tooltip">{expanded ? "Hide Full Scorecard" : "See Full Scorecard"}</span>
            </div>
        </div>
    );
};

export default RecentMatchScoreCard;
