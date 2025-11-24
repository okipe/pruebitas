import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../servicio/auth.service';

// ========================================
// VALIDADOR PERSONALIZADO DE CONTRASEÑA
// ========================================

/**
 * Validador que verifica que la contraseña cumpla con todos los requisitos:
 * - Al menos 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Si está vacío, el Validators.required se encargará
    }

    // Objeto para almacenar los errores
    const errors: ValidationErrors = {};

    // Validar longitud mínima (8 caracteres)
    if (value.length < 8) {
      errors['minLength'] = true;
    }

    // Validar que tenga al menos una mayúscula
    if (!/[A-Z]/.test(value)) {
      errors['noUpperCase'] = true;
    }

    // Validar que tenga al menos una minúscula
    if (!/[a-z]/.test(value)) {
      errors['noLowerCase'] = true;
    }

    // Validar que tenga al menos un número
    if (!/\d/.test(value)) {
      errors['noNumber'] = true;
    }

    // Validar que tenga al menos un carácter especial
    if (!/[^A-Za-z0-9]/.test(value)) {
      errors['noSpecialChar'] = true;
    }

    // Si hay algún error de complejidad, agregar el error general
    if (errors['noUpperCase'] || errors['noLowerCase'] || errors['noNumber'] || errors['noSpecialChar']) {
      errors['weakPassword'] = true;
    }

    // Si no hay errores, retornar null (válido)
    // Si hay errores, retornar el objeto de errores
    return Object.keys(errors).length > 0 ? errors : null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  // Variable para mostrar/ocultar contraseña
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        passwordStrengthValidator() // ← Nuestro validador personalizado
      ]],
      acceptTerms: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password } = this.registerForm.value;

    this.authService.registerClient(email, password).subscribe({
      next: () => {
        this.successMessage = '¡Registro exitoso! Ahora puedes iniciar sesión con tu correo electrónico.';
        console.log('Registro exitoso');

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error('Error en registro:', error);
      },
      complete: () => {
        // No establecer loading = false aquí para mantener el estado hasta la redirección
      },
    });
  }

  // Toggle para mostrar/ocultar contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Getters para acceder fácilmente a los controles del formulario
  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get acceptTerms() {
    return this.registerForm.get('acceptTerms');
  }
  
  // Métodos helper para verificar requisitos de contraseña
  hasMinLength(): boolean {
    return this.password?.value?.length >= 8;
  }
  
  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.password?.value);
  }
  
  hasLowerCase(): boolean {
    return /[a-z]/.test(this.password?.value);
  }
  
  hasNumber(): boolean {
    return /\d/.test(this.password?.value);
  }
  
  hasSpecialChar(): boolean {
    return /[^A-Za-z0-9]/.test(this.password?.value);
  }
}