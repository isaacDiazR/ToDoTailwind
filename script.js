// API Configuration
const API_BASE_URL = 'https://todoapitest.juansegaliz.com/todos';

// Global State
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const messageContainer = document.getElementById('messageContainer');
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');

// Form Elements
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskPriority = document.getElementById('taskPriority');
const taskDueDate = document.getElementById('taskDueDate');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Edit Modal Elements
const editForm = document.getElementById('editForm');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editPriority = document.getElementById('editPriority');
const editDueDate = document.getElementById('editDueDate');

// Stats Elements
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const progressPercent = document.getElementById('progressPercent');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    showLoadingScreen();
    await loadTasks();
    hideLoadingScreen();
    updateStats();
    renderTasks();
}

function setupEventListeners() {
    // Form submission
    taskForm.addEventListener('submit', handleTaskSubmit);
    editForm.addEventListener('submit', handleTaskEdit);
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setActiveFilter(e.target.dataset.filter);
        });
    });
    
    // Modal controls
    document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
    
    // Close modals on outside click
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });
    
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// API Functions
async function apiRequest(endpoint = '', method = 'GET', data = null) {
    const url = endpoint ? `${API_BASE_URL}/${endpoint}` : API_BASE_URL;
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        showMessage(`Error: ${error.message}`, 'error');
        throw error;
    }
}

async function loadTasks() {
    try {
        const response = await apiRequest();
        tasks = response.data || [];
        console.log('Tasks loaded:', tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
    }
}

async function createTask(taskData) {
    try {
        const response = await apiRequest('', 'POST', taskData);
        showMessage('¡Misión creada exitosamente! 🚀', 'success');
        
        // Efecto de partículas verdes para creación exitosa
        setTimeout(() => {
            if (window.createParticleBurst) {
                window.createParticleBurst(submitBtn, 'rgba(16, 185, 129, 0.8)');
            }
        }, 100);
        
        await loadTasks();
        updateStats();
        renderTasks();
        taskForm.reset();
        return response;
    } catch (error) {
        showMessage('Error al crear la misión 😞', 'error');
        throw error;
    }
}

async function updateTask(id, taskData) {
    try {
        const response = await apiRequest(id.toString(), 'PUT', taskData);
        showMessage('¡Misión actualizada exitosamente! ⚡', 'success');
        await loadTasks();
        updateStats();
        renderTasks();
        return response;
    } catch (error) {
        showMessage('Error al actualizar la misión 😞', 'error');
        throw error;
    }
}

async function deleteTask(id) {
    try {
        await apiRequest(id.toString(), 'DELETE');
        showMessage('¡Misión eliminada exitosamente! 💀', 'success');
        
        // Efecto de partículas rojas para eliminación
        setTimeout(() => {
            if (window.createParticleBurst) {
                const confirmBtn = document.getElementById('confirmDelete');
                window.createParticleBurst(confirmBtn, 'rgba(239, 68, 68, 0.8)');
            }
        }, 100);
        
        await loadTasks();
        updateStats();
        renderTasks();
    } catch (error) {
        showMessage('Error al eliminar la misión 😞', 'error');
        throw error;
    }
}

async function toggleTaskComplete(id, isCompleted) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const updatedTask = {
        ...task,
        isCompleted: !isCompleted
    };
    
    await updateTask(id, updatedTask);
    
    // Efecto de partículas cuando se completa una tarea
    if (!isCompleted && window.createParticleBurst) {
        setTimeout(() => {
            const taskElement = document.querySelector(`[data-task-id="${id}"]`);
            if (taskElement) {
                window.createParticleBurst(taskElement, 'rgba(16, 185, 129, 0.8)');
            }
        }, 100);
    }
}

// Event Handlers
async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskData = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        priority: parseInt(taskPriority.value),
        dueAt: taskDueDate.value ? new Date(taskDueDate.value).toISOString() : null,
        isCompleted: false
    };
    
    if (!taskData.title) {
        showMessage('El título de la misión es requerido 📝', 'warning');
        return;
    }
    
    if (editingTaskId) {
        await updateTask(editingTaskId, taskData);
        cancelEdit();
    } else {
        await createTask(taskData);
    }
}

async function handleTaskEdit(e) {
    e.preventDefault();
    
    const taskData = {
        title: editTitle.value.trim(),
        description: editDescription.value.trim(),
        priority: parseInt(editPriority.value),
        dueAt: editDueDate.value ? new Date(editDueDate.value).toISOString() : null,
        isCompleted: tasks.find(t => t.id === editingTaskId)?.isCompleted || false
    };
    
    if (!taskData.title) {
        showMessage('El título de la misión es requerido 📝', 'warning');
        return;
    }
    
    await updateTask(editingTaskId, taskData);
    closeEditModal();
}

// UI Functions
function showLoadingScreen() {
    loadingScreen.classList.remove('hidden');
}

function hideLoadingScreen() {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);
}

function showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    messageContainer.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            messageContainer.removeChild(messageEl);
        }, 300);
    }, 3000);
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted).length;
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    progressPercent.textContent = `${progress}%`;
}

function setActiveFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'completed':
            return tasks.filter(task => task.isCompleted);
        case 'pending':
            return tasks.filter(task => !task.isCompleted);
        case 'high-priority':
            return tasks.filter(task => task.priority >= 4);
        default:
            return tasks;
    }
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tasksList.innerHTML = filteredTasks.map(task => createTaskCard(task)).join('');
    
    // Add event listeners to task cards
    filteredTasks.forEach(task => {
        addTaskEventListeners(task.id);
    });
}

function createTaskCard(task) {
    const priorityLabels = {
        1: '⭐ Fácil',
        2: '⭐⭐ Normal',
        3: '⭐⭐⭐ Difícil',
        4: '💀 Épica',
        5: '👑 Legendaria'
    };
    
    const priorityColors = {
        1: 'priority-1',
        2: 'priority-2',
        3: 'priority-3',
        4: 'priority-4',
        5: 'priority-5'
    };
    
    const statusClass = task.isCompleted ? 'completed' : 'pending';
    const priorityClass = task.priority >= 4 ? 'high-priority' : '';
    
    const dueDate = task.dueAt ? new Date(task.dueAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : null;
    
    const isOverdue = task.dueAt && new Date(task.dueAt) < new Date() && !task.isCompleted;
    
    return `
        <div class="task-card ${statusClass} ${priorityClass}" data-task-id="${task.id}">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <input 
                            type="checkbox" 
                            class="pixel-checkbox" 
                            ${task.isCompleted ? 'checked' : ''}
                            onchange="toggleTaskComplete(${task.id}, ${task.isCompleted})"
                        >
                        <h3 class="text-white font-bold text-lg ${task.isCompleted ? 'line-through opacity-75' : ''}">
                            ${task.title}
                        </h3>
                        <span class="priority-badge ${priorityColors[task.priority]}">
                            ${priorityLabels[task.priority]}
                        </span>
                    </div>
                    
                    ${task.description ? `
                        <p class="text-gray-300 mb-2 ${task.isCompleted ? 'line-through opacity-75' : ''}">
                            ${task.description}
                        </p>
                    ` : ''}
                    
                    <div class="flex flex-wrap gap-2 text-sm">
                        <span class="text-gray-400">
                            🆔 ID: ${task.id}
                        </span>
                        ${dueDate ? `
                            <span class="text-${isOverdue ? 'red' : 'blue'}-400">
                                📅 ${dueDate} ${isOverdue ? '⚠️' : ''}
                            </span>
                        ` : ''}
                        <span class="text-gray-400">
                            ${task.isCompleted ? '✅ Completada' : '⏳ Pendiente'}
                        </span>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-2">
                    <button 
                        class="action-btn btn-view" 
                        onclick="viewTask(${task.id})"
                        title="Ver detalles"
                    >
                        👁️ VER
                    </button>
                    <button 
                        class="action-btn btn-edit" 
                        onclick="editTask(${task.id})"
                        title="Editar misión"
                    >
                        ✏️ EDITAR
                    </button>
                    <button 
                        class="action-btn ${task.isCompleted ? 'btn-edit' : 'btn-complete'}" 
                        onclick="toggleTaskComplete(${task.id}, ${task.isCompleted})"
                        title="${task.isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}"
                    >
                        ${task.isCompleted ? '↩️ PENDIENTE' : '✅ COMPLETAR'}
                    </button>
                    <button 
                        class="action-btn btn-delete" 
                        onclick="showDeleteConfirmation(${task.id})"
                        title="Eliminar misión"
                    >
                        🗑️ ELIMINAR
                    </button>
                </div>
            </div>
            
            ${task.isCompleted ? '<div class="status-indicator status-completed"></div>' : ''}
            ${!task.isCompleted ? '<div class="status-indicator status-pending"></div>' : ''}
            ${isOverdue ? '<div class="status-indicator status-overdue"></div>' : ''}
        </div>
    `;
}

function addTaskEventListeners(taskId) {
    // Event listeners are handled inline in the HTML for simplicity
}

// Task Actions
function viewTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const priorityLabels = {
        1: '⭐ Fácil',
        2: '⭐⭐ Normal', 
        3: '⭐⭐⭐ Difícil',
        4: '💀 Épica',
        5: '👑 Legendaria'
    };
    
    const dueDate = task.dueAt ? new Date(task.dueAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'Sin fecha límite';
    
    const createdDate = task.createdAt && task.createdAt !== "0001-01-01T00:00:00+00:00" 
        ? new Date(task.createdAt).toLocaleDateString('es-ES') 
        : 'No disponible';
    
    const updatedDate = task.updatedAt && task.updatedAt !== "0001-01-01T00:00:00+00:00" 
        ? new Date(task.updatedAt).toLocaleDateString('es-ES') 
        : 'No disponible';
    
    alert(`
🎮 DETALLES DE LA MISIÓN 🎮

🎯 Título: ${task.title}
📝 Descripción: ${task.description || 'Sin descripción'}
⭐ Prioridad: ${priorityLabels[task.priority]}
📅 Fecha límite: ${dueDate}
✅ Estado: ${task.isCompleted ? 'Completada' : 'Pendiente'}
🆔 ID: ${task.id}
📅 Creada: ${createdDate}
📅 Actualizada: ${updatedDate}
    `);
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    editingTaskId = id;
    
    editTitle.value = task.title;
    editDescription.value = task.description || '';
    editPriority.value = task.priority;
    editDueDate.value = task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 16) : '';
    
    editModal.classList.remove('hidden');
}

function closeEditModal() {
    editModal.classList.add('hidden');
    editingTaskId = null;
    editForm.reset();
}

function showDeleteConfirmation(id) {
    editingTaskId = id;
    deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    editingTaskId = null;
}

async function confirmDelete() {
    if (editingTaskId) {
        await deleteTask(editingTaskId);
        closeDeleteModal();
    }
}

function cancelEdit() {
    editingTaskId = null;
    taskForm.reset();
    submitBtn.textContent = '🚀 CREAR MISIÓN';
    cancelBtn.classList.add('hidden');
}

// Make functions globally available
window.viewTask = viewTask;
window.editTask = editTask;
window.toggleTaskComplete = toggleTaskComplete;
window.showDeleteConfirmation = showDeleteConfirmation;

// Add some gaming sound effects (optional)
function playSound(type) {
    // This would be where you could add sound effects
    // For now, we'll just use console.log
    console.log(`🔊 Sound: ${type}`);
}

// Easter egg: Konami code
let konamiCode = [];
const konami = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konami.join(',')) {
        showMessage('🎮 ¡CÓDIGO KONAMI ACTIVADO! ¡Modo Gaming ON! 🎮', 'success');
        document.body.style.filter = 'hue-rotate(180deg)';
        
        // Efecto masivo de partículas para el código Konami
        if (window.createParticleBurst && particleSystem) {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight;
                    particleSystem.burst(x, y, 'rgba(250, 204, 21, 0.9)', 8);
                }, i * 100);
            }
        }
        
        setTimeout(() => {
            document.body.style.filter = '';
        }, 3000);
        konamiCode = [];
    }
});

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 50; // Número reducido para ser liviano
        this.colors = [
            'rgba(16, 185, 129, 0.6)',    // Verde
            'rgba(59, 130, 246, 0.6)',    // Azul
            'rgba(139, 92, 246, 0.6)',    // Púrpura
            'rgba(250, 204, 21, 0.6)',    // Amarillo
            'rgba(34, 211, 238, 0.6)'     // Cian
        ];
        
        this.setupCanvas();
        this.init();
        this.animate();
        
        // Redimensionar canvas cuando cambie el tamaño de ventana
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5, // Velocidad muy lenta
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1, // Tamaño pequeño
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: Math.random() * 0.5 + 0.1, // Opacidad baja
            life: Math.random() * 200 + 100,
            maxLife: 300
        };
    }
    
    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // Fade out gradualmente
        particle.opacity = (particle.life / particle.maxLife) * 0.3;
        
        // Rebote suave en los bordes
        if (particle.x <= 0 || particle.x >= this.canvas.width) {
            particle.vx *= -0.8;
        }
        if (particle.y <= 0 || particle.y >= this.canvas.height) {
            particle.vy *= -0.8;
        }
        
        // Mantener dentro de los límites
        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        
        // Regenerar partícula si muere
        if (particle.life <= 0) {
            Object.assign(particle, this.createParticle());
        }
    }
    
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        
        // Crear efecto de glow sutil
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;
        
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Actualizar y dibujar partículas
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // Conectar partículas cercanas con líneas sutiles
        this.connectParticles();
        
        requestAnimationFrame(() => this.animate());
    }
    
    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) { // Distancia de conexión reducida
                    this.ctx.save();
                    this.ctx.globalAlpha = (1 - distance / 100) * 0.1; // Muy sutil
                    this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
    
    // Método para agregar partículas en eventos específicos
    burst(x, y, color, count = 5) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle();
            particle.x = x + (Math.random() - 0.5) * 20;
            particle.y = y + (Math.random() - 0.5) * 20;
            particle.vx = (Math.random() - 0.5) * 2;
            particle.vy = (Math.random() - 0.5) * 2;
            particle.color = color || this.colors[Math.floor(Math.random() * this.colors.length)];
            particle.opacity = 0.8;
            particle.size = Math.random() * 3 + 2;
            
            // Reemplazar una partícula existente
            const randomIndex = Math.floor(Math.random() * this.particles.length);
            this.particles[randomIndex] = particle;
        }
    }
}

// Inicializar sistema de partículas cuando la página esté lista
let particleSystem;

document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco antes de inicializar para asegurar que el canvas esté listo
    setTimeout(() => {
        particleSystem = new ParticleSystem();
    }, 500);
});

// Función global para crear efectos de partículas en eventos
window.createParticleBurst = (element, color) => {
    if (particleSystem && element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        particleSystem.burst(x, y, color);
    }
};

console.log('🎮 GameToDo Quest initialized! Ready to conquer your tasks! 🚀');