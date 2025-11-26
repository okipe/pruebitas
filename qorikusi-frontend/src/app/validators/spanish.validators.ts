import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores personalizados para campos de texto en español
 */
export class SpanishValidators {
  /**
   * Validador que solo acepta letras (incluidas tildes, ñ, ü) y espacios
   * Coincide con el regex del backend: ^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$
   */
  static lettersOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validar si está vacío (usar Validators.required para eso)
      }

      const letterRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/;
      const valid = letterRegex.test(control.value);

      return valid
        ? null
        : {
            lettersOnly: {
              value: control.value,
              message: 'Solo se permiten letras y espacios',
            },
          };
    };
  }

  /**
   * Validador que solo acepta números
   * Coincide con el regex del backend: ^[0-9]+$
   */
  static numbersOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const numberRegex = /^[0-9]+$/;
      const valid = numberRegex.test(control.value);

      return valid
        ? null
        : {
            numbersOnly: {
              value: control.value,
              message: 'Solo se permiten números',
            },
          };
    };
  }

  /**
   * Validador para nombres completos (nombres o apellidos)
   * - Mínimo 2 caracteres
   * - Solo letras y espacios
   * - No permite múltiples espacios consecutivos
   */
  static fullName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value.trim();

      // Verificar longitud mínima
      if (value.length < 2) {
        return {
          fullName: {
            value: control.value,
            message: 'Debe tener al menos 2 caracteres',
          },
        };
      }

      // Verificar que solo tenga letras y espacios
      const letterRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$/;
      if (!letterRegex.test(value)) {
        return {
          fullName: {
            value: control.value,
            message: 'Solo se permiten letras y espacios',
          },
        };
      }

      // Verificar que no tenga múltiples espacios consecutivos
      if (/\s{2,}/.test(value)) {
        return {
          fullName: {
            value: control.value,
            message: 'No se permiten múltiples espacios consecutivos',
          },
        };
      }

      return null;
    };
  }

  /**
   * Validador para teléfonos peruanos
   * - Solo números
   * - 9 dígitos (celular) o 7 dígitos (fijo)
   */
  static peruvianPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = control.value.replace(/\s/g, ''); // Remover espacios

      // Verificar que solo tenga números
      if (!/^[0-9]+$/.test(value)) {
        return {
          peruvianPhone: {
            value: control.value,
            message: 'Solo se permiten números',
          },
        };
      }

      // Verificar longitud (7 para fijo, 9 para celular)
      if (value.length !== 7 && value.length !== 9) {
        return {
          peruvianPhone: {
            value: control.value,
            message: 'Debe tener 7 (fijo) o 9 (celular) dígitos',
          },
        };
      }

      return null;
    };
  }
}
