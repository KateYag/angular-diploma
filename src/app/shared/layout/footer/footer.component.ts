import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isModalOpen = false;
  isModalSendOpen = false;
  modalForm!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.modalForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]]
    });
  }

  ngOnInit(): void {
  }
  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  send() {
    if (this.modalForm.valid) {
      this.isModalOpen = false;
      this.isModalSendOpen = true;
      this.modalForm.reset();
    }
  }
  closeModalSend() {
    this.isModalSendOpen = false;
  }
}
