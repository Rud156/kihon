import { inject } from 'aurelia-framework';
import * as _ from 'lodash';

// @ts-ignore
import * as UIkit from 'uikit';

import { ITrackInterface } from '../../common/reducers/player-reducer';
import Store from '../../common/utils/store';
import AudioService from '../../common/services/audioService';

interface IPlayerTrackInterface extends ITrackInterface {
  currentTime: number;
  maxTime: number;
  audioURL: string;
  volume: number;
}

@inject(Store, AudioService)
export class MusicPlayer {
  playerGrid: HTMLElement;

  audioElement: HTMLAudioElement;
  audioIsPlaying: boolean;

  randomButton: HTMLElement;
  prevTrackButton: HTMLElement;
  playButton: HTMLElement;
  pauseButton: HTMLElement;
  nextTrackButton: HTMLElement;
  replayButton: HTMLElement;
  favouriteButton: HTMLElement;
  seekSlider: HTMLInputElement;
  volumeSlider: HTMLInputElement;

  currentTrack: ITrackInterface;
  playingTrack: IPlayerTrackInterface;

  constructor(private store: Store, private audioService: AudioService) {
    this.store.dataStore.subscribe(this.handleStoreStateUpdate.bind(this));
  }

  handleStoreStateUpdate() {
    const currentTrack = this.store.dataStore.getState().player.currentTrack;
    if (currentTrack.trackName != this.playingTrack.trackName) {
      this.getSongData(currentTrack);
    }
  }

  getSongData(currentTrack: ITrackInterface) {
    if (this.audioIsPlaying) {
      this.audioElement.pause();
      this.audioIsPlaying = false;
    }

    this.audioService
      .getAudioURL(currentTrack.trackName, currentTrack.artistName)
      .then(data => {
        if (data.success) {
          const trackData = {
            trackName: data.track_name,
            artistName: data.artist_name,
            image: data.image,
            currentTime: 0,
            audioURL: data.url,
            maxTime: 0,
            volume: 1,
          };
          this.playingTrack = trackData;
          this.audioElement.src = this.playingTrack.audioURL;
          this.audioElement.volume = 1;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  playAudio() {
    if (!this.audioIsPlaying) {
      this.audioElement.play();
      this.audioIsPlaying = true;
    }
  }

  pauseAudio() {
    if (this.audioIsPlaying) {
      this.audioElement.pause();
      this.audioIsPlaying = false;
    }
  }

  handlePlayButtonClick(event: MouseEvent) {
    this.playAudio();
  }

  handlePauseButtonClick(event: MouseEvent) {
    this.pauseAudio();
  }

  handleRandomButtonClick(event: MouseEvent) {}

  handlePrevTrackButtonClick(event: MouseEvent) {}

  handleNextButtonClick(event: MouseEvent) {}

  handleReplayButtonClick(event: MouseEvent) {}

  handleFavouriteButtonClick(event: MouseEvent) {}

  handleSeekSliderChange(event: Event) {
    const currentTime = parseInt(this.seekSlider.value);
    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      currentTime,
    };

    this.audioElement.currentTime = currentTime;
    this.playingTrack = modifiedTrackData;
  }

  handleVolumeSliderChange(event: Event) {
    const volume = parseFloat(this.volumeSlider.value);
    this.audioElement.volume = volume;
    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      volume,
    };
    this.playingTrack = modifiedTrackData;
  }

  handleTimeUpdate(event: Event) {
    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      currentTime: this.audioElement.currentTime,
    };
    this.playingTrack = modifiedTrackData;
  }

  handleCanPlay(event: Event) {
    const { playingTrack } = this;
    const modifiedTrackData = {
      ...playingTrack,
      maxTime: this.audioElement.duration,
      currentTime: 0,
      volume: 1,
    };
    this.playingTrack = modifiedTrackData;
  }

  attached() {
    this.initializeElements();
    this.addAllEventListeners();
  }

  detached() {
    this.removeAllEventListeners();
  }

  addAllEventListeners() {
    this.audioElement.addEventListener('canplay', this.handleCanPlay.bind(this));
    this.audioElement.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
    this.playButton.addEventListener('click', this.handlePlayButtonClick.bind(this));
    this.pauseButton.addEventListener('click', this.handlePauseButtonClick.bind(this));
    this.nextTrackButton.addEventListener('click', this.handleNextButtonClick.bind(this));
    this.prevTrackButton.addEventListener('click', this.handlePrevTrackButtonClick.bind(this));
    this.favouriteButton.addEventListener('click', this.handleFavouriteButtonClick.bind(this));
    this.replayButton.addEventListener('click', this.handleReplayButtonClick.bind(this));
    this.randomButton.addEventListener('click', this.handleRandomButtonClick.bind(this));
    this.volumeSlider.addEventListener('input', this.handleVolumeSliderChange.bind(this));

    this.seekSlider.addEventListener('change', this.handleSeekSliderChange.bind(this));
    this.seekSlider.addEventListener('mousedown', this.pauseAudio.bind(this));
    this.seekSlider.addEventListener('mouseup', this.playAudio.bind(this));
  }

  removeAllEventListeners() {
    this.audioElement.removeEventListener('canplay', this.handleCanPlay);
    this.audioElement.removeEventListener('timeupdate', this.handleTimeUpdate);
    this.playButton.removeEventListener('click', this.handlePlayButtonClick);
    this.pauseButton.removeEventListener('click', this.handlePauseButtonClick);
    this.nextTrackButton.removeEventListener('click', this.handleNextButtonClick);
    this.prevTrackButton.removeEventListener('click', this.handlePrevTrackButtonClick);
    this.favouriteButton.removeEventListener('click', this.handleFavouriteButtonClick);
    this.replayButton.removeEventListener('click', this.handleReplayButtonClick);
    this.randomButton.removeEventListener('click', this.handleRandomButtonClick);
    this.volumeSlider.removeEventListener('input', this.handleVolumeSliderChange);

    this.seekSlider.removeEventListener('change', this.handleSeekSliderChange);
    this.seekSlider.removeEventListener('mousedown', this.pauseAudio.bind(this));
    this.seekSlider.removeEventListener('mouseup', this.playAudio.bind(this));
  }

  initializeElements() {
    UIkit.grid(this.playerGrid);
  }
}
