import Match from './IMatch';

export default interface MatchResponse {
  status: number;
  message?: string;
  result?: Match;
}
