import { createStore, combineReducers, Store, Reducer } from 'redux';

import { nowPlayingReducer, INowPlayingReducer } from '../reducers/now-playing-reducer';
import { playerReducer, IPlayerReducer } from '../reducers/player-reducer';
import { playlistReducer, IPlaylistReducer } from '../reducers/playlist-reducer';
import { trackPlaylistReducer, ITrackPlaylistReducer } from '../reducers/track-playlist-reducer';

interface IStore {
  playlist: IPlaylistReducer;
  player: IPlayerReducer;
  nowPlaying: INowPlayingReducer;
  trackPlaylist: ITrackPlaylistReducer;
}

class StoreClass {
  private combinedReducers: Reducer<IStore>;
  public dataStore: Store<IStore>;

  constructor() {
    this.combinedReducers = combineReducers({
      playlist: playlistReducer,
      player: playerReducer,
      nowPlaying: nowPlayingReducer,
      trackPlaylist: trackPlaylistReducer,
    });

    this.dataStore = createStore(
      this.combinedReducers,
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
  }
}

export default StoreClass;
