// src/app/componentes/checkout/checkout.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CarritoService } from '../../servicio/carrito.service';
import { PedidoService, ResumenPedidoResponse } from '../../servicio/pedido.service';
import { PagoService, MetodoPago, TipoComprobante, ComprobanteResponse } from '../../servicio/pago.service';
import { AuthService } from '../../servicio/auth.service';
import { ItemCarritoCompleto } from '../../modelos/carrito-models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  
  // Pasos del checkout
  currentStep: number = 1;
  
  // Formularios
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;
  
  // Datos del pedido
  orderItems: ItemCarritoCompleto[] = [];
  shippingCost: number = 15.00;
  
  // Método de pago seleccionado
  selectedPaymentMethod: string = 'card';
  
  // Estado del proceso
  loading: boolean = false;
  error: string = '';
  
  // Datos del pedido creado
  pedidoCreado: ResumenPedidoResponse | null = null;
  comprobanteGenerado: ComprobanteResponse | null = null;
  
  // Para limpiar suscripciones
  private destroy$ = new Subject<void>();

  // Enums para el template
  MetodoPago = MetodoPago;
  TipoComprobante = TipoComprobante;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private pagoService: PagoService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      alert('Debes iniciar sesión para continuar con la compra');
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: '/checkout' } 
      });
      return;
    }

    this.initForms();
    this.loadOrderItems();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializar formularios
   */
  initForms() {
    // Formulario de envío
    this.shippingForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required]],
      postalCode: [''],
      notes: [''],
      documento: ['', [Validators.required, Validators.pattern(/^\d{8}$|^\d{11}$/)]],
      tipoComprobante: [TipoComprobante.BOLETA, [Validators.required]]
    });

    // Formulario de pago
    this.paymentForm = this.fb.group({
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(19)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  /**
   * Cargar items del carrito
   */
  loadOrderItems() {
    this.carritoService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.orderItems = items;
        
        if (items.length === 0) {
          alert('Tu carrito está vacío');
          this.router.navigate(['/cart']);
        }
      });
  }

  /**
   * Seleccionar método de pago
   */
  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    
    // Limpiar validaciones si no es tarjeta
    if (method !== 'card') {
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.clearValidators();
        this.paymentForm.get(key)?.updateValueAndValidity();
      });
    } else {
      this.initForms(); // Restaurar validaciones
    }
  }

  /**
   * Avanzar al siguiente paso
   */
  nextStep() {
    this.error = '';

    if (this.currentStep === 1) {
      // Validar formulario de envío
      if (this.shippingForm.invalid) {
        this.markFormGroupTouched(this.shippingForm);
        this.error = 'Por favor completa todos los campos requeridos';
        return;
      }
      this.currentStep = 2;
      window.scrollTo(0, 0);
    } 
    else if (this.currentStep === 2) {
      // Validar formulario de pago (si es tarjeta)
      if (this.selectedPaymentMethod === 'card' && this.paymentForm.invalid) {
        this.markFormGroupTouched(this.paymentForm);
        this.error = 'Por favor completa los datos de tu tarjeta';
        return;
      }
      
      // Procesar pedido y pago
      this.procesarPedidoYPago();
    }
  }

  /**
   * Volver al paso anterior
   */
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.error = '';
      window.scrollTo(0, 0);
    }
  }

  /**
   * Procesar pedido y pago
   */
  procesarPedidoYPago() {
    this.loading = true;
    this.error = '';

    const uuidCarrito = this.carritoService.obtenerUuidCarrito();
    
    if (!uuidCarrito) {
      this.error = 'No se encontró el carrito';
      this.loading = false;
      return;
    }

    // Paso 1: Crear pedido
    console.log('📦 Paso 1: Creando pedido...');
    
    this.pedidoService.crearPedido(uuidCarrito).subscribe({
      next: (pedido) => {
        console.log('✅ Pedido creado:', pedido);
        this.pedidoCreado = pedido;
        
        // Paso 2: Procesar pago
        this.procesarPago(pedido);
      },
      error: (error) => {
        console.error('❌ Error al crear pedido:', error);
        this.error = error.message || 'Error al crear el pedido';
        this.loading = false;
      }
    });
  }

  /**
   * Procesar pago
   */
  private procesarPago(pedido: ResumenPedidoResponse) {
    console.log('💳 Paso 2: Procesando pago...');

    const shippingData = this.shippingForm.value;
    
    // Determinar método de pago
    let metodoPago: MetodoPago;
    switch (this.selectedPaymentMethod) {
      case 'card':
        metodoPago = MetodoPago.TARJETA;
        break;
      case 'yape':
        metodoPago = MetodoPago.BILLETERA;
        break;
      case 'transfer':
        metodoPago = MetodoPago.TRANSFERENCIA;
        break;
      default:
        metodoPago = MetodoPago.TARJETA;
    }

    // Determinar tipo de comprobante
    const tipoComprobante: TipoComprobante = shippingData.tipoComprobante;

    // Preparar request de pago
    const pagoRequest = {
      uuidPedido: pedido.uuidPedido,
      monto: pedido.total,
      metodoPago: metodoPago,
      tipoComprobante: tipoComprobante,
      clienteDocumento: shippingData.documento,
      clienteNombre: `${shippingData.firstName} ${shippingData.lastName}`
    };

    this.pagoService.procesarPago(pagoRequest).subscribe({
      next: (comprobante) => {
        console.log('✅ Pago procesado:', comprobante);
        this.comprobanteGenerado = comprobante;
        
        // Verificar estado del pago
        if (comprobante.pago.estadoPago === 'Completado') {
          // Pago exitoso
          console.log('✅ Pago completado exitosamente');
          this.finalizarCompraExitosa();
        } else {
          // Pago fallido
          console.error('❌ Pago fallido');
          this.error = 'El pago no pudo ser procesado. Por favor intenta nuevamente con otro método de pago.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('❌ Error al procesar pago:', error);
        this.error = error.message || 'Error al procesar el pago';
        this.loading = false;
      }
    });
  }

  /**
   * Finalizar compra exitosa
   */
  private finalizarCompraExitosa() {
    // Vaciar carrito
    this.carritoService.vaciarCarrito().subscribe({
      next: () => {
        console.log('✅ Carrito vaciado');
      },
      error: (error) => {
        console.error('⚠️ Error al vaciar carrito:', error);
      }
    });

    // Avanzar a la pantalla de confirmación
    this.loading = false;
    this.currentStep = 3;
    window.scrollTo(0, 0);
  }

  /**
   * Obtener subtotal
   */
  getSubtotal(): number {
    return this.carritoService.obtenerSubtotal();
  }

  /**
   * Obtener total
   */
  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = subtotal >= 250 ? 0 : this.shippingCost;
    return subtotal + shipping;
  }

  /**
   * Obtener número de orden (del pedido creado)
   */
  getOrderNumber(): string {
    return this.pedidoCreado?.codigoPedido || 'N/A';
  }

  /**
   * Formatear número de tarjeta mientras se escribe
   */
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = this.pagoService.formatearNumeroTarjeta(value);
    this.paymentForm.patchValue({ cardNumber: formattedValue }, { emitEvent: false });
  }

  /**
   * Formatear fecha de vencimiento mientras se escribe
   */
  formatExpiryDate(event: any) {
    let value = event.target.value;
    let formattedValue = this.pagoService.formatearFechaVencimiento(value);
    this.paymentForm.patchValue({ expiryDate: formattedValue }, { emitEvent: false });
  }

  /**
   * Marcar todos los campos del formulario como touched
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Cambiar tipo de comprobante
   */
  onTipoComprobanteChange(event: any) {
    const tipoComprobante = event.target.value;
    const documentoControl = this.shippingForm.get('documento');

    if (tipoComprobante === TipoComprobante.FACTURA) {
      // Si es factura, el documento debe ser RUC (11 dígitos)
      documentoControl?.setValidators([Validators.required, Validators.pattern(/^\d{11}$/)]);
    } else {
      // Si es boleta, el documento debe ser DNI (8 dígitos)
      documentoControl?.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
    }

    documentoControl?.updateValueAndValidity();
  }
}
