import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';

import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-sport',
  templateUrl: './sport.page.html',
  styleUrls: ['./sport.page.scss'],
})
export class SportPage implements OnInit, OnDestroy {

  public sportId = '';
  public sport = {};

  constructor(
    public firebase: FirebaseService,
    public route: ActivatedRoute,
    public events: Events
  ) {
    this.route.queryParams.subscribe(params => {
      if (params.resource) {
        this.sportId = params.resource;
      }

      this.loadSport();
    });
  }

  ngOnInit() {
  }

  async loadSport() {
    await this.firebase.db().collection('sports').doc(this.sportId)
      .onSnapshot(result => {
        this.sport = {
          ...result.data()
        };

        this.events.publish('share-sport', this.sport);
      });
  }

  ngOnDestroy() {
    this.events.publish('share-sport', false);
  }

}
