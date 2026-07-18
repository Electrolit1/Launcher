# Wanheda Launcher

Launcher de Electron para Wanheda Studio, con soporte para iniciar Minecraft, gestionar instalaciones y mostrar noticias del proyecto.

## Requisitos

- Node.js 18 o superior
- npm
- Windows (este proyecto está orientado a Electron/Windows)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Electrolit1/Wanheda-Launcher.git
   cd Wanheda-Launcher
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecutar en desarrollo

```bash
npm start
```

## Construir ejecutable

```bash
npm run build
```

## Estructura principal

- `main.js`: punto de entrada de Electron
- `launcher/`: lógica del launcher, instalación y actualización
- `src/`: interfaz de usuario y recursos de la app

## Notas

- El proyecto usa Electron y requiere acceso a recursos locales para descargar e instalar Minecraft.
- Si aparece algún error de dependencias, vuelve a ejecutar:
  ```bash
  npm install
  ```
