import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from './../../services/usuario.service';
import { FirebaseService } from './../../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public nome = '';
  public email = '';
  public telefone = '';
  public atletica = '';
  public senha = '';
  public userId = '';
  public showLoading = false;

  constructor(public usuario: UsuarioService, public firebase: FirebaseService, public router: Router) {
    this.usuario.getUser().subscribe(user => {
      if (user.isOnline) {
        this.userId = user.id;
      }
    });
  }

  ngOnInit() {
  }

  async registrar() {
    try {
      this.showLoading = true;
      await this.usuario.registrar(this.email, this.senha);
      this.gravarUsuario();
      this.showLoading = false;
    } catch (erro) {
      this.showLoading = false;
    }
  }

  async gravarUsuario() {
    try {
      await this.firebase.db().collection('users').doc(this.userId).set({
        nome: this.nome,
        telefone: this.telefone,
        atletica: this.atletica,
        esportes: '',
        tipo: 'player'
      });
    } catch (erro) {
      console.log(erro);
    }
  }

}
