export interface TeamScoreDetail {
    inningsId: number;
    runs: number;
    wickets: number;
    overs: number;
}

export interface InningsScores {
    inngs1?: TeamScoreDetail;
    inngs2?: TeamScoreDetail;
    [key: string]: TeamScoreDetail | undefined;
}

export interface MatchScore {
    team1Score: InningsScores;
    team2Score: InningsScores;
}

export interface Team {
    teamId: number;
    teamName: string;
    teamSName: string;
    imageId: number;
}

export interface VenueInfo {
    id: number;
    ground: string;
    city: string;
    timezone: string;
    latitude?: string;
    longitude?: string;
}

export interface MatchInfo {
    matchId: number;
    seriesId: number;
    seriesName: string;
    matchDesc: string;
    matchFormat: string;
    startDate: string;
    endDate: string;
    state: string;
    status: string;
    team1: Team;
    team2: Team;
    venueInfo: VenueInfo;
    currBatTeamId: number;
    seriesStartDt: string;
    seriesEndDt: string;
    isTimeAnnounced: boolean;
    stateTitle: string;
    result?: string;
}

export interface Match {
    matchInfo: MatchInfo;
    matchScore?: MatchScore;
}

export interface SeriesMatches {
    seriesAdWrapper?: {
        seriesId?: number; // Allow seriesId to be undefined
        seriesName?: string;
        matches: Match[];
    };
    adDetail?: any;
}

export interface TypeMatches {
    matchType: string;
    seriesMatches: SeriesMatches[];
}

export interface ApiResponse {
    typeMatches: {
        matchType: string;
        seriesMatches: SeriesMatches[];
    }[];
    filters: {
        matchType: string[];
        matchFormat: string[];
    };
}

export interface MatchScoreCardProps {
    seriesName: string;
    matchStatus: string;
    team1: string;
    team2: string;
    team1Score: InningsScores;
    team2Score: InningsScores;
    matchResult: string;
    matchFormat: string;
    startDate: string;
    venue: VenueInfo;
}

export interface UpcomingMatchScoreCardProps {
    seriesName: string;
    matchStatus: string;
    team1: string;
    team2: string;
    matchResult: string;
    matchFormat: string;
    startDate: string;
    venue: {
        ground: string;
        city: string;
    };
}

export interface BatsmanData {
    batId: number;
    batName: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    outDesc: string;
}

export interface BowlerData {
    bowlerId: number;
    bowlName: string;
    overs: number;
    runs: number;
    wickets: number;
}

export interface TeamDetails {
    batTeamName: string;
    batsmenData: Record<string, BatsmanData>;
    bowlersData: Record<string, BowlerData>;
}

export interface InningsData {
    inningsId: string;
    batTeamDetails: TeamDetails;
    bowlTeamDetails: TeamDetails;
}

export interface FullScoreCardProps {
    scoreCard: InningsData[];
}

interface LiveMatchScoreCardProps extends MatchScoreCardProps {
    lastRefreshTime: string | null;
    showSpinner: boolean;
    fullScoreCard: InningsData[];
}
