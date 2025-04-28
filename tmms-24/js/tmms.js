   // Configuración de Supabase
   const { createClient } = supabase;
   const supabaseUrl = 'https://eijeaimjxaywhohceqfc.supabase.co';
   const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpamVhaW1qeGF5d2hvaGNlcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxODg5NzEsImV4cCI6MjA2MDc2NDk3MX0.zyknNW6-uI0UtKhWIMVR-7K1EU5u_EYtpfsr8wgx7Mk';
   const supabaseClient = createClient(supabaseUrl, supabaseKey);

   // Funciones de manejo del modal
   function openModal() {
     document.getElementById("success-modal").style.display = "block";
     // Configurar un temporizador para limpiar el formulario después de 30 segundos
     setTimeout(resetForm, 10000);
   }

   function closeModal() {
     document.getElementById("success-modal").style.display = "none";
   }

   // Función para resetear el formulario
   function resetForm() {
     document.getElementById("tmms-form").reset();
     document.getElementById("results").style.display = "none";
     document.getElementById("error-message").style.display = "none";
     for (let i = 1; i <= 24; i++) {
       document.getElementById(`question-${i}`).classList.remove("invalid");
     }
   }

   const niveles = [
     "Percepción Emocional", "Comprensión de Sentimientos", "Regulación Emocional"
   ];
   const container = document.getElementById("questions-container");
   let currentSection = 0;
   const questions = [
     // 1-8: Percepción
     "Presto mucha atención a los sentimientos.",
     "Normalmente me preocupo mucho por lo que siento.",
     "Normalmente dedico tiempo a pensar en mis emociones.",
     "Pienso que merece la pena prestar atención a mis emociones y estado de ánimo.",
     "Dejo que mis sentimientos afecten a mis pensamientos.",
     "Pienso en mi estado de ánimo constantemente.",
     "A menudo pienso en mis sentimientos.",
     "Presto mucha atención a cómo me siento.",
     // 9-16: Comprensión
     "Tengo claros mis sentimientos.",
     "Frecuentemente puedo definir mis sentimientos.",
     "Casi siempre sé cómo me siento.",
     "Normalmente conozco mis sentimientos sobre las personas.",
     "A menudo me doy cuenta de mis sentimientos en diferentes situaciones.",
     "Siempre puedo decir cómo me siento.",
     "A veces puedo decir cuáles son mis emociones.",
     "Puedo llegar a comprender mis sentimientos.",
     // 17-24: Regulación
     "Aunque a veces me siento triste, suelo tener una visión optimista.",
     "Aunque me sienta mal, procuro pensar en cosas agradables.",
     "Cuando estoy triste, pienso en todos los placeres de la vida.",
     "Intento tener pensamientos positivos aunque me sienta mal.",
     "Si doy demasiadas vueltas a las cosas, complicándolas, trato de calmarme.",
     "Me preocupo por tener un buen estado de ánimo.",
     "Tengo mucha energía cuando me siento feliz.",
     "Cuando estoy enfadado intento cambiar mi estado de ánimo."
   ];

   questions.forEach((q, i) => {
     if (i % 8 === 0) {
       container.innerHTML += `<h2>${niveles[currentSection++]}</h2>`;
     }
     const num = i + 1;
     container.innerHTML += `
       <div class="question" id="question-${num}">
         <p><strong>${num}.</strong> ${q}</p>
         <div class="options">
           ${[1, 2, 3, 4, 5].map(val => `<label><input type="radio" name="q${num}" value="${val}"> ${val}. ${['Nada de acuerdo', 'Algo de acuerdo', 'Bastante de acuerdo', 'Muy de acuerdo', 'Totalmente de acuerdo'][val - 1]}</label>`).join('')}
         </div>
       </div>`;
   });

   const interpret = (score, gender, type) => {
     const male = gender === 'male';
     const ranges = {
       percepcion: male ? [21, 33] : [24, 36],
       comprension: male ? [25, 36] : [23, 35],
       regulacion: [23, male ? 36 : 35]
     }[type];

     if (score < ranges[0]) return "Debe mejorar";
     if (score > ranges[1]) return "Excelente";
     return "Adecuada";
   };

   document.getElementById("calculate-btn").addEventListener("click", () => {
     const name = document.getElementById("participant-name").value.trim();
     const gender = document.querySelector('input[name="gender"]:checked')?.value;
     const errorMsg = document.getElementById("error-message");
     const answers = [], unanswered = [];

     for (let i = 1; i <= 24; i++) {
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
     const percep = sum(0, 8), compr = sum(8, 16), regul = sum(16, 24);

     document.getElementById("display-name").textContent = name;
     document.getElementById("score-perception").textContent = percep;
     document.getElementById("desc-perception").textContent = interpret(percep, gender, "percepcion");
     document.getElementById("score-understanding").textContent = compr;
     document.getElementById("desc-understanding").textContent = interpret(compr, gender, "comprension");
     document.getElementById("score-regulation").textContent = regul;
     document.getElementById("desc-regulation").textContent = interpret(regul, gender, "regulacion");

     document.getElementById("results").style.display = "block";

     // Guardar en Supabase
     supabaseClient
       .from('resultados_tmms')
       .insert([{
         nombre: name,
         genero: gender,
         percepcion: percep,
         evaluacion_percepcion: interpret(percep, gender, "percepcion"),
         comprension: compr,
         evaluacion_comprension: interpret(compr, gender, "comprension"),
         regulacion: regul,
         evaluacion_regulacion: interpret(regul, gender, "regulacion")
       }])
       .then(response => {
         if (response.error) {
           console.error('Error al guardar en Supabase:', response.error);
         } else {
           console.log('Resultado guardado en Supabase.');
           // Mostrar el modal de éxito
           openModal();
         }
       });
   });

   document.getElementById("download-pdf").addEventListener("click", () => {
     const doc = new window.jspdf.jsPDF();
     doc.text("Resultados TMMS-24", 20, 20);
     doc.text(`Nombre: ${document.getElementById("participant-name").value}`, 20, 30);
     doc.text(`Percepción: ${document.getElementById("score-perception").textContent} - ${document.getElementById("desc-perception").textContent}`, 20, 50);
     doc.text(`Comprensión: ${document.getElementById("score-understanding").textContent} - ${document.getElementById("desc-understanding").textContent}`, 20, 60);
     doc.text(`Regulación: ${document.getElementById("score-regulation").textContent} - ${document.getElementById("desc-regulation").textContent}`, 20, 70);
     doc.save("Resultados_TMMS24.pdf");
   });

   document.getElementById("download-excel").addEventListener("click", () => {
     const wb = XLSX.utils.book_new();
     const ws = XLSX.utils.aoa_to_sheet([
       ["Nombre", document.getElementById("participant-name").value],
       ["Categoria", "Puntuación", "Evaluación"],
       ["Percepción Emocional", document.getElementById("score-perception").textContent, document.getElementById("desc-perception").textContent],
       ["Comprensión de Sentimientos", document.getElementById("score-understanding").textContent, document.getElementById("desc-understanding").textContent],
       ["Regulación Emocional", document.getElementById("score-regulation").textContent, document.getElementById("desc-regulation").textContent]
     ]);
     XLSX.utils.book_append_sheet(wb, ws, "Resultados");
     XLSX.writeFile(wb, "Resultados_TMMS24.xlsx");
   });

   // Evento para el botón de resetear formulario
   document.getElementById("reset-form-btn").addEventListener("click", resetForm);

    document.getElementById("show-results-btn").addEventListener("click", async () => {
  const { data, error } = await supabaseClient.from('resultados_tmms').select('*');
 
  
 if (error) {
   console.error("Error al obtener resultados:", error);
   alert("No se pudieron obtener los resultados.");
   return;
 }

 const tableBody = document.getElementById("results-table-body");
 tableBody.innerHTML = ''; // Limpiar tabla

 data.forEach(row => {
   const tr = document.createElement("tr");
   tr.innerHTML = `
     <td>${row.nombre}</td>
     <td>${row.genero === 'male' ? 'Hombre' : 'Mujer'}</td>
     <td>${row.percepcion}</td>
     <td>${row.evaluacion_percepcion}</td>
     <td>${row.comprension}</td>
     <td>${row.evaluacion_comprension}</td>
     <td>${row.regulacion}</td>
     <td>${row.evaluacion_regulacion}</td>
   `;
   tableBody.appendChild(tr);
 });

 document.getElementById("stored-results").style.display = "block";
});
document.getElementById('show-graph-btn').addEventListener('click', function () {
  window.location.href = '../graficas/index.html';
});
