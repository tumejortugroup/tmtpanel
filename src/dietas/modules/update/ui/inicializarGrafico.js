export let macroChart; 

export function inicializarGrafico() {
  const canvas = document.getElementById('macroChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  Chart.register(ChartDataLabels);

  macroChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Proteínas', 'Grasas', 'Carbohidratos'],
      datasets: [{
        label: 'Distribución Macronutrientes',
        data: [0, 0, 0], // ← valores iniciales vacíos
        backgroundColor: ['blue', 'red', 'orange'],
         borderColor: ['#000000ff', '#000000ff', '#000000ff'],
        borderWidth: 1
      }]
    },
    options: {
    responsive: false, // 👈 importante
    maintainAspectRatio: false, // 👈 permite tamaño libre
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: value => `${value}g`
      },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + ' gr';
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}


