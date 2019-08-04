import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-buttons',
  templateUrl: './header-buttons.component.html',
  styleUrls: ['./header-buttons.component.css']
})
export class HeaderButtonsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openPage(page: string){
    switch(page){
      case 'g': window.open('https://github.com/dhanush1993', "_blank");break;
      case 'f': window.open('https://www.facebook.com/dhanush.vicky.161', "_blank");break;
      case 'i': window.open('https://linkedin.com/in/dhanush-srinivasa', "_blank");break;
    }
  }

}
