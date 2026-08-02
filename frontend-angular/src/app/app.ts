import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClinicaService } from './services/clinica';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private clinicaService = inject(ClinicaService);

  // Modos de navegación: 'menu', 'login', 'registrar', 'dashboard', 'agendar', 'ver-citas', 'editar-perfil', 'confirmar-borrar'
  modo = signal<'menu' | 'login' | 'registrar' | 'dashboard' | 'agendar' | 'ver-citas' | 'editar-perfil' | 'confirmar-borrar'>('menu');
  
  menuUsuarioAbierto = signal<boolean>(false);

  credencialesLogin = signal({ cedula: '', password: '' });
  
  paciente = signal({
    cedula: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    direccion: ''
  });

  nuevaCita = signal({
    especialidad: 'Medicina General',
    medico: 'Dr. Carlos Mendoza',
    fecha: '',
    hora: '',
    motivo: ''
  });

  rangoHorarioMedico = signal<string>('');
  horasOcupadas = signal<string[]>([]);
  
  listaCitas = signal<any[]>([]);
  medicos = [
  // Medicina General
  { nombre: 'Dr. Carlos Mendoza', especialidad: 'Medicina General' },
  { nombre: 'Dra. Andrea León', especialidad: 'Medicina General' },
  { nombre: 'Dr. Miguel Herrera', especialidad: 'Medicina General' },

  // Pediatría
  { nombre: 'Dra. Ana Torres', especialidad: 'Pediatría' },
  { nombre: 'Dr. José Ramírez', especialidad: 'Pediatría' },
  { nombre: 'Dra. Sofía Castillo', especialidad: 'Pediatría' },

  // Cardiología
  { nombre: 'Dr. Luis Zambrano', especialidad: 'Cardiología' },
  { nombre: 'Dra. Valeria Paredes', especialidad: 'Cardiología' },
  { nombre: 'Dr. Daniel Mora', especialidad: 'Cardiología' },

  // Dermatología
  { nombre: 'Dra. Camila Espinoza', especialidad: 'Dermatología' },
  { nombre: 'Dr. Ricardo Vélez', especialidad: 'Dermatología' },
  { nombre: 'Dra. Paola Salinas', especialidad: 'Dermatología' },

  // Ginecología
  { nombre: 'Dra. María Fernández', especialidad: 'Ginecología' },
  { nombre: 'Dra. Isabel Guerrero', especialidad: 'Ginecología' },
  { nombre: 'Dr. Andrés Molina', especialidad: 'Ginecología' },

  // Traumatología
  { nombre: 'Dr. Jorge Cedeño', especialidad: 'Traumatología' },
  { nombre: 'Dr. Esteban Ruiz', especialidad: 'Traumatología' },
  { nombre: 'Dra. Karen López', especialidad: 'Traumatología' }
];
  mensaje = signal<string>('');
  error = signal<boolean>(false);

  cambiarModo(nuevoModo: any) {
    this.modo.set(nuevoModo);
    this.mensaje.set('');
    this.error.set(false);
    this.menuUsuarioAbierto.set(false);
    if (nuevoModo === 'agendar') {
    this.filtrarMedicos();
    }
  }

  toggleMenuUsuario() {
    this.menuUsuarioAbierto.update(v => !v);
  }

  iniciarSesion() {
    const creds = this.credencialesLogin();
    if (!creds.cedula || !creds.password) {
      this.mensaje.set('Por favor, inserte bien la contraseña o cédula.');
      this.error.set(true);
      return;
    }

    this.clinicaService.login(creds).subscribe({
      next: (res: any) => {
        this.paciente.set(res);
        this.modo.set('dashboard');
        this.mensaje.set('');
        this.error.set(false);
        this.credencialesLogin.set({ cedula: '', password: '' });
      },
      error: (err) => {
        const msg = err.error?.detail || 'Por favor, inserte bien la contraseña o cédula.';
        this.mensaje.set(msg);
        this.error.set(true);
      }
    });
  }

  guardarRegistro() {
    const p = this.paciente();
    if (!p.cedula || !p.password || !p.nombre || !p.apellido || !p.telefono || !p.correo || !p.direccion) {
      this.mensaje.set('Por favor complete los datos. No se pudo realizar el registro.');
      this.error.set(true);
      return;
    }

    this.clinicaService.registrarPaciente(p).subscribe({
      next: () => {
        this.mensaje.set('¡Registro exitoso! Ya puedes iniciar sesión.');
        this.error.set(false);
        setTimeout(() => this.cambiarModo('login'), 1500);
      },
      error: () => {
        this.mensaje.set('Error al registrar. La cédula ya se encuentra registrada.');
        this.error.set(true);
      }
    });
  }

  actualizarDatos() {
    const datos = this.paciente();
    this.clinicaService.actualizarPaciente(datos.cedula, datos).subscribe({
      next: () => {
        this.mensaje.set('¡Datos actualizados correctamente!');
        this.error.set(false);
      },
      error: () => {
        this.mensaje.set('Error al actualizar los datos.');
        this.error.set(true);
      }
    });
  }

  ejecutarBorrarCuenta() {
    const cedula = this.paciente().cedula;
    this.clinicaService.eliminarCuenta(cedula).subscribe({
      next: () => {
        this.mensaje.set('Cuenta eliminada exitosamente.');
        this.error.set(false);
        setTimeout(() => {
          this.cerrarSesion();
        }, 1500);
      },
      error: () => {
        this.mensaje.set('Error al eliminar la cuenta.');
        this.error.set(true);
      }
    });
  }

  cerrarSesion() {
    this.paciente.set({ cedula: '', password: '', nombre: '', apellido: '', telefono: '', correo: '', direccion: '' });
    this.cambiarModo('menu');
  }

  actualizarDisponibilidad() {
    const cita = this.nuevaCita();
    if (!cita.fecha) return;

    this.clinicaService.obtenerDisponibilidad(cita.medico, cita.fecha).subscribe({
      next: (res: any) => {
        this.rangoHorarioMedico.set(res.horario_atencion);
        this.horasOcupadas.set(res.horas_ocupadas);
      },
      error: () => {
        this.rangoHorarioMedico.set('No disponible');
        this.horasOcupadas.set([]);
      }
    });
  }

  registrarCita() {
    const citaData = {
      cedula: this.paciente().cedula,
      ...this.nuevaCita()
    };

    if (!citaData.fecha || !citaData.hora || !citaData.motivo) {
      this.mensaje.set('Por favor complete todos los campos de la cita.');
      this.error.set(true);
      return;
    }

    this.clinicaService.agendarCita(citaData).subscribe({
      next: () => {
        this.mensaje.set('¡Cita médica agendada con éxito!');
        this.error.set(false);
        setTimeout(() => this.cargarCitas(), 1000);
      },
      error: (err) => {
        const msg = err.error?.detail || 'Este horario ya se encuentra ocupado con este médico.';
        this.mensaje.set(msg);
        this.error.set(true);
      }
    });
  }

  cargarCitas() {
    this.clinicaService.obtenerCitas(this.paciente().cedula).subscribe({
      next: (res) => {
        this.listaCitas.set(res);
        this.modo.set('ver-citas');
      },
      error: () => {
        this.mensaje.set('Error al cargar las citas.');
        this.error.set(true);
      }
    });
  }
obtenerMedicosFiltrados() {
  return this.medicos.filter(
    m => m.especialidad === this.nuevaCita().especialidad
  );
}

obtenerEspecialidades() {
  return [...new Set(this.medicos.map(m => m.especialidad))];
}

filtrarMedicos() {
  const medicos = this.obtenerMedicosFiltrados();

  this.nuevaCita.update(cita => ({
    ...cita,
    medico: medicos.length > 0 ? medicos[0].nombre : ''
  }));

  this.actualizarDisponibilidad();
}
}