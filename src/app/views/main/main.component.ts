import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isModalOpen: boolean = false;
  formData = {
    serviceName: '',
    name: '',
    phone: ''
  };

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToDetails(slideId: string): void {
    switch (slideId) {
      case 'carousel1':
        this.formData.serviceName = 'Продвижение';
        break;
      case 'carousel2':
        this.formData.serviceName = 'Копирайтинг';
        break;
      case 'carousel3':
        this.formData.serviceName = 'Реклама';
        break;
      default:
        this.formData.serviceName = '';
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitForm(): void {
    console.log('Данные формы:', this.formData);

    this.closeModal();
  }

}
