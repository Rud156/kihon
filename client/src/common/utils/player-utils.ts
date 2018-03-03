import * as _ from 'lodash';

import { ITrack, ITrackBasic } from '../interfaces/track-interface';
import { IReturn } from '../interfaces/player-util-interface';
import { IPlaylistDictionary, IPlaylist } from '../interfaces/playlist-interface';

export const getNextTrack = (trackArray: ITrack[], track: ITrackBasic): IReturn => {
  if (trackArray.length <= 1)
    return {
      success: false,
      track: null,
    };

  const currentTrackIndex = _.findIndex(
    trackArray,
    x => x.trackName === track.trackName && x.artistName === track.artistName
  );
  if (currentTrackIndex === -1)
    return {
      success: false,
      track: null,
    };
  else if (currentTrackIndex === trackArray.length - 1)
    return {
      success: true,
      track: trackArray[0],
    };
  else
    return {
      success: true,
      track: trackArray[currentTrackIndex + 1],
    };
};

export const getPrevTrack = (trackArray: ITrack[], track: ITrackBasic): IReturn => {
  if (trackArray.length <= 1)
    return {
      success: false,
      track: null,
    };

  const currentTrackIndex = _.findIndex(
    trackArray,
    x => x.trackName === track.trackName && x.artistName === track.artistName
  );
  if (currentTrackIndex === -1)
    return {
      success: false,
      track: null,
    };
  else if (currentTrackIndex === 0)
    return {
      success: true,
      track: trackArray[trackArray.length - 1],
    };
  else
    return {
      success: true,
      track: trackArray[currentTrackIndex - 1],
    };
};

export const convertDictToList = (playlist: IPlaylistDictionary): IPlaylist[] => {
  const keys = Object.keys(playlist);
  const playlistList: IPlaylist[] = [];

  keys.forEach(element => {
    const tempObject: IPlaylist = {
      name: element,
      tracks: playlist[element],
    };
    playlistList.push(tempObject);
  });

  return playlistList;
};

export const convertListToDict = (playlist: IPlaylist[]): IPlaylistDictionary => {
  const playlistDict: IPlaylistDictionary = {};

  playlist.forEach(element => {
    playlistDict[element.name] = element.tracks;
  });

  return playlistDict;
};
