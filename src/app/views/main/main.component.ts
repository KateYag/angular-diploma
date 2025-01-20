import { Component, OnInit } from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../shared/services/article.service";
import {ArticleType} from "../../../types/article.type";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isModalOpen: boolean = false;
  isModalSendOpen: boolean = false;


  modalForm: FormGroup = this.fb.group({
    serviceName: ['', [ Validators.required]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
  });


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
  customOptionsReviews: OwlOptions = {
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
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: true
  }

  services = [
    {
      title: 'Создание сайтов',
      description: ' В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽',
      image: '/assets/images/services/service1.png'
    },
    {
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽',
      image: '/assets/images/services/service2.png'
    },
    {
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
      image: '/assets/images/services/service3.png'
    },
    {
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽',
      image: '/assets/images/services/service4.png'
    }
  ];



  reviews = [
    {
      name: 'Станислав',
      image: 'review4.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review5.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review6.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Антон',
      image: 'review1.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Карина',
      image: 'review2.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Антон',
      image: 'review3.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
  ]

  articles: ArticleType[] = [];

  constructor(private router: Router,
              private articleService: ArticleService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              ) {


  }

  ngOnInit(): void {
    this.articleService.getTopArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      });


    this.route.fragment.subscribe(fragment => {
      if (fragment) {

        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({behavior: 'smooth'});
          }
        }, 100);
      }
    });


  }

  openModal(service: any) {
    // this.formData.serviceName = service.title;
    // this.isModalOpen = true;
    console.log('Opening modal for service:', service);
    this.isModalOpen = true;
    this.modalForm.patchValue({ serviceName: service.title });
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  closeModalSend(): void {
    this.isModalSendOpen = false;
  }

  submitForm(): void {
    // this.http.post('order').subscribe({
    //   next: () => {
    //     this.isModalOpen = false;
    //     alert('Спасибо за заказ');
    //   },
    //   error: () => {
    //     alert('Произошла ошибка при отправке формы, попробуйте еще раз.');
    //   }
    // });

    this.closeModal();
  }
  handleSuccess() {
    this.closeModal();
  }

  send() {
    this.closeModal();
    this.isModalSendOpen = true;

  }





}
