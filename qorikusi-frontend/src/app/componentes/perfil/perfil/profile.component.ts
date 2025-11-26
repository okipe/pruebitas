import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClienteService } from '../../../servicio/cliente.service';
import { DireccionService } from '../../../servicio/direccion.service';
import { RetrieveClientDataResponse, UpdateClientDataRequest } from '../../../modelos/Cliente.model';
import { DireccionResponse } from '../../../modelos/Direccion.model';
import { SpanishValidators } from '../../../validators/spanish.validators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  emailForm!: FormGroup;
  
  clienteData: RetrieveClientDataResponse | null = null;
  direcciones: DireccionResponse[] = [];
  
  loading = false;
  editMode = false;
  showPasswordModal = false;
  showEmailModal = false;
  
  successMessage = '';
  errorMessage = '';
  
  // Opciones de signos zodiacales
  signosZodiacales = [
    'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
  ];
  
  // Opciones de fases lunares
  fasesLunares = [
    'Luna Nueva', 'Luna Creciente', 'Luna Llena', 'Luna Menguante'
  ];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private direccionService: DireccionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForms();
    this.cargarDatosCliente();
    this.cargarDirecciones();
  }

  initForms() {
    // Formulario de perfil
    this.profileForm = this.fb.group({
      nombres: ['', [
        Validators.required, 
        Validators.maxLength(100),
        SpanishValidators.fullName()
      ]],
      apellidos: ['', [
        Validators.required, 
        Validators.maxLength(100),
        SpanishValidators.fullName()
      ]],
      telefono: ['', [
        Validators.required, 
        Validators.maxLength(20),
        SpanishValidators.numbersOnly()
      ]],
      signoZodiacal: [''],
      faseLunarPreferida: ['']
    });

    // Formulario de cambio de contraseña
    this.passwordForm = this.fb.group({
      actualContrasenia: ['', [Validators.required]],
      nuevaContrasenia: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasenia: ['', [Validators.required]]
    });

    // Formulario de cambio de email
    this.emailForm = this.fb.group({
      actualCorreo: ['', [Validators.required, Validators.email]],
      nuevoCorreo: ['', [Validators.required, Validators.email]],
      confirmarCorreo: ['', [Validators.required, Validators.email]]
    });

    // Deshabilitar formulario inicialmente
    this.profileForm.disable();
  }

  cargarDatosCliente() {
    this.loading = true;
    this.clienteService.obtenerDatosCliente().subscribe({
      next: (data) => {
        this.clienteData = data;
        this.profileForm.patchValue({
          nombres: data.nombres,
          apellidos: data.apellidos,
          telefono: data.telefono,
          signoZodiacal: data.signoZodiacal || '',
          faseLunarPreferida: data.faseLunarPreferida || ''
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  cargarDirecciones() {
    this.direccionService.listarDirecciones().subscribe({
      next: (direcciones) => {
        this.direcciones = direcciones;
      },
      error: (error) => {
        console.error('Error al cargar direcciones:', error);
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    
    if (this.editMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      // Restaurar valores originales
      if (this.clienteData) {
        this.profileForm.patchValue({
          nombres: this.clienteData.nombres,
          apellidos: this.clienteData.apellidos,
          telefono: this.clienteData.telefono,
          signoZodiacal: this.clienteData.signoZodiacal || '',
          faseLunarPreferida: this.clienteData.faseLunarPreferida || ''
        });
      }
    }
    
    // Limpiar mensajes
    this.successMessage = '';
    this.errorMessage = '';
  }

  guardarCambios() {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: UpdateClientDataRequest = {
      nombres: this.profileForm.value.nombres,
      apellidos: this.profileForm.value.apellidos,
      telefono: this.profileForm.value.telefono,
      signoZodiacal: this.profileForm.value.signoZodiacal || undefined,
      faseLunarPreferida: this.profileForm.value.faseLunarPreferida || undefined
    };

    this.clienteService.actualizarDatosCliente(updateData).subscribe({
      next: (response) => {
        this.clienteData = response;
        this.successMessage = '¡Tus datos han sido actualizados correctamente!';
        this.editMode = false;
        this.profileForm.disable();
        this.loading = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  openPasswordModal() {
    this.showPasswordModal = true;
    this.passwordForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.passwordForm.reset();
  }

  cambiarContrasenia() {
    if (this.passwordForm.invalid) {
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
      return;
    }

    const { actualContrasenia, nuevaContrasenia, confirmarContrasenia } = this.passwordForm.value;

    if (nuevaContrasenia !== confirmarContrasenia) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.clienteService.cambiarContrasenia(actualContrasenia, nuevaContrasenia).subscribe({
      next: () => {
        this.successMessage = '¡Tu contraseña ha sido cambiada correctamente!';
        this.loading = false;
        setTimeout(() => {
          this.closePasswordModal();
          this.successMessage = '';
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  openEmailModal() {
    this.showEmailModal = true;
    this.emailForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeEmailModal() {
    this.showEmailModal = false;
    this.emailForm.reset();
  }

  cambiarCorreo() {
    if (this.emailForm.invalid) {
      Object.keys(this.emailForm.controls).forEach(key => {
        this.emailForm.get(key)?.markAsTouched();
      });
      return;
    }

    const { actualCorreo, nuevoCorreo, confirmarCorreo } = this.emailForm.value;

    if (nuevoCorreo !== confirmarCorreo) {
      this.errorMessage = 'Los correos no coinciden';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.clienteService.cambiarCorreo(actualCorreo, nuevoCorreo).subscribe({
      next: () => {
        this.successMessage = '¡Tu correo ha sido cambiado correctamente!';
        this.loading = false;
        setTimeout(() => {
          this.closeEmailModal();
          this.successMessage = '';
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  irADirecciones() {
    this.router.navigate(['/profile/addresses']);
  }

  // Getters para facilitar acceso a controles del formulario
  get nombres() {
    return this.profileForm.get('nombres');
  }

  get apellidos() {
    return this.profileForm.get('apellidos');
  }

  get telefono() {
    return this.profileForm.get('telefono');
  }

  get signoZodiacal() {
    return this.profileForm.get('signoZodiacal');
  }

  get faseLunarPreferida() {
    return this.profileForm.get('faseLunarPreferida');
  }
}