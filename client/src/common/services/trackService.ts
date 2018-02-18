import { HttpClient } from 'aurelia-fetch-client';
import { BASE_URL, SELECTION_TYPE } from '../utils/constants';

class TrackService {
  httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  getTopTracks = (trackType: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/top_tracks?type=${trackType}`)
      .then(response => response.json());
  };

  getTopTrendingTracks = () => {
    return this.httpClient.fetch(`${BASE_URL}/top_trending`).then(response => response.json());
  };

  getArtistTopTracks = (artistName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/artist_top?name=${artistName}&type=${SELECTION_TYPE.TRACKS}`)
      .then(response => response.json());
  };

  getTracksForTag = (tagName: string) => {
    return this.httpClient
      .fetch(`${BASE_URL}/popular_genre?type=${SELECTION_TYPE.TRACKS}&tag_name=${tagName}`)
      .then(response => response.json());
  };
}

export default TrackService;
