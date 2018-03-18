import { inject } from 'aurelia-framework';
import { Router, RouteConfig } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

// @ts-ignore
import * as UIkit from 'uikit';

import ArtistService from '../../common/services/artistService';
import {
  IArtistData,
  ISimilarArtist,
  ISimilarArtistsRawData,
  IArtistInfoRawData,
} from '../../common/interfaces/artist-interface';

interface IParams {
  name: string;
}

@inject(ArtistService, Router, EventAggregator)
export class ArtistDetail {
  artistInfoGrid: HTMLElement;
  artistName: string = '';

  artistInfoLoading: boolean = false;
  artistInfo: IArtistData = null;

  similarArtistsLoading: boolean = false;
  similarArtists: ISimilarArtist[] = [];

  constructor(
    private artistService: ArtistService,
    private router: Router,
    private ea: EventAggregator
  ) {}

  fetchArtistInfo() {
    this.artistInfoLoading = true;

    this.artistService
      .getArtistInfo(this.artistName)
      .then((data: IArtistInfoRawData) => {
        if (data.success) {
          this.artistInfo = data['artist_data'];
        }

        this.artistInfoLoading = false;
      })
      .catch(error => {
        this.artistInfoLoading = false;
        this.publishNotification(
          'error',
          'Yikes! We were unable to load the data. Could you try again',
          error
        );
      });
  }

  fetchSimilarArtists() {
    this.similarArtistsLoading = true;

    this.artistService
      .getSimilarArtists(this.artistName)
      .then((data: ISimilarArtistsRawData) => {
        if (data.success) {
          this.similarArtists = data['similar_artists'];
        }

        this.similarArtistsLoading = false;
      })
      .catch(error => {
        this.similarArtistsLoading = false;
        this.publishNotification(
          'error',
          'Yikes! We were unable to load the data. Could you try again',
          error
        );
      });
  }

  activate(params: IParams, routeConfig: RouteConfig) {
    routeConfig.navModel.setTitle(params.name);
    this.artistName = params.name;

    if (this.artistName) {
      this.fetchArtistInfo();
      this.fetchSimilarArtists();
    }
  }

  attached() {
    this.initializeElements();
  }

  detached() {}

  publishNotification(eventType: string, message: string, error: object) {
    this.ea.publish('notification', {
      type: eventType,
      message,
      data: error,
    });
  }

  initializeElements() {
    UIkit.grid(this.artistInfoGrid);
  }
}