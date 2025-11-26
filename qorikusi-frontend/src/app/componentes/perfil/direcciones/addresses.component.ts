import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DireccionService } from '../../../servicio/direccion.service';
import { UbigeoService } from '../../../servicio/ubigeo.service';
import { DireccionResponse, DireccionRequest } from '../../../modelos/Direccion.model';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit {

  direcciones: DireccionResponse[] = [];
  direccionForm!: FormGroup;
  
  // Listas para selección en cascada
  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: string[] = [];
  
  loading = false;
  showModal = false;
  editMode = false;
  direccionEditando: DireccionResponse | null = null;
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private direccionService: DireccionService,
    private ubigeoService: UbigeoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarDirecciones();
    this.cargarDepartamentos();
  }

  initForm() {
    this.direccionForm = this.fb.group({
      departamento: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      distrito: ['', [Validators.required]],
      calle: ['', [Validators.required, Validators.maxLength(250)]]
    });

    // Suscribirse a cambios en departamento para cargar provincias
    this.direccionForm.get('departamento')?.valueChanges.subscribe(departamento => {
      if (departamento) {
        this.cargarProvincias(departamento);
        // Limpiar provincia y distrito
        this.direccionForm.patchValue({
          provincia: '',
          distrito: ''
        });
        this.distritos = [];
      }
    });

    // Suscribirse a cambios en provincia para cargar distritos
    this.direccionForm.get('provincia')?.valueChanges.subscribe(provincia => {
      const departamento = this.direccionForm.get('departamento')?.value;
      if (provincia && departamento) {
        this.cargarDistritos(departamento, provincia);
        // Limpiar distrito
        this.direccionForm.patchValue({
          distrito: ''
        });
      }
    });
  }

  cargarDirecciones() {
    this.loading = true;
    this.direccionService.listarDirecciones().subscribe({
      next: (direcciones) => {
        this.direcciones = direcciones;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  cargarDepartamentos() {
    this.ubigeoService.obtenerTodosLosUbigeos().subscribe({
      next: () => {
        this.departamentos = this.ubigeoService.obtenerDepartamentos();
      },
      error: (error) => {
        console.error('Error al cargar departamentos:', error);
      }
    });
  }

  cargarProvincias(departamento: string) {
    this.provincias = this.ubigeoService.obtenerProvincias(departamento);
  }

  cargarDistritos(departamento: string, provincia: string) {
    this.distritos = this.ubigeoService.obtenerDistritos(departamento, provincia);
  }

  openModal() {
    this.showModal = true;
    this.editMode = false;
    this.direccionEditando = null;
    this.direccionForm.reset();
    this.provincias = [];
    this.distritos = [];
    this.successMessage = '';
    this.errorMessage = '';
  }

  openEditModal(direccion: DireccionResponse) {
    this.showModal = true;
    this.editMode = true;
    this.direccionEditando = direccion;
    this.successMessage = '';
    this.errorMessage = '';

    // Primero, cargar las listas en cascada según el ubigeo actual
    this.cargarProvincias(direccion.departamento);
    this.cargarDistritos(direccion.departamento, direccion.provincia);

    // Usar setTimeout para permitir que Angular actualice el DOM con las nuevas opciones
    // antes de establecer los valores en el formulario
    // Usar emitEvent: false para evitar que los valueChanges limpien los campos
    setTimeout(() => {
      this.direccionForm.patchValue({
        departamento: direccion.departamento,
        provincia: direccion.provincia,
        distrito: direccion.distrito,
        calle: direccion.calle
      }, { emitEvent: false });
    }, 0);
  }

  closeModal() {
    this.showModal = false;
    this.direccionForm.reset();
    this.editMode = false;
    this.direccionEditando = null;
    this.provincias = [];
    this.distritos = [];
  }

  guardarDireccion() {
    if (this.direccionForm.invalid) {
      Object.keys(this.direccionForm.controls).forEach(key => {
        this.direccionForm.get(key)?.markAsTouched();
      });
      return;
    }

    const { departamento, provincia, distrito, calle } = this.direccionForm.value;

    // Obtener el código de ubigeo
    const codigoUbigeo = this.ubigeoService.obtenerCodigoUbigeo(departamento, provincia, distrito);

    if (!codigoUbigeo) {
      this.errorMessage = 'No se encontró el código de ubigeo para la ubicación seleccionada';
      return;
    }

    const direccionRequest: DireccionRequest = {
      calle,
      codigoUbigeo
    };

    this.loading = true;
    this.errorMessage = '';

    if (this.editMode && this.direccionEditando) {
      // Editar dirección existente
      this.direccionService.actualizarDireccion(this.direccionEditando.uuidDireccion, direccionRequest)
        .subscribe({
          next: (response) => {
            this.successMessage = '¡Dirección actualizada correctamente!';
            this.cargarDirecciones();
            this.loading = false;
            
            setTimeout(() => {
              this.closeModal();
              this.successMessage = '';
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.loading = false;
          }
        });
    } else {
      // Crear nueva dirección
      this.direccionService.crearDireccion(direccionRequest).subscribe({
        next: (response) => {
          this.successMessage = '¡Dirección agregada correctamente!';
          this.cargarDirecciones();
          this.loading = false;
          
          setTimeout(() => {
            this.closeModal();
            this.successMessage = '';
          }, 1500);
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.loading = false;
        }
      });
    }
  }

  eliminarDireccion(direccion: DireccionResponse) {
    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar la dirección:\n${direccion.calle}\n${direccion.distrito}, ${direccion.provincia}?`
    );

    if (!confirmacion) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.direccionService.eliminarDireccion(direccion.uuidDireccion).subscribe({
      next: () => {
        this.successMessage = 'Dirección eliminada correctamente';
        this.cargarDirecciones();
        this.loading = false;
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.loading = false;
      }
    });
  }

  volverAlPerfil() {
    this.router.navigate(['/profile']);
  }

  // Getters para facilitar acceso a controles del formulario
  get departamento() {
    return this.direccionForm.get('departamento');
  }

  get provincia() {
    return this.direccionForm.get('provincia');
  }

  get distrito() {
    return this.direccionForm.get('distrito');
  }

  get calle() {
    return this.direccionForm.get('calle');
  }
}