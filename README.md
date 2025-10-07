# 🎮 GameToDo Quest - Pixel Art Task Manager

Una aplicación web de gestión de tareas con estilo pixel art y temática gaming que consume una API REST completa.

## 🚀 Características

### ✨ Funcionalidades Principales
- **CRUD Completo**: Crear, leer, actualizar y eliminar tareas
- **Interfaz Gaming**: Diseño pixel art con colores y efectos gaming
- **Responsive Design**: Adaptable a diferentes dispositivos y pantallas
- **Filtros Inteligentes**: Filtrar por estado, prioridad, etc.
- **Estadísticas en Tiempo Real**: Dashboard con métricas de progreso
- **Efectos Visuales**: Animaciones y efectos especiales

### 🎯 API Endpoints Implementados
- `GET /todos` - Listar todas las tareas
- `POST /todos` - Crear nueva tarea
- `PUT /todos/{id}` - Actualizar tarea existente
- `DELETE /todos/{id}` - Eliminar tarea
- Consulta individual integrada en la vista de detalles

### 🎨 Diseño y UX
- **Tema Pixel Art**: Fuentes, bordes y efectos retro
- **Colores Gaming**: Paleta de colores inspirada en videojuegos
- **Interfaz Intuitiva**: Navegación clara y funcional
- **Feedback Visual**: Mensajes de estado y confirmaciones
- **Efectos Especiales**: Animaciones de hover, glitch effects, scan lines

### 📱 Responsive Features
- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints Adaptativos**: Layouts que se ajustan automáticamente
- **Touch Friendly**: Botones y controles optimizados para touch
- **Performance**: Carga rápida y optimizada

## 🛠️ Stack Tecnológico

- **HTML5**: Estructura semántica y accesible
- **Tailwind CSS**: Framework de utilidades para estilos
- **CSS3 Custom**: Efectos pixel art y animaciones personalizadas
- **JavaScript ES6+**: Lógica de aplicación y manejo de API
- **Fetch API**: Comunicación con el backend
- **Google Fonts**: Fuente Press Start 2P para el efecto retro

## 🎮 Características Gaming

### 🌟 Efectos Visuales
- **Scan Lines**: Líneas de escaneo animadas
- **Glitch Effect**: Efecto glitch para tareas de alta prioridad
- **Pixel Buttons**: Botones con efecto de profundidad pixel
- **Color Coding**: Sistema de colores por prioridad y estado
- **Progress Bars**: Barras de progreso con efectos shimmer

### 🎯 Sistema de Prioridades
- ⭐ **Fácil** (Prioridad 1): Verde - Tareas simples
- ⭐⭐ **Normal** (Prioridad 2): Azul - Tareas regulares
- ⭐⭐⭐ **Difícil** (Prioridad 3): Amarillo - Tareas complejas
- 💀 **Épica** (Prioridad 4): Naranja - Tareas importantes
- 👑 **Legendaria** (Prioridad 5): Rojo - Tareas críticas con efectos especiales

### 🏆 Easter Eggs
- **Código Konami**: Secuencia secreta para efectos especiales
- **Sound Feedback**: Sistema preparado para efectos de sonido
- **Loading Screen**: Pantalla de carga con estilo gaming

## 📋 Funcionalidades Detalladas

### ➕ Crear Tareas
- Formulario intuitivo con validación
- Campos: título, descripción, prioridad, fecha límite
- Feedback visual inmediato
- Reset automático del formulario

### 📝 Editar Tareas
- Modal de edición con datos pre-cargados
- Actualización en tiempo real
- Cancelación sin guardar cambios
- Validación de campos requeridos

### ❌ Eliminar Tareas
- Confirmación antes de eliminar
- Modal de confirmación con advertencia
- Feedback de eliminación exitosa
- Actualización automática de la lista

### 👁️ Ver Detalles
- Vista completa de información de la tarea
- Fechas de creación y actualización
- Estado completo y prioridad
- Información de ID para debugging

### ✅ Cambiar Estado
- Toggle de completado/pendiente
- Actualización visual inmediata
- Efectos de transición suaves
- Preservación de otros datos

### 🔍 Filtros
- **Todas**: Mostrar todas las tareas
- **Pendientes**: Solo tareas no completadas
- **Completadas**: Solo tareas finalizadas
- **Alta Prioridad**: Tareas épicas y legendarias

### 📊 Dashboard de Estadísticas
- **Total de Quests**: Número total de tareas
- **Completadas**: Tareas finalizadas
- **Pendientes**: Tareas por hacer
- **Progreso**: Porcentaje de completitud

## 🚀 Instalación y Uso

1. **Clonar/Descargar** los archivos del proyecto
2. **Abrir** `index.html` en un navegador web
3. **¡Listo!** La aplicación se conectará automáticamente a la API

### 📁 Estructura de Archivos
```
ToDoTailwind/
├── index.html          # Página principal
├── styles.css          # Estilos pixel art personalizados
├── script.js           # Lógica de aplicación y API
└── README.md           # Documentación
```

## 🌐 API Configuration

La aplicación está configurada para consumir la API:
- **Base URL**: `https://todoapitest.juansegaliz.com/todos`
- **Formato**: JSON
- **Métodos**: GET, POST, PUT, DELETE
- **Headers**: Content-Type: application/json

### 📋 Estructura de Datos
```javascript
{
  "id": 513,
  "title": "Título de la tarea",
  "description": "Descripción opcional",
  "isCompleted": false,
  "priority": 1,
  "dueAt": "2024-01-01T12:00:00Z",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

## 🎨 Personalización

### 🎨 Colores
Los colores están definidos usando clases de Tailwind CSS y pueden modificarse fácilmente:
- **Gaming Green**: `#10b981`
- **Gaming Blue**: `#3b82f6`
- **Gaming Purple**: `#8b5cf6`
- **Gaming Yellow**: `#f59e0b`
- **Gaming Red**: `#ef4444`

### ⚡ Efectos
Los efectos pixel art están en `styles.css` y pueden personalizarse:
- Animaciones de hover
- Efectos de glitch
- Scan lines
- Transiciones de color

## 🔧 Desarrollo

### 🐛 Debugging
- Console logs para tracking de operaciones
- Manejo de errores con mensajes user-friendly
- Validación de formularios
- Estados de loading

### 🚀 Performance
- Carga asíncrona de datos
- Actualización eficiente del DOM
- Manejo de estados optimizado
- Cleanup de event listeners

### 📱 Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎮 Tips de Uso

1. **Prioridades**: Usa el sistema de prioridades para organizar mejor tus tareas
2. **Fechas Límite**: Asigna fechas para tareas importantes
3. **Filtros**: Utiliza los filtros para enfocarte en tareas específicas
4. **Descripciones**: Añade descripciones detalladas para tareas complejas
5. **Easter Egg**: Prueba el código Konami para sorpresas especiales

## 🚀 Próximas Mejoras

- [ ] Sonidos de efectos (SFX)
- [ ] Modo oscuro/claro
- [ ] Drag & drop para reordenar
- [ ] Categorías de tareas
- [ ] Recordatorios push
- [ ] Modo offline
- [ ] Exportar/importar datos
- [ ] Temas de color adicionales

## 🎉 ¡Disfruta Gestionando tus Tareas!

¡Convierte tu productividad en un juego! Completa misiones, sube de nivel y conquista tu día con GameToDo Quest.

---

**Desarrollado con ❤️ y mucho ☕ para hacer la gestión de tareas más divertida**