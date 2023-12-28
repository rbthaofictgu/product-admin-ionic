import { Component, Input, OnInit, inject } from '@angular/core';
import { user } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() screen!: string;
  utilSvc = inject(UtilsService);
  user: user;
  isProcesed: boolean = false;
  subtitle!: string;
  subtitlelarge!: string;

  constructor() {
  }

  ngOnInit() {
    if (this.isProcesed === false) {
      this.user = JSON.parse(this.utilSvc.getFromLocalStorage('User'));
      console.log(this.user.name);
      if (this.user && this.user.name && this.user.name != '') {
        if (this.screen == 'auth') {
          this.subtitlelarge = `${this.user.name}`;
          this.subtitlelarge = this.subtitlelarge.toLocaleUpperCase();
          this.subtitle = `BIENVENIDO DE NUEVO: ${this.user.email}`;
          this.subtitle = this.subtitle.toLocaleUpperCase();
        } else {
          if (this.screen != 'sign-up') {
            this.subtitlelarge = `${this.user.name}`;
            this.subtitlelarge = this.subtitlelarge.toLocaleUpperCase();
            this.subtitle = `${this.user.email}`;
            this.subtitle = this.subtitle.toLocaleUpperCase();
          }
        }
      } else {
        this.subtitle = '';
        this.subtitlelarge = '';
      }
      this.isProcesed = true;
    }
  }
}
