import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  login(credenciales: { cedula: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credenciales);
  }

  obtenerPaciente(cedula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pacientes/${cedula}`);
  }

  registrarPaciente(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pacientes`, datos);
  }

  actualizarPaciente(cedula: string, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pacientes/${cedula}`, datos);
  }

  eliminarCuenta(cedula: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pacientes/${cedula}`);
  }

  agendarCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/citas`, cita);
  }

  obtenerCitas(cedula: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/citas/${cedula}`);
  }

  obtenerDisponibilidad(medico: string, fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/medicos/disponibilidad?medico=${encodeURIComponent(medico)}&fecha=${fecha}`);
  }
}