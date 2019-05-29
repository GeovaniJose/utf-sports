import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FirebaseService } from './../../services/firebase.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  public sport;
  public players = [];
  public showLoading = true;

  constructor(
    public firebase: FirebaseService,
    public route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.sport = params;
      }

      this.chargePlayers();
    });
  }

  ngOnInit() {
  }

  async chargePlayers() {
    await this.firebase.db().collection('sports')
      .doc(this.sport.id)
      .collection('players')
      .onSnapshot(results => {
        this.players = [];

        results.docs.forEach(doc => {
          this.players.push({ id: doc.id, ...doc.data() });
        });

        this.showLoading = false;
      });
  }

}
