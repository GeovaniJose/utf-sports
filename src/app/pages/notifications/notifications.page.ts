import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';

import { FirebaseService } from './../../services/firebase.service';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  public sport;
  public notifications = [];
  public showLoading = true;

  constructor(
    public firebase: FirebaseService,
    public route: ActivatedRoute,
    public modal: ModalController,
    public alert: AlertController,
    public toast: ToastService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.sport = params;
      }

      this.chargeNotifications();
    });
  }

  ngOnInit() {
  }

  async chargeNotifications() {
    await this.firebase.db().collection('notifications')
      .where('sportId', '==', this.sport.id)
      .onSnapshot(results => {
        this.notifications = [];

        results.docs.forEach(doc => {
          this.notifications.push({
            id: doc.id,
            ...doc.data()
          });
        });

        this.showLoading = false;
      });
  }

}
