import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { FirebaseService } from './firebase.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario = {};

  constructor(
    public firebase: FirebaseService,
    public router: Router,
    public toast: ToastService
  ) {
    this.getUser().subscribe();
  }

  getUser(): Observable<any> {
    return Observable.create(observer => {
      this.firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.usuario = {
            id: user.uid,
            email: user.email,
            isOnline: true };
        } else {
          this.usuario = {
            id: null,
            email: null,
            isOnline: false };
        }

        observer.next(this.usuario);
      });
    });
  }

  getUserData(): Observable<any> {
    return Observable.create(observer => {
      this.firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          await this.firebase.db().collection('users').doc(user.uid)
            .onSnapshot(result => {
              this.usuario = {
                id: user.uid,
                email: user.email,
                nome: result.data().nome,
                telefone: result.data().telefone,
                atletica: result.data().atletica,
                isOnline: true
              };

              observer.next(this.usuario);
            });
        } else {
          this.usuario = {
            id: null,
            email: null,
            isOnline: false };

          observer.next(this.usuario);
        }
      });
    });
  }

  async login(email, senha) {
    try {
      await this.firebase.auth().signInWithEmailAndPassword(email, senha);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        await this.toast.presentToast('Email incorreto!');
      } else if (error.code === 'auth/wrong-password') {
        await this.toast.presentToast('Senha incorreta!');
      } else if (error.code === 'auth/user-not-found') {
        await this.toast.presentToast('O email digitado não está cadastrado!');
      }
      throw new Error(error.message);
    }
  }

  async registrar(email, senha) {
    try {
      await this.firebase.auth().createUserWithEmailAndPassword(email, senha);
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        await this.toast.presentToast('Por favor, digite um email válido!');
      } else if (error.code === 'auth/weak-password') {
        await this.toast.presentToast('Por favor, digite uma senha com pelo menos 6 caracteres!');
      } else if (error.code === 'auth/email-already-in-use') {
        await this.toast.presentToast('O email digitado já está em uso!');
      }
      throw new Error(error.message);
    }
  }

  logout() {
    this.firebase.auth().signOut();
    this.router.navigateByUrl('login');
  }

}
