import React, { useState } from 'react';
import { MatchScoreCardProps, TeamScoreDetail, InningsScores, InningsData, VenueInfo } from "../types/MatchTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCircleChevronDown, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import '../css/MatchScoreCard.css';
import FullScoreCard from './FullScoreCard';
import { fetchMatchScoreCard } from '../api/apiClient';

interface LiveMatchScoreCardProps extends MatchScoreCardProps {
    lastRefreshTime: string | null;
    showSpinner: boolean;
    matchId: number;
}

const LiveMatchScoreCard: React.FC<LiveMatchScoreCardProps> = ({
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
                                                                   lastRefreshTime,
                                                                   showSpinner,
                                                                   matchId,
                                                               }) => {
    const [expanded, setExpanded] = useState(false);
    const [fullScoreCard, setFullScoreCard] = useState<InningsData[]>([]);
    const [loading, setLoading] = useState(false);

    const renderScore = (score: TeamScoreDetail | undefined, inningsNumber: number) => {
        return score ? <strong>{`Inngs ${inningsNumber}: ${score.runs}/${score.wickets} (${score.overs} Ov)`}</strong> : null;
    };

    const renderInningsScores = (inningsScores: InningsScores | undefined) => {
        if (!inningsScores) return null;

        return Object.entries(inningsScores).map(([key, value], index) => {
            const inningsNumber = key === 'inngs1' ? 1 : 2;
            return value ? (
                <div key={index} className="team-score">
                    {renderScore(value, inningsNumber)}
                </div>
            ) : null;
        });
    };

    const renderMatchStartTime = (startDate: string) => {
        const date = new Date(Number(startDate));
        return `${date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })} at ${date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}`;
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
            {matchStatus.toLowerCase() === "in progress" && showSpinner && (
                <div className="spinner-container">
                    <FontAwesomeIcon icon={faSpinner} spin />
                </div>
            )}
            <div className={`match-status ${matchStatus.toLowerCase() === "in progress" ? "in-progress" : matchStatus.toLowerCase()}`}>{matchStatus}</div>
            <div className="match-detail">{seriesName}</div>
            <div className="match-type">{matchFormat}</div>
            <div className="match-venue">{venue.ground}, {venue.city}</div>
            <div className="match-start-time">{renderMatchStartTime(startDate)}</div>
            <div className="team-info">
                <div className="team">
                    <div className="team-name">{team1}</div>
                    {renderInningsScores(team1Score)}
                </div>
                <div className="team">
                    <div className="team-name">{team2}</div>
                    {renderInningsScores(team2Score)}
                </div>
            </div>
            <div className="match-result">{matchResult}</div>
            {lastRefreshTime && <div className="last-refresh-time">Last refreshed score: {lastRefreshTime}</div>}
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
            <div className="expand-icon-container" onClick={toggleExpand} title={expanded ? "Hide Full Scorecard" : "See Full Scorecard"}>
                <FontAwesomeIcon icon={expanded ? faCircleChevronUp : faCircleChevronDown} className="expand-icon" />
                <span className="expand-tooltip">{expanded ? "Hide Full Scorecard" : "See Full Scorecard"}</span>
            </div>
        </div>
    );
};

export default LiveMatchScoreCard;
