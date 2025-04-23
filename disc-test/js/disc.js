  // Configuración de Supabase
  const { createClient } = supabase;
  const supabaseUrl = 'https://eijeaimjxaywhohceqfc.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpamVhaW1qeGF5d2hvaGNlcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxODg5NzEsImV4cCI6MjA2MDc2NDk3MX0.zyknNW6-uI0UtKhWIMVR-7K1EU5u_EYtpfsr8wgx7Mk';
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  // Variable global para almacenar los resultados más recientes
  let lastResults = { D: 0, I: 0, S: 0, C: 0 };

  // Funciones de manejo del modal
  function openModal() {
    document.getElementById("success-modal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("success-modal").style.display = "none";
  }

  // Función para resetear el formulario
  function resetForm() {
    document.getElementById("disc-form").reset();
    document.getElementById("results").style.display = "none";
    document.getElementById("error-message").style.display = "none";

    // Limpiar selecciones de preguntas
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => {
      q.classList.remove("invalid");
      const moreInputs = q.querySelectorAll('input[name$="-more"]');
      const lessInputs = q.querySelectorAll('input[name$="-less"]');
      moreInputs.forEach(input => input.checked = false);
      lessInputs.forEach(input => input.checked = false);
    });
  }

  // Preguntas del test DISC (28 grupos de 4 afirmaciones cada uno)
  const discQuestions = [
    // Grupo 1
    [
      "Las personas me respetan.",
      "Tiendo a ser una persona amable.",
      "Acepto a la vida como viene.",
      "Las personas dicen que tengo una fuerte personalidad."
    ],
    // Grupo 2
    [
      "Encuentro difícil relajarme.",
      "Tengo un círculo muy amplio de amigos.",
      "Siempre estoy listo para ayudar a otros.",
      "Me gusta comportarme correctamente."
    ],
    // Grupo 3
    [
      "Tiendo a hacer lo que se me pide.",
      "Me gustan que las cosas estén limpias y ordenadas.",
      "Las personas no pueden rebajarme.",
      "Disfruto haciendo cosas divertidas."
    ],
    // Grupo 4
    [
      "Respeto a mis mayores y a aquellas personas en autoridad.",
      "Siempre estoy dispuesto a tomar riesgos.",
      "Creo que las cosas resultarán bien.",
      "Siempre estoy dispuesto a ayudar."
    ],
    // Grupo 5
    [
      "Soy una persona limpia y ordenada.",
      "Soy muy activo, tanto en el trabajo como en mis pasatiempos.",
      "Soy una persona tranquila y calmada.",
      "Generalmente hago las cosas a mi manera."
    ],
    // Grupo 6
    [
      "Estoy contento con la vida.",
      "Confío en las personas.",
      "Me gusta la tranquilidad y el silencio.",
      "Tengo una actitud muy positiva."
    ],
    // Grupo 7
    [
      "Tengo mucha fuerza de voluntad.",
      "Siempre pongo atención a lo que dicen los demás.",
      "Trato de ser servicial.",
      "Estoy siempre contento."
    ],
    // Grupo 8
    [
      "Soy seguro de mí mismo.",
      "Las personas dicen que soy una persona comprensiva.",
      "Tengo una actitud tolerante hacia la vida.",
      "Expreso mis opiniones con seguridad."
    ],
    // Grupo 9
    [
      "Nunca pierdo mi temperamento.",
      "Me gusta que las cosas sean precisas y correctas.",
      "Soy una persona muy segura de mí misma.",
      "Disfruto de las bromas y chistes."
    ],
    // Grupo 10
    [
      "Mi comportamiento es bien disciplinado.",
      "Las personas me ven como alguien amable.",
      "Estoy siempre en movimiento.",
      "Persevero hasta que consigo lo que quiero."
    ],
    // Grupo 11
    [
      "Disfruto competir.",
      "No me tomo la vida muy seriamente.",
      "Siempre considero a los demás.",
      "Soy una persona simpática."
    ],
    // Grupo 12
    [
      "Soy muy persuasivo.",
      "Me veo a mí mismo como una persona calmada.",
      "Tengo una actitud de modestia.",
      "Usualmente se me ocurren ideas originales."
    ],
    // Grupo 13
    [
      "Me gusta mucho ayudar a otros.",
      "No me gusta tentar al destino.",
      "No me rindo fácilmente.",
      "Las personas disfrutan mi compañía."
    ],
    // Grupo 14
    [
      "Tiendo a ser una persona precavida.",
      "Soy una persona muy decidida.",
      "Soy bueno convenciendo a los demás.",
      "Usualmente soy una persona amigable."
    ],
    // Grupo 15
    [
      "No me asusto fácilmente.",
      "Las personas encuentran mi compañía estimulante.",
      "Siempre estoy dispuesto a seguir órdenes.",
      "Soy más bien una persona tímida."
    ],
    // Grupo 16
    [
      "Siempre estoy dispuesto a cambiar mis opiniones.",
      "Disfruto de una buena discusión.",
      "Soy una persona fácil de llevar.",
      "Siempre miro el lado positivo de la vida."
    ],
    // Grupo 17
    [
      "Soy una persona muy sociable.",
      "Tengo bastante paciencia.",
      "Soy del tipo de personas auto-suficiente.",
      "Raramente alzo mi voz."
    ],
    // Grupo 18
    [
      "Siempre estoy listo y dispuesto.",
      "Siempre estoy ansioso de probar cosas nuevas.",
      "No me gustan las discusiones.",
      "Las personas me describen de espíritu alegre."
    ],
    // Grupo 19
    [
      "Disfruto asumiendo un riesgo.",
      "Soy muy receptivo con las ideas de los demás.",
      "Siempre soy cortés y educado.",
      "Soy más bien una persona moderada que extrema."
    ],
    // Grupo 20
    [
      "Soy un persona mas bien indulgente.",
      "Soy una persona sensible.",
      "Tengo mucha energía y vigor.",
      "Me puedo mezclar en cualquier ambiente."
    ],
    // Grupo 21
    [
      "Disfruto conversando con las personas.",
      "Controlo mis emociones.",
      "Soy muy convencional en mi apariencia.",
      "Tomo decisiones rápidamente."
    ],
    // Grupo 22
    [
      "Tiendo a guardar mis emociones para mí mismo.",
      "La precisión es muy importante para mí.",
      "Me gusta decir lo que se me viene a la cabeza.",
      "Soy muy amigable."
    ],
    // Grupo 23
    [
      "Me gusta manejar las cosas con diplomacia.",
      "Soy una persona muy osada.",
      "A la mayoría de la personas les caigo bien.",
      "Me siento satisfecho con la vida."
    ],
    // Grupo 24
    [
      "Soy una persona obediente.",
      "Siempre estoy dispuesto a intentarlo.",
      "Lealtad es una de mis fortalezas.",
      "Soy una persona atractiva para los demás."
    ],
    // Grupo 25
    [
      "Tiendo a ser del tipo de persona más bien agresiva.",
      "Me gusta divertirme y tengo mucha personalidad.",
      "Las personas me ven como alguien fácil de conmover.",
      "Soy más bien una persona tímida."
    ],
    // Grupo 26
    [
      "Soy bueno motivando a los demás.",
      "Paciencia es una de mis mayores fortalezas.",
      "Soy cuidadoso en decir la frase correcta.",
      "Tengo un fuerte deseo de ganar."
    ],
    // Grupo 27
    [
      "Soy una persona fácil de llevar.",
      "Me da bastante satisfacción ayudar a otros.",
      "Siempre pienso las cosas muy bien.",
      "Prefiero hacer las cosas ahora que después."
    ],
    // Grupo 28
    [
      "Soy bueno analizando situaciones.",
      "Me vuelvo inquieto fácilmente.",
      "Pienso cómo mis decisiones pueden afectar a otros.",
      "Las personas me ven como relajado y fácil de tratar."
    ]
  ];

  // Mapeo de preguntas a rasgos DISC (D, I, S, C)
  const questionTraits = [
    // Grupo 1
    ["D", "I", "S", "D"],
    // Grupo 2
    ["D", "I", "S", "C"],
    // Grupo 3
    ["S", "C", "D", "I"],
    // Grupo 4
    ["C", "D", "I", "S"],
    // Grupo 5
    ["C", "D", "S", "D"],
    // Grupo 6
    ["S", "I", "S", "I"],
    // Grupo 7
    ["D", "I", "S", "I"],
    // Grupo 8
    ["D", "I", "S", "D"],
    // Grupo 9
    ["S", "C", "D", "I"],
    // Grupo 10
    ["C", "I", "D", "D"],
    // Grupo 11
    ["D", "I", "S", "I"],
    // Grupo 12
    ["D", "S", "C", "I"],
    // Grupo 13
    ["S", "C", "D", "I"],
    // Grupo 14
    ["C", "D", "I", "I"],
    // Grupo 15
    ["D", "I", "S", "S"],
    // Grupo 16
    ["S", "D", "S", "I"],
    // Grupo 17
    ["I", "S", "D", "S"],
    // Grupo 18
    ["S", "D", "S", "I"],
    // Grupo 19
    ["D", "I", "C", "S"],
    // Grupo 20
    ["S", "I", "D", "I"],
    // Grupo 21
    ["I", "C", "C", "D"],
    // Grupo 22
    ["S", "C", "D", "I"],
    // Grupo 23
    ["C", "D", "I", "S"],
    // Grupo 24
    ["S", "D", "S", "I"],
    // Grupo 25
    ["D", "I", "S", "S"],
    // Grupo 26
    ["I", "S", "C", "D"],
    // Grupo 27
    ["S", "I", "C", "D"],
    // Grupo 28
    ["C", "D", "S", "S"]
  ];

  // Generar las preguntas en el formulario
  const container = document.getElementById("questions-container");
  discQuestions.forEach((group, groupIndex) => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "question-group";
    groupDiv.innerHTML = `<h3>Grupo ${groupIndex + 1}</h3><p>Seleccione la afirmación que MÁS y MENOS se aplica a usted:</p>`;

    group.forEach((question, questionIndex) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question";
      questionDiv.id = `question-${groupIndex + 1}-${questionIndex + 1}`;

      // Cambio de orden: primero el texto de la pregunta, luego los botones
      questionDiv.innerHTML = `
         <div class="question-text">${question}</div>
        <div class="options">
          <label>
            <input type="radio" name="group-${groupIndex + 1}-more" value="${questionTraits[groupIndex][questionIndex]}" data-question="${questionIndex}">
            MÁS me aplica
          </label>
          <label>
            <input type="radio" name="group-${groupIndex + 1}-less" value="${questionTraits[groupIndex][questionIndex]}" data-question="${questionIndex}">
            MENOS me aplica
          </label>
        </div>
      `;
      groupDiv.appendChild(questionDiv);
    });

    container.appendChild(groupDiv);
  });

  // Función para calcular los resultados
  document.getElementById("calculate-btn").addEventListener("click", async () => {
    // generateGraphBars(results);
    const name = document.getElementById("participant-name").value.trim();
    const errorMsg = document.getElementById("error-message");
    const results = { D: 0, I: 0, S: 0, C: 0 };
    let incompleteGroups = [];

    // Verificar que se hayan respondido todos los grupos
    for (let i = 1; i <= 28; i++) {
      const moreSelected = document.querySelector(`input[name="group-${i}-more"]:checked`);
      const lessSelected = document.querySelector(`input[name="group-${i}-less"]:checked`);

      if (!moreSelected || !lessSelected) {
        incompleteGroups.push(i);
        // Resaltar grupo incompleto
        const groupDivs = document.querySelectorAll(`[id^="question-${i}-"]`);
        groupDivs.forEach(div => div.classList.add("invalid"));
      } else {
        // Quitar resaltado si estaba marcado como inválido
        const groupDivs = document.querySelectorAll(`[id^="question-${i}-"]`);
        groupDivs.forEach(div => div.classList.remove("invalid"));

        // Sumar puntos para MÁS seleccionado
        results[moreSelected.value]++;

        // Restar puntos para MENOS seleccionado
        results[lessSelected.value]--;
      }
    }

    if (!name || incompleteGroups.length > 0) {
      errorMsg.textContent = !name ? "Ingrese su nombre." : `Faltan selecciones en los grupos: ${incompleteGroups.join(', ')}`;
      errorMsg.style.display = "block";
      return;
    }
    errorMsg.style.display = "none";

    // Normalizar resultados (asegurar que no sean negativos)
    const minScore = Math.min(...Object.values(results));
    if (minScore < 0) {
      for (const trait in results) {
        results[trait] += Math.abs(minScore);
      }
    }

    // Guardar los resultados en la variable global
    lastResults = { ...results };

    // Mostrar resultados
    document.getElementById("display-name").textContent = name;
    console.log('Resultados finales:', results);
displayResults(results);
    document.getElementById("results").style.display = "block";

    // Obtener el perfil para guardar
    const profileType = getProfileType(results);

    // Guardar en Supabase
    
try {
const { data, error } = await supabaseClient
  .from('resultados_disc')
  .insert([{
    nombre: name,
    dominio: results.D,
    influencia: results.I,
    estabilidad: results.S,
    concienzudez: results.C,
    perfil: profileType,
    fecha: new Date().toISOString()
  }]);

if (error) {
  console.error('Error al guardar en Supabase:', error);
  if (error.code === '42P01') {
    alert('Error: La tabla "resultados_disc" no existe en la base de datos.');
  } else {
    alert('Error al guardar en la base de datos: ' + error.message);
  }
} else {
  console.log('Resultado guardado exitosamente en Supabase:', data);
  openModal();
}
} catch (error) {
console.error('Error en la conexión con Supabase:', error);
alert('Error de conexión con la base de datos: ' + error.message);
}

  });

  // Función para determinar el tipo de perfil basado en los resultados
  function getProfileType(results) {
    const maxTrait = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);

    const profiles = {
      'D': 'Dominante - Orientado a resultados, decisivo, directo',
      'I': 'Influyente - Sociable, comunicativo, optimista',
      'S': 'Estable - Paciente, predecible, buen oyente',
      'C': 'Concienzudo - Analítico, preciso, sistemático'
    };

    return profiles[maxTrait];
  }

  // Función para mostrar los resultados
  function displayResults(results) {
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    const percentages = {
      D: Math.round((results.D / total) * 100),
      I: Math.round((results.I / total) * 100),
      S: Math.round((results.S / total) * 100),
      C: Math.round((results.C / total) * 100)
    };

    // Generar gráfico
    const graphDiv = document.getElementById("disc-graph");
    graphDiv.innerHTML = '';

    for (const trait in percentages) {
      const barDiv = document.createElement("div");
      barDiv.className = "graph-bar";
      barDiv.innerHTML = `
        <div class="bar ${trait}" style="height: ${percentages[trait]}%"></div>
        <div class="bar-label">${trait} (${percentages[trait]}%)</div>
      `;
      graphDiv.appendChild(barDiv);
    }

    // Descripción del perfil
    const profileType = getProfileType(results);
    const profileDesc = document.getElementById("profile-description");

    let description = '';
    if (results.D > results.I && results.D > results.S && results.D > results.C) {
      description = `
        <p><strong>Perfil Dominante (D):</strong></p>
        <p>Disfruta los retos y la competición. Es orientado a metas y quiere ser reconocido por sus esfuerzos. 
        Tiene variados recursos, apunta alto y quiere autoridad. Es auto-suficiente e individualista. 
        Tiende a ser directo y categórico con las personas.</p>
      `;
    } else if (results.I > results.D && results.I > results.S && results.I > results.C) {
      description = `
        <p><strong>Perfil Influyente (I):</strong></p>
        <p>Extrovertido, generalmente hábil socialmente, disfruta las reuniones y relacionarse con las personas. 
        Optimista y entusiasta. Le gusta ser el centro de atención y tiene facilidad para motivar a otros.</p>
      `;
    } else if (results.S > results.D && results.S > results.I && results.S > results.C) {
      description = `
        <p><strong>Perfil Estable (S):</strong></p>
        <p>Paciente, dispuesto a ayudar a otros, puede lidiar con la rutina y el trabajo detallado. 
        Controlado y calmado. Prefiere ambientes estables y predecibles, es un buen oyente y leal.</p>
      `;
    } else {
      description = `
        <p><strong>Perfil Concienzudo (C):</strong></p>
        <p>Adaptable, evita tomar riesgos, cuidadoso, diplomático, se atiene a reglas y regulaciones. 
        Analítico, preciso y sistemático. Valora la calidad y la exactitud en su trabajo.</p>
      `;
    }
    profileDesc.innerHTML = description;

    // Detalle por rasgo
    const traitDetails = document.getElementById("trait-details");
    traitDetails.innerHTML = `
      <div class="trait-card D">
        <div class="trait-title">Dominancia (D): ${results.D} puntos</div>
        <div>${getTraitDescription('D', results.D)}</div>
      </div>
      <div class="trait-card I">
        <div class="trait-title">Influencia (I): ${results.I} puntos</div>
        <div>${getTraitDescription('I', results.I)}</div>
      </div>
      <div class="trait-card S">
        <div class="trait-title">Estabilidad (S): ${results.S} puntos</div>
        <div>${getTraitDescription('S', results.S)}</div>
      </div>
      <div class="trait-card C">
        <div class="trait-title">Concienzudez (C): ${results.C} puntos</div>
        <div>${getTraitDescription('C', results.C)}</div>
      </div>
    `;

    // Recomendaciones
    const recommendations = document.getElementById("recommendations");
    recommendations.innerHTML = `
      <p><strong>Recomendaciones basadas en su perfil:</strong></p>
      <ul>
        ${getRecommendations(results).map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;
  }

  // Función para obtener descripción detallada de cada rasgo
  function getTraitDescription(trait, score) {
    const descriptions = {
      'D': [
        'Bajo: Evita confrontaciones, prefiere no destacar',
        'Moderado: Asertivo cuando es necesario pero no agresivo',
        'Alto: Muy orientado a resultados, directo y competitivo'
      ],
      'I': [
        'Bajo: Reservado, prefiere no ser el centro de atención',
        'Moderado: Sociable pero no abrumadoramente extrovertido',
        'Alto: Muy comunicativo, entusiasta y persuasivo'
      ],
      'S': [
        'Bajo: Le gusta el cambio y la variedad, impaciente con la rutina',
        'Moderado: Equilibrado entre flexibilidad y estabilidad',
        'Alto: Muy paciente, consistente y buen oyente'
      ],
      'C': [
        'Bajo: Flexible con las reglas, toma riesgos calculados',
        'Moderado: Organizado pero no perfeccionista',
        'Alto: Muy analítico, preciso y atento a los detalles'
      ]
    };

    if (score <= 5) return descriptions[trait][0];
    if (score <= 10) return descriptions[trait][1];
    return descriptions[trait][2];
  }

  // Función para generar recomendaciones basadas en el perfil
  function getRecommendations(results) {
    const maxTrait = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);
    const recommendations = [];

    if (maxTrait === 'D') {
      recommendations.push(
        "Aproveche su capacidad de liderazgo en roles que requieran toma de decisiones rápidas.",
        "Trabaje en desarrollar más paciencia y empatía con los demás.",
        "Busque proyectos desafiantes donde pueda demostrar su iniciativa."
      );
    } else if (maxTrait === 'I') {
      recommendations.push(
        "Utilice sus habilidades sociales en roles que requieran networking o ventas.",
        "Trabaje en desarrollar más atención a los detalles y seguimiento.",
        "Busque entornos dinámicos donde pueda interactuar con muchas personas."
      );
    } else if (maxTrait === 'S') {
      recommendations.push(
        "Aproveche su estabilidad en roles que requieran consistencia y confiabilidad.",
        "Trabaje en ser más asertivo cuando necesite expresar sus opiniones.",
        "Busque entornos con procesos establecidos donde pueda prosperar."
      );
    } else {
      recommendations.push(
        "Aproveche su atención al detalle en roles que requieran precisión y análisis.",
        "Trabaje en ser más flexible cuando las circunstancias lo requieran.",
        "Busque proyectos donde pueda aplicar su pensamiento lógico y sistemático."
      );
    }

    // Recomendación general basada en el rasgo más bajo
    const minTrait = Object.keys(results).reduce((a, b) => results[a] < results[b] ? a : b);
    if (minTrait === 'D') {
      recommendations.push("Considere desarrollar más asertividad y capacidad de toma de decisiones rápidas.");
    } else if (minTrait === 'I') {
      recommendations.push("Considere trabajar en sus habilidades sociales y de comunicación.");
    } else if (minTrait === 'S') {
      recommendations.push("Considere desarrollar más paciencia y tolerancia a la rutina.");
    } else {
      recommendations.push("Considere trabajar en su atención a los detalles y precisión.");
    }

    return recommendations;
  }

  // Evento para el botón de descargar PDF
  document.getElementById("download-pdf").addEventListener("click", () => {
    const doc = new window.jspdf.jsPDF();
    doc.text("Resultados Test DISC", 20, 20);
    doc.text(`Nombre: ${document.getElementById("participant-name").value}`, 20, 30);

    // Agregar gráfico (simplificado)
    doc.setFillColor(231, 76, 60);
    doc.rect(20, 50, 40, lastResults.D * 2, 'F'); // D
    doc.setFillColor(243, 156, 18);
    doc.rect(70, 50, 40, lastResults.I * 2, 'F');  // I
    doc.setFillColor(46, 204, 113);
    doc.rect(120, 50, 40, lastResults.S * 2, 'F'); // S
    doc.setFillColor(52, 152, 219);
    doc.rect(170, 50, 40, lastResults.C * 2, 'F'); // C

    doc.text("D", 40, 155);
    doc.text("I", 90, 155);
    doc.text("S", 140, 155);
    doc.text("C", 190, 155);

    // Agregar descripción del perfil
    const profileDesc = document.getElementById("profile-description").textContent;
    doc.text("Perfil:", 20, 170);
    doc.text(profileDesc, 20, 180, { maxWidth: 170 });

    doc.save("Resultados_DISC.pdf");
  });

  // Evento para el botón de descargar Excel
  document.getElementById("download-excel").addEventListener("click", () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ["Nombre", document.getElementById("participant-name").value],
      ["Rasgo", "Puntuación", "Descripción"],
      ["Dominancia (D)", lastResults.D, getTraitDescription('D', lastResults.D)],
      ["Influencia (I)", lastResults.I, getTraitDescription('I', lastResults.I)],
      ["Estabilidad (S)", lastResults.S, getTraitDescription('S', lastResults.S)],
      ["Concienzudez (C)", lastResults.C, getTraitDescription('C', lastResults.C)],
      ["Perfil", "", getProfileType(lastResults)]
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");
    XLSX.writeFile(wb, "Resultados_DISC.xlsx");
  });

  // Evento para el botón de resetear formulario
  document.getElementById("reset-form-btn").addEventListener("click", resetForm);
  // Función para generar las barras dinámicamente
  function generateGraphBars(results) {
    const graphDiv = document.getElementById("disc-graph");
    graphDiv.innerHTML = ''; // Limpiar contenido previo

    // Calcular el total de puntos para obtener porcentajes
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    const percentages = {
      D: Math.round((results.D / total) * 100),
      I: Math.round((results.I / total) * 100),
      S: Math.round((results.S / total) * 100),
      C: Math.round((results.C / total) * 100)
    };

    // Crear las barras para cada rasgo
    for (const trait in percentages) {
      const barDiv = document.createElement("div");
      barDiv.className = "graph-bar";
      barDiv.innerHTML = `
    <div class="bar ${trait}" style="height: ${percentages[trait]}%;"></div>
    <div class="bar-label">${trait} (${percentages[trait]}%)</div>
  `;
      graphDiv.appendChild(barDiv);
    }
  }

  // Inicializar el formulario y ocultar resultados
  document.getElementById("results").style.display = "none";
  document.getElementById("error-message").style.display = "none";