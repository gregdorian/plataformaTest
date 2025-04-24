const { createClient } = supabase;
    const supabaseUrl = 'https://eijeaimjxaywhohceqfc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpamVhaW1qeGF5d2hvaGNlcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxODg5NzEsImV4cCI6MjA2MDc2NDk3MX0.zyknNW6-uI0UtKhWIMVR-7K1EU5u_EYtpfsr8wgx7Mk';
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    async function fetchAverageScores() {
      const { data, error } = await supabaseClient.rpc('get_avg_scores_by_gender');
      if (error) {
        console.error('Error obteniendo datos:', error);
        return [];
      }
      return data;
    }

    async function fetchDistributions() {
      const { data, error } = await supabaseClient
        .from('resultados_tmms')
        .select('genero, evaluacion_percepcion, evaluacion_comprension, evaluacion_regulacion');
      if (error) {
        console.error('Error obteniendo distribución:', error);
        return [];
      }
      return data;
    }

    function renderAvgChart(data) {
      const labels = data.map(row => row.genero === 'male' ? 'Hombre' : 'Mujer');
      const percepcion = data.map(row => row.avg_percepcion);
      const comprension = data.map(row => row.avg_comprension);
      const regulacion = data.map(row => row.avg_regulacion);

      new Chart(document.getElementById('avgScoresByGender'), {
        type: 'bar',
        data: {
          labels,
          datasets: [
            { label: 'Percepción', data: percepcion, backgroundColor: 'rgba(255, 99, 132, 0.6)' },
            { label: 'Comprensión', data: comprension, backgroundColor: 'rgba(54, 162, 235, 0.6)' },
            { label: 'Regulación', data: regulacion, backgroundColor: 'rgba(75, 192, 192, 0.6)' },
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Promedio por Dimensión y Género'
            }
          }
        }
      });
    }

    function renderDistributionChart(data, key, canvasId, titleText, color1, color2) {
      const categories = ['Debe mejorar', 'Adecuada', 'Excelente'];
      const maleCounts = categories.map(cat => data.filter(d => d.genero === 'male' && d[key] === cat).length);
      const femaleCounts = categories.map(cat => data.filter(d => d.genero === 'female' && d[key] === cat).length);

      new Chart(document.getElementById(canvasId), {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [
            { label: 'Hombres', data: maleCounts, backgroundColor: color1 },
            { label: 'Mujeres', data: femaleCounts, backgroundColor: color2 },
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: titleText
            }
          }
        }
      });
    }

    async function initDashboard() {
      const avgScores = await fetchAverageScores();
      renderAvgChart(avgScores);

      const data = await fetchDistributions();
      renderDistributionChart(data, 'evaluacion_percepcion', 'distributionPerception', 'Percepción Emocional por Género', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)');
      renderDistributionChart(data, 'evaluacion_comprension', 'distributionComprension', 'Comprensión de Sentimientos por Género', 'rgba(255, 205, 86, 0.6)', 'rgba(201, 203, 207, 0.6)');
      renderDistributionChart(data, 'evaluacion_regulacion', 'distributionRegulacion', 'Regulación Emocional por Género', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)');
    }

    initDashboard();