import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-sport',
  templateUrl: './sport.page.html',
  styleUrls: ['./sport.page.scss'],
})
export class SportPage implements OnInit, OnDestroy {

  public sport = {};

  constructor(
    public route: ActivatedRoute,
    public events: Events
  ) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.sport = params;
      }

      this.events.publish('share-sport', this.sport);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.events.publish('share-sport', false);
  }

}
