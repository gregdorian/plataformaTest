 // Configuración de Supabase
 const { createClient } = supabase;
 const supabaseUrl = 'https://eijeaimjxaywhohceqfc.supabase.co';
 const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpamVhaW1qeGF5d2hvaGNlcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxODg5NzEsImV4cCI6MjA2MDc2NDk3MX0.zyknNW6-uI0UtKhWIMVR-7K1EU5u_EYtpfsr8wgx7Mk';
 const supabaseClient = createClient(supabaseUrl, supabaseKey);

 // Funciones de manejo del modal
 function openModal() {
   document.getElementById("success-modal").style.display = "block";
   // Configurar un temporizador para limpiar el formulario después de 10 segundos
   setTimeout(resetForm, 10000);
 }

 function closeModal() {
   document.getElementById("success-modal").style.display = "none";
 }

 // Función para resetear el formulario
 function resetForm() {
   document.getElementById("personality-form").reset();
   document.getElementById("results").style.display = "none";
   document.getElementById("error-message").style.display = "none";
   for (let i = 1; i <= 30; i++) {
     document.getElementById(`question-${i}`).classList.remove("invalid");
   }
 }

 const dimensiones = [
   "Sociabilidad y Relaciones Interpersonales", 
   "Estabilidad Emocional y Gestión",
   "Apertura y Flexibilidad",
   "Motivación y Enfoque",
   "Valores y Ética",
   "Cognición y Percepción"
 ];
 
 const container = document.getElementById("questions-container");
 let currentSection = 0;
 
 const questions = [
   // 1-5: Sociabilidad y Relaciones Interpersonales
   "Prefiero entornos sociales activos antes que estar solo/a.",
   "Puedo identificar fácilmente cómo se sienten los demás, incluso cuando no lo expresan verbalmente.",
   "Expreso mis opiniones y necesidades de manera directa pero respetuosa.",
   "Disfruto más trabajando en equipo que de manera individual.",
   "Me resulta sencillo iniciar conversaciones con personas que acabo de conocer.",
   
   // 6-10: Estabilidad Emocional y Gestión
   "Cuando enfrento un fracaso, logro recuperarme rápidamente y seguir adelante.",
   "Puedo mantener la calma y controlar mis reacciones incluso cuando estoy muy enojado/a o frustrado/a.",
   "Los períodos de alta presión o estrés no suelen afectar significativamente mi desempeño.",
   "Ante los problemas, tiendo a centrarme en encontrar soluciones en lugar de preocuparme por lo que podría salir mal.",
   "Rara vez necesito la confirmación o aprobación de otros para sentirme seguro/a de mis decisiones.",
   
   // 11-15: Apertura y Flexibilidad
   "Me interesan formas de arte, ideas o culturas diferentes a las que estoy acostumbrado/a.",
   "A menudo propongo ideas originales o enfoques innovadores para resolver problemas.",
   "Puedo cambiar fácilmente de opinión cuando me presentan evidencia o perspectivas convincentes.",
   "Prefiero probar nuevas formas de hacer las cosas antes que seguir métodos tradicionales.",
   "Disfruto explorando conceptos abstractos o teóricos.",
   
   // 16-20: Motivación y Enfoque
   "Me fijo regularmente metas ambiciosas que me exigen superarme.",
   "Cuando inicio un proyecto, suelo continuarlo hasta completarlo incluso si encuentro dificultades.",
   "Presto especial atención a los pequeños detalles en mis actividades.",
   "Me atraen las actividades que implican cierto nivel de riesgo o emoción.",
   "Prefiero tener un plan estructurado antes de comenzar cualquier tarea importante.",
   
   // 21-25: Valores y Ética
   "Mantengo mis principios incluso cuando hacerlo puede resultarme inconveniente.",
   "A menudo pongo las necesidades de los demás por encima de mis propios deseos.",
   "Valoro más el éxito personal que el reconocimiento grupal.",
   "Considero que cada persona debería resolver sus propios problemas sin depender demasiado de los demás.",
   "Las normas sociales deberían respetarse incluso cuando limitan la libertad individual.",
   
   // 26-30: Cognición y Percepción
   "Suelo cuestionar la información que recibo antes de aceptarla como verdadera.",
   "Tengo una comprensión clara de mis fortalezas y debilidades personales.",
   "Me frustro cuando las cosas no salen perfectas según mis estándares.",
   "Prefiero tener una visión general de las situaciones antes que conocer todos los detalles.",
   "Acepto fácilmente mis errores y los veo como oportunidades para aprender."
 ];

 questions.forEach((q, i) => {
   if (i % 5 === 0) {
     container.innerHTML += `<h2>${dimensiones[currentSection++]}</h2>`;
   }
   const num = i + 1;
   container.innerHTML += `
     <div class="question" id="question-${num}">
       <p><strong>${num}.</strong> ${q}</p>
       <div class="options">
         ${[1, 2, 3, 4, 5].map(val => `<label><input type="radio" name="q${num}" value="${val}"> ${val}. ${['Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo'][val - 1]}</label>`).join('')}
       </div>
     </div>`;
 });

 const interpretDimension = (score, dimension) => {
   // Valor mínimo: 5 (5 preguntas * 1 punto mínimo)
   // Valor máximo: 25 (5 preguntas * 5 puntos máximos)
   const percentage = ((score - 5) / 20) * 100;
   
   if (percentage < 33) {
     switch(dimension) {
       case "sociability": return "Tendencia a la introversión y autonomía social. Prefieres ambientes tranquilos y tienes un círculo social reducido pero de confianza.";
       case "stability": return "Posible sensibilidad emocional y respuesta intensa a estresores. Puedes beneficiarte de desarrollar más herramientas de gestión emocional.";
       case "openness": return "Preferencia por lo familiar y convencional. Tiendes a sentirte más cómodo/a con métodos probados y rutinas establecidas.";
       case "motivation": return "Enfoque relajado hacia metas y preferencia por lo espontáneo. Valoras más el proceso que los resultados específicos.";
       case "values": return "Mayor orientación individualista. Priorizas tus propias necesidades y objetivos personales sobre las consideraciones grupales.";
       case "cognition": return "Enfoque más intuitivo y aceptación de imperfecciones. Confías en tus primeras impresiones y no tiendes a la sobrecrítica.";
     }
   } else if (percentage < 67) {
     switch(dimension) {
       case "sociability": return "Balance entre socialización y momentos de soledad. Disfrutas de la interacción social pero también valoras tu espacio personal.";
       case "stability": return "Equilibrio emocional moderado. Generalmente manejas bien tus emociones, aunque situaciones de alta presión pueden afectarte.";
       case "openness": return "Equilibrio entre tradición e innovación. Aprecias lo establecido pero estás abierto/a a explorar nuevas ideas cuando es necesario.";
       case "motivation": return "Motivación moderada y equilibrio entre estructura y flexibilidad. Estableces metas alcanzables y trabajas consistentemente hacia ellas.";
       case "values": return "Balance entre valores individuales y colectivos. Consideras tanto tus necesidades como las del grupo en tus decisiones.";
       case "cognition": return "Balance entre análisis crítico y aceptación. Evalúas la información pero evitas el excesivo escepticismo o perfeccionismo.";
     }
   } else {
     switch(dimension) {
       case "sociability": return "Alta sociabilidad y orientación interpersonal. Buscas activamente la interacción y estableces conexiones con facilidad.";
       case "stability": return "Alta estabilidad y resiliencia emocional. Manejas bien la presión y recuperas rápidamente el equilibrio tras situaciones adversas.";
       case "openness": return "Alta apertura a nuevas experiencias y flexibilidad. Buscas activamente la innovación y disfrutas explorando lo desconocido.";
       case "motivation": return "Alta orientación a objetivos y persistencia. Estableces metas ambiciosas y muestras gran determinación para alcanzarlas.";
       case "values": return "Fuerte orientación hacia principios morales y consideración grupal. Priorizas el bienestar colectivo y actúas según firmes valores éticos.";
       case "cognition": return "Alto escepticismo y tendencias analíticas. Examinas críticamente la información y buscas la comprensión profunda de las situaciones.";
     }
   }
 };

 const createSummary = (scores) => {
   const dimensions = [
     { name: "sociabilidad y relaciones interpersonales", score: scores.sociability },
     { name: "estabilidad emocional", score: scores.stability },
     { name: "apertura a la experiencia", score: scores.openness },
     { name: "motivación y enfoque", score: scores.motivation },
     { name: "valores y ética", score: scores.values },
     { name: "cognición y percepción", score: scores.cognition }
   ];
   
   // Ordenar dimensiones de mayor a menor puntuación
   dimensions.sort((a, b) => b.score - a.score);
   
   // Identificar puntos fuertes (2 primeros) y áreas de desarrollo (2 últimos)
   const strengths = dimensions.slice(0, 2);
   const improvements = dimensions.slice(-2);
   
   return `
     Tu perfil de personalidad muestra fortalezas notables en ${strengths[0].name} (${strengths[0].score}) y ${strengths[1].name} (${strengths[1].score}). 
     Estas características destacadas conforman aspectos centrales de tu forma de ser y relacionarte con el mundo.
     
     Las áreas que podrías desarrollar más son ${improvements[0].name} (${improvements[0].score}) y ${improvements[1].name} (${improvements[1].score}).
     
     En general, tu perfil muestra un patrón de personalidad ${getOverallPattern(scores)}.
   `;
 };
 
 const getOverallPattern = (scores) => {
   const avg = (scores.sociability + scores.stability + scores.openness + scores.motivation + scores.values + scores.cognition) / 6;
   
   if (avg < 10) return "con tendencia hacia la introversión, cautela y enfoque tradicional";
   if (avg < 15) return "equilibrado, con capacidad de adaptación según las circunstancias";
   if (avg < 20) return "dinámico y orientado a la acción, con buena capacidad social y de resolución";
   return "muy activo, extrovertido y con alta orientación al logro";
 };

 document.getElementById("calculate-btn").addEventListener("click", () => {
   const name = document.getElementById("participant-name").value.trim();
   const gender = document.querySelector('input[name="gender"]:checked')?.value;
   const errorMsg = document.getElementById("error-message");
   const answers = [], unanswered = [];

   for (let i = 1; i <= 30; i++) {
     const val = document.querySelector(`input[name='q${i}']:checked`);
     const div = document.getElementById(`question-${i}`);
     if (!val) {
       unanswered.push(i);
       div.classList.add("invalid");
     } else {
       answers.push(Number(val.value));
       div.classList.remove("invalid");
     }
   }

   if (!name || !gender || unanswered.length > 0) {
     errorMsg.textContent = !name ? "Ingrese su nombre." : !gender ? "Seleccione su género." : `Faltan preguntas: ${unanswered.join(', ')}`;
     errorMsg.style.display = "block";
     return;
   }
   errorMsg.style.display = "none";

   const sum = (start, end) => answers.slice(start, end).reduce((a, b) => a + b, 0);
   
   const sociability = sum(0, 5);
   const stability = sum(5, 10);
   const openness = sum(10, 15);
   const motivation = sum(15, 20);
   const values = sum(20, 25);
   const cognition = sum(25, 30);
   
   // Calcular porcentajes para barras de progreso (5-25 es el rango posible)
   const calculatePercentage = (score) => ((score - 5) / 20) * 100;
   
   document.getElementById("display-name").textContent = name;
   
   document.getElementById("score-sociability").textContent = sociability;
   document.getElementById("desc-sociability").textContent = interpretDimension(sociability, "sociability");
   document.getElementById("progress-sociability").style.width = `${calculatePercentage(sociability)}%`;
   document.getElementById("progress-sociability").textContent = `${Math.round(calculatePercentage(sociability))}%`;
   
   document.getElementById("score-stability").textContent = stability;
   document.getElementById("desc-stability").textContent = interpretDimension(stability, "stability");
   document.getElementById("progress-stability").style.width = `${calculatePercentage(stability)}%`;
   document.getElementById("progress-stability").textContent = `${Math.round(calculatePercentage(stability))}%`;
   
   document.getElementById("score-openness").textContent = openness;
   document.getElementById("desc-openness").textContent = interpretDimension(openness, "openness");
   document.getElementById("progress-openness").style.width = `${calculatePercentage(openness)}%`;
   document.getElementById("progress-openness").textContent = `${Math.round(calculatePercentage(openness))}%`;
   
   document.getElementById("score-motivation").textContent = motivation;
   document.getElementById("desc-motivation").textContent = interpretDimension(motivation, "motivation");
   document.getElementById("progress-motivation").style.width = `${calculatePercentage(motivation)}%`;
   document.getElementById("progress-motivation").textContent = `${Math.round(calculatePercentage(motivation))}%`;
   
   document.getElementById("score-values").textContent = values;
   document.getElementById("desc-values").textContent = interpretDimension(values, "values");
   document.getElementById("progress-values").style.width = `${calculatePercentage(values)}%`;
   document.getElementById("progress-values").textContent = `${Math.round(calculatePercentage(values))}%`;
   
   document.getElementById("score-cognition").textContent = cognition;
   document.getElementById("desc-cognition").textContent = interpretDimension(cognition, "cognition");
   document.getElementById("progress-cognition").style.width = `${calculatePercentage(cognition)}%`;
   document.getElementById("progress-cognition").textContent = `${Math.round(calculatePercentage(cognition))}%`;
   
   // Crear resumen personalizado
   const scores = { sociability, stability, openness, motivation, values, cognition };
   document.getElementById("personality-summary").textContent = createSummary(scores);

   document.getElementById("results").style.display = "block";

   // Guardar en Supabase
   supabaseClient
   .from('resultados_personalidad')
   .insert([{
     nombre: name,
     genero: gender,
     sociabilidad: sociability,
     sociabilidad_interpretation: interpretDimension(sociability, "sociability"),
     estabilidad: stability,
     estabilidad_interpretation: interpretDimension(stability, "stability"),
     apertura: openness,
     apertura_interpretation: interpretDimension(openness, "openness"),
     motivacion: motivation,
     motivacion_interpretation: interpretDimension(motivation, "motivation"),
     valores: values,
     valores_interpretation: interpretDimension(values, "values"),
     cognicion: cognition,
     cognicion_interpretation: interpretDimension(cognition, "cognition")
   }])
     .then(response => {
       if (response.error) {
         console.error('Error al guardar en Supabase:', response.error);
              // Mostrar mensaje de error al usuario
         errorMsg.textContent = `Error al guardar: ${response.error.message}`;
         errorMsg.style.display = "block";
       } else {
         console.log('Resultado guardado en Supabase.');
         // Mostrar el modal de éxito
         openModal();
       }
     });
    //  .catch(err => {
    //   console.error('Error de conexión:', err);
    //   errorMsg.textContent = "Error de conexión con la base de datos.";
    //   errorMsg.style.display = "block";
 });

 document.getElementById("download-pdf").addEventListener("click", () => {
   const doc = new window.jspdf.jsPDF();
   doc.text("Test de Factores de Personalidad - Resultados", 20, 20);
   doc.text(`Nombre: ${document.getElementById("participant-name").value}`, 20, 30);
   
   const sociability = document.getElementById("score-sociability").textContent;
   const stability = document.getElementById("score-stability").textContent;
   const openness = document.getElementById("score-openness").textContent;
   const motivation = document.getElementById("score-motivation").textContent;
   const values = document.getElementById("score-values").textContent;
   const cognition = document.getElementById("score-cognition").textContent;
   
   doc.text(`1. Sociabilidad: ${sociability} - ${document.getElementById("desc-sociability").textContent.substring(0, 60)}...`, 20, 45);
   doc.text(`2. Estabilidad Emocional: ${stability} - ${document.getElementById("desc-stability").textContent.substring(0, 60)}...`, 20, 55);
   doc.text(`3. Apertura: ${openness} - ${document.getElementById("desc-openness").textContent.substring(0, 60)}...`, 20, 65);
   doc.text(`4. Motivación: ${motivation} - ${document.getElementById("desc-motivation").textContent.substring(0, 60)}...`, 20, 75);
   doc.text(`5. Valores: ${values} - ${document.getElementById("desc-values").textContent.substring(0, 60)}...`, 20, 85);
   doc.text(`6. Cognición: ${cognition} - ${document.getElementById("desc-cognition").textContent.substring(0, 60)}...`, 20, 95);
   
   doc.text("Resumen del Perfil:", 20, 110);
   const summary = document.getElementById("personality-summary").textContent;
   const splitSummary = doc.splitTextToSize(summary, 170);
   doc.text(splitSummary, 20, 120);
   
   doc.save("Resultados_Test_Personalidad.pdf");
     });

     document.getElementById("download-excel").addEventListener("click", () => {
   const wb = XLSX.utils.book_new();
   const ws = XLSX.utils.aoa_to_sheet([
     ["Nombre", document.getElementById("participant-name").value],
     ["Dimensión", "Puntuación", "Interpretación"],
     ["Sociabilidad y Relaciones Interpersonales", document.getElementById("score-sociability").textContent, document.getElementById("desc-sociability").textContent],
     ["Estabilidad Emocional y Gestión", document.getElementById("score-stability").textContent, document.getElementById("desc-stability").textContent],
     ["Apertura y Flexibilidad", document.getElementById("score-openness").textContent, document.getElementById("desc-openness").textContent],
     ["Motivación y Enfoque", document.getElementById("score-motivation").textContent, document.getElementById("desc-motivation").textContent],
     ["Valores y Ética", document.getElementById("score-values").textContent, document.getElementById("desc-values").textContent],
     ["Cognición y Percepción", document.getElementById("score-cognition").textContent, document.getElementById("desc-cognition").textContent]
   ]);
   XLSX.utils.book_append_sheet(wb, ws, "Resultados");
   XLSX.writeFile(wb, "Resultados_Test_Personalidad.xlsx");
     });
 document.getElementById("reset-form-btn").addEventListener("click", resetForm);
 document.getElementById("show-results-btn").addEventListener("click", async () => {
   const { data, error } = await supabaseClient
     .from('resultados_personalidad')
     .select('*');
   
   if (error) {
     console.error('Error al obtener resultados:', error);
     return;
   }
   
   const resultsTableBody = document.getElementById("results-table-body");
   resultsTableBody.innerHTML = "";
   
   data.forEach(result => {
    const row = `<tr>
      <td>${result.nombre}</td>
      <td>${result.genero}</td>
      <td>${result.sociabilidad}</td>
      <td class="interpretation-col" title="${result.sociabilidad_interpretation || ''}">${result.sociabilidad_interpretation ? result.sociabilidad_interpretation.substring(0, 30) + '...' : ''}</td>
      <td>${result.estabilidad}</td>
      <td class="interpretation-col" title="${result.estabilidad_interpretation || ''}">${result.estabilidad_interpretation ? result.estabilidad_interpretation.substring(0, 30) + '...' : ''}</td>
      <td>${result.apertura}</td>
      <td class="interpretation-col" title="${result.apertura_interpretation || ''}">${result.apertura_interpretation ? result.apertura_interpretation.substring(0, 30) + '...' : ''}</td>
      <td>${result.motivacion}</td>
      <td class="interpretation-col" title="${result.motivacion_interpretation || ''}">${result.motivacion_interpretation ? result.motivacion_interpretation.substring(0, 30) + '...' : ''}</td>
      <td>${result.valores}</td>
      <td class="interpretation-col" title="${result.valores_interpretation || ''}">${result.valores_interpretation ? result.valores_interpretation.substring(0, 30) + '...' : ''}</td>
      <td>${result.cognicion}</td>
      <td class="interpretation-col" title="${result.cognicion_interpretation || ''}">${result.cognicion_interpretation ? result.cognicion_interpretation.substring(0, 30) + '...' : ''}</td>
    </tr>`;
    resultsTableBody.innerHTML += row;
  });
   
   document.getElementById("stored-results").style.display = "block";
 });
 // Inicializar el formulario
 resetForm();