import { Injectable } from '@angular/core';
import { CanActivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot,
         UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

import { UsuarioService } from '../services/usuario.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoGuard implements CanActivate  {

  constructor(
    public usuario: UsuarioService,
    public navCtrl: NavController,
    public toast: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return new Observable<boolean>(observer => {
      this.usuario.getUserData().subscribe(async user => {
        if (user.isOnline) {
          if (user.tipo === 'player') {
            observer.next(true);
          } else {
            await this.toast.presentToast('Você não tem permissão para acessar este aplicativo!');
            this.usuario.logout();
            this.navCtrl.navigateRoot('login');
          }
        } else {
          this.navCtrl.navigateRoot('login');
        }
      });
    });
  }

}
