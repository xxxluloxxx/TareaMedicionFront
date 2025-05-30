<script setup>
import { TareaService } from '@/service/Tarea';
import Chart from 'primevue/chart';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const valor = ref('0');
const loading = ref(true);
const MAX_POINTS = 20; // Número máximo de puntos a mostrar

const lineData = ref({
    labels: [],
    datasets: [
        {
            label: 'EMG',
            data: [],
            fill: false,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            tension: 0.4,
            borderWidth: 2
        }
    ]
});

const lineOptions = ref({
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Tiempo',
                color: '#ffffff'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: '#ffffff'
            }
        },
        y: {
            display: true,
            title: {
                display: true,
                text: 'Valor',
                color: '#ffffff'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: '#ffffff'
            }
        }
    },
    animation: {
        duration: 0 // Desactivar animaciones para una actualización más suave
    }
});

let intervalo;

const fondoImagen = computed(() => {
    const num = parseFloat(valor.value);
    if (!isNaN(num) && num > 180) {
        return 'bg-green';
    } else {
        return 'bg-red';
    }
});

onMounted(() => {
    // Función para actualizar los datos
    const actualizarDatos = () => {
        // Actualizar valor actual
        TareaService.getLast()
            .then((data) => {
                valor.value = data.valor;
            });

        // Actualizar datos de la gráfica
        TareaService.getAll()
            .then((data) => {
                console.log('Datos recibidos:', data);
                if (Array.isArray(data) && data.length > 0) {
                    // Tomar solo los últimos MAX_POINTS puntos y ordenarlos por fecha
                    const ultimosDatos = data
                        .slice(-MAX_POINTS)
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                    lineData.value.labels = ultimosDatos.map(item => new Date(item.createdAt).toLocaleTimeString());
                    lineData.value.datasets[0].data = ultimosDatos.map(item => item.valor);
                    console.log('Datos procesados:', lineData.value);
                } else {
                    console.warn('No se recibieron datos válidos');
                }
                loading.value = false;
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
                loading.value = false;
            });
    };

    // Llamada inicial
    actualizarDatos();

    // Configurar intervalo para actualizar cada segundo
    intervalo = setInterval(actualizarDatos, 100);
});

// Limpiar el intervalo cuando el componente se desmonte
onUnmounted(() => {
    if (intervalo) {
        clearInterval(intervalo);
    }
});
</script>

<template>
    <div class="vertical-container">
        <!-- Primera división - Valor dinámico -->
        <div class="top-section">
            <div class="top-content">
                <div class="image-container" :class="fondoImagen">
                    <img src="@/assets/logos/human2.png" alt="Logo" class="logo-image" />
                </div>
                <div class="value-container">
                    <span class="text-9xl font-bold text-primary">{{ valor }}°</span>
                </div>
            </div>
        </div>

        <!-- Segunda división - Gráfica EMG -->
        <div class="bottom-section">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Gráfica EMG</div>
                <div v-if="loading" class="flex justify-center items-center py-8">
                    <ProgressSpinner />
                </div>
                <div v-else class="h-full">
                    <Chart type="line" :data="lineData" :options="lineOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.vertical-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
}

.top-section {
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--surface-border);
}

.top-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 2rem;
}

.image-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.value-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo-image {
    max-width: 200px;
    height: auto;
}

.bottom-section {
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    width: 100%;
    height: 100%;
    padding: 1rem;
}

.bg-green {
    background: #4caf50;
    border-radius: 16px;
    transition: background 0.3s;
}

.bg-red {
    background: #ff6f61;
    border-radius: 16px;
    transition: background 0.3s;
}
</style>
