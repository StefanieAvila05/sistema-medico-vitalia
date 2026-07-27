# Sistema Médico Vitalia 🏥

Aplicación web desarrollada para la gestión de citas médicas, autenticación de pacientes y control de turnos en tiempo real. Este repositorio contiene tanto el **Backend** (FastAPI) como el **Frontend** (Angular).

---

## 🛠️ Tecnologías Utilizadas
* **Backend:** Python, FastAPI, Uvicorn.
* **Frontend:** Angular (Standalone Components), TypeScript, HTML5, CSS3.
* **Control de Versiones:** Git y GitHub.

---

## 📋 Requisitos Previos
Asegúrate de tener instalado en tu equipo:
* Python (versión 3.9 o superior)
* Node.js y npm (para Angular CLI)
* Git

---

## 🚀 Guía de Instalación y Ejecución

Clona este repositorio en tu máquina local:
```bash
git clone [https://github.com/StefanieAvila05/sistema-medico-vitalia.git](https://github.com/StefanieAvila05/sistema-medico-vitalia.git)
cd sistema-medico-vitalia

```

1. Levantar el Backend (FastAPI)
Navega a la carpeta del backend:

```bash
cd T02.3_Ingenieria_Software
```

Instala las dependencias necesarias:

```bash
pip install -r requirements.txt
```

Ejecuta el servidor de la API:

```bash
uvicorn app.main:app --reload
```

2. Levantar el Frontend (Angular)
Abre otra ventana de la terminal y navega a la carpeta del frontend:

```bash
cd frontend-angular
```

Instala los módulos:

```bash
npm install
```

Inicia la aplicación web:

```bash
ng serve
```
