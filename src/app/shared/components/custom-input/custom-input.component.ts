import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  @Input() labelPlacement!: string;

  isPassword!: boolean;
  hidepasswordeye: boolean = true;

  constructor() { }

  ngOnInit() {
    if (this.type == 'password') this.isPassword = true
  }

  ShowOrHidePassword() {

    this.hidepasswordeye = !this.hidepasswordeye;

    if (this.hidepasswordeye) this.type = "password";
    else this.type="text";

  }

}
