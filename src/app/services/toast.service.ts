import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastCtrl: ToastController) { }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      animated: true
    });
    toast.present();
  }
}
