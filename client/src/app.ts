import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';

// @ts-ignore
import * as UIkit from 'uikit';
// @ts-ignore
import * as Noty from 'noty';
import 'fontawesome';

import { CONTENT_TYPES, PLAYLIST_LOCAL_STORAGE } from './common/utils/constants';
import Store from './common/utils/store';
import { readFromLocalStorage } from './common/utils/utils';

import { IPlaylist, ISelectablePlaylist } from './common/interfaces/playlist-interface';
import { deployPlaylists } from './common/actions/playlist-actions';
import { ITrackBasic } from './common/interfaces/track-interface';

@inject(Store)
export class App {
  router: Router;

  sidebarRef: HTMLElement;
  playlistModal: HTMLElement;
  sidebarShowing: boolean = false;
  searchString: string = '';
  styleString: string = 'color: white';

  playlists: ISelectablePlaylist[] = [];
  selectedTrack: ITrackBasic = {
    artistName: '',
    trackName: '',
    image: '',
  };

  constructor(private store: Store) {
    this.store.dataStore.subscribe(this.handleStoreUpdate.bind(this));
  }

  handleStoreUpdate() {}

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.title = 'Fumen';
    config.map([
      {
        route: '',
        redirect: 'tracks',
      },
      {
        route: 'library',
        name: 'library',
        moduleId: './components/my-library/index',
        nav: true,
        title: 'My Library',
      },
      {
        route: 'playing',
        name: 'playing',
        moduleId: './components/now-playing/index',
        nav: true,
        title: 'Now Playing',
      },
      {
        route: 'tracks',
        name: 'tracks',
        moduleId: './components/tracks/index',
        nav: true,
        title: 'Tracks',
      },
      {
        route: 'albums',
        name: 'albums',
        moduleId: './components/albums/index',
        nav: true,
        title: 'Artists',
      },
      {
        route: 'artists',
        name: 'artists',
        moduleId: './components/artists/index',
        nav: true,
        title: 'Albums',
      },
      {
        route: 'genre',
        name: 'genre',
        moduleId: './components/genre/index',
        nav: true,
        title: 'Genre',
      },
    ]);
  }

  handleCheckboxSelect(index: number, state: boolean) {
    // TODO: Complete This
  }

  handleSaveData() {
    // TODO: Complete This
    UIkit.modal(this.playlistModal).hide();
  }

  attached() {
    this.initializeElements();
    this.readPlaylistsFromLocalStorage();
  }

  detached() {
    // @ts-ignore
    this.sidebarRef.$destroy();
  }

  closeSidebar() {
    this.sidebarShowing = false;
  }

  inputFocused() {
    this.styleString = 'color: #666';
  }

  inputBlurred() {
    this.styleString = 'color: white';
  }

  toggleSidebar() {
    if (this.sidebarShowing) {
      UIkit.offcanvas(this.sidebarRef).hide();
      this.sidebarShowing = false;
    } else {
      UIkit.offcanvas(this.sidebarRef).show();
      this.sidebarShowing = true;
    }
  }

  readPlaylistsFromLocalStorage() {
    let playlists: IPlaylist[] = JSON.parse(readFromLocalStorage(PLAYLIST_LOCAL_STORAGE));
    if (!playlists) playlists = [];
    this.store.dataStore.dispatch(deployPlaylists(playlists));
  }

  initializeElements() {
    UIkit.offcanvas(this.sidebarRef);
    UIkit.offcanvas(this.sidebarRef).hide();

    UIkit.util.on(this.sidebarRef, 'hidden', () => {
      this.closeSidebar();
    });

    UIkit.modal(this.playlistModal);
  }
}
