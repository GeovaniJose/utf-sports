import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';

import { FirebaseService } from './../../services/firebase.service';

@Component({
  selector: 'app-sport',
  templateUrl: './sport.page.html',
  styleUrls: ['./sport.page.scss'],
})
export class SportPage implements OnInit, OnDestroy {

  public sport;
  public treinos = [];
  public showLoading = true;

  constructor(
    public firebase: FirebaseService,
    public route: ActivatedRoute,
    public events: Events
  ) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.sport = params;
      }

      this.events.publish('share-sport', this.sport);

      this.chargeTrainings();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.events.publish('share-sport', false);
  }

  async chargeTrainings() {
    await this.firebase.db().collection('sports')
      .doc(this.sport.id)
      .collection('trainings')
      .where('check', '==', false)
      .onSnapshot(results => {
        this.treinos = [];

        results.docs.forEach(doc => {
          const options = { weekday: 'long', day: 'numeric', month: 'short' };

          let formatada = new Intl.DateTimeFormat('default', options).format(new Date(doc.data().data)).toString();

          const formataDia = formatada.substr(0, 1).toUpperCase() + formatada.substr(1);

          let formataMes = formatada.substr(-3);
          formataMes = formataMes.substr(0, 1).toUpperCase() + formataMes.substr(1);

          formatada = formataDia.substr(0, (formataDia.length - 3)) + formataMes;

          this.treinos.push({
            id: doc.id,
            ...doc.data(),
            data: formatada,
            horaIni: doc.data().horaIni.substr(11, 5),
            horaFim: doc.data().horaFim.substr(11, 5),
          });
        });

        this.showLoading = false;
      });
  }

}
