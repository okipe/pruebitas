import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemCarrito } from '../../modelos/ItemCarrito';
import { CarritoService } from '../../servicio/carrito.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  
  currentStep: number = 1;
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;
  selectedPaymentMethod: string = 'card';
  orderNumber: string = '';
  shippingCost: number = 15.00;
  orderItems: ItemCarrito[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.initForms();
    this.generateOrderNumber();
    this.loadOrderItems();
  }

  loadOrderItems() {
    this.orderItems = this.carritoService.obtenerItems();
  }

  initForms() {
    this.shippingForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: [''],
      notes: ['']
    });

    this.paymentForm = this.fb.group({
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      expiryDate: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  generateOrderNumber() {
    this.orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    
    if (method !== 'card') {
      this.paymentForm.clearValidators();
      this.paymentForm.updateValueAndValidity();
    }
  }

  getSubtotal(): number {
    return this.orderItems.reduce((total, item) => 
      total + (item.producto.precio * item.cantidad), 0
    );
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = subtotal >= 250 ? 0 : this.shippingCost;
    return subtotal + shipping;
  }

  nextStep() {
    if (this.currentStep === 1 && this.shippingForm.valid) {
      this.currentStep = 2;
      window.scrollTo(0, 0);
    } else if (this.currentStep === 2) {
      if (this.selectedPaymentMethod === 'card' && this.paymentForm.invalid) {
        Object.keys(this.paymentForm.controls).forEach(key => {
          this.paymentForm.get(key)?.markAsTouched();
        });
        return;
      }
      
      this.processPayment();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  processPayment() {
    console.log('Procesando pago...');
    
    setTimeout(() => {
      this.currentStep = 3;
      window.scrollTo(0, 0);
    }, 1000);
  }
}
