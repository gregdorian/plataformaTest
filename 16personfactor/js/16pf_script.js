// Configuración de Supabase
const { createClient } = supabase;
const supabaseUrl = 'https://eijeaimjxaywhohceqfc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpamVhaW1qeGF5d2hvaGNlcWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxODg5NzEsImV4cCI6MjA2MDc2NDk3MX0.zyknNW6-uI0UtKhWIMVR-7K1EU5u_EYtpfsr8wgx7Mk';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Variables globales
let currentPage = 1;
const questionsPerPage = 20;
let allQuestions = [];
let answers = {};

// Funciones de manejo del modal
function openModal() {
  document.getElementById("success-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("success-modal").style.display = "none";
}

// Función para resetear el formulario
function resetForm() {
  document.getElementById("pf16-form").reset();
  document.getElementById("results").style.display = "none";
  document.getElementById("error-message").style.display = "none";
  document.getElementById("stored-results").style.display = "none";
  currentPage = 1;
  answers = {};
  loadQuestions();
  updateNavigationButtons();
}

// Cargar las preguntas desde el documento
function loadQuestions() {
  const container = document.getElementById("questions-container");
  container.innerHTML = '';
  
  // Extraer las preguntas del documento
  const questionTexts = [];
  const content = `***CUESTIONARIO PERFIL DE PERSONALIDAD 16* PF**

1. He comprendido bien las instrucciones para contestar al Cuestionario:
A. Sí
B. No estoy seguro
C. No

2. Estoy dispuesto a contestar todas las cuestiones con sinceridad:
A. Sí
B. No estoy seguro
C. No

3. ¿Cuáles de las siguientes palabras es diferente de las otras dos?:
A. Algo
B. Nada
C. mucho

4. Poseo suficiente energía para enfrentarme a todos mis problemas:
A. Siempre
B. Frecuentemente 
C. Raras veces

5. Evito criticar a la gente y sus ideas:
A. Si
B. Algunas veces
C. No

6. Hago agudas y sarcásticas observaciones a la gente si creo que las merece:
A. Generalmente
B. Algunas veces
C. Nunca

7. Me gusta más la música semiclásica que las canciones populares:
A. Verdadero
B. No estoy seguro
C. Falso

8. Si veo peleándose a los niños de mis vecinos:
A. Les dejo solucionar sus problemas
B. No estoy seguro
C. Razono con ellos la solución

9. En situaciones sociales
A. Fácilmente soy de los que toman Iniciativas
B. Intervengo algunas veces 
C. Prefiero quedarme tranquilamente a distancia

10. Sería más interesante ser:
A. Ingeniero de la construcción
B. No estoy seguro entre los dos
C. Escritor de teatro

11. Generalmente puedo tolerar a la gente presuntuosa, aunque fanfarronee o piense demasiado bien de ella misma:
A. Sí
B. Término medio
C. No

12. Cuando una persona no es honrada, casi siempre se le puede notar en la cara:
A. Verdadero
B. Término medio
C. Falso

13. Aceptaría mejor el riesgo de un trabajo donde pudiera tener ganancias mayores, aunque eventuales, que otro con sueldo pequeño, pero seguro:
A. Si
B. No estoy seguro
C. No

14. De vez en cuando siento un vago temor o un repentino miedo, sin poder comprender las razones:
A. Sí
B. Término medio
C. No

15. Cuando me critican duramente por algo que no he hecho:
A. No me siento culpable
B. Término medio
C. Todavía me siento un poco culpable

16. Casi todo se puede comprar con dinero:
A. Sí
B. No estoy seguro
C. No

17. La mayoría de las personas serían más felices si convivieran más con la gente de su nivel e hicieran las cosas como los demás:
A. SI
B. Término medio
C. No

18. En ocasiones, mirándome en un espejo, me entran dudas sobre lo que es mi derecha o izquierda:
A. Verdadero
B. No estoy seguro
C. Falso

19. Cuando algo realmente me pone furioso, suelo calmarme muy pronto:
A. Sí
B. Término medio
C. No

20. Preferiría tener una casa:
A. En un barrio con vida social
B. Término medio
C. Aislada en el bosque

21. Con el mismo horario y sueldo, sería más interesante ser:
A. El cocinero de un buen restaurante
B. No estoy seguro entre ambos
C. El que sirve las mesas en el restaurant

22. "Cansado" es a "trabajar" como "orgulloso" es a:
A. Sonreir
B. Tener éxito
C. Ser feliz

23. Me pongo algo nervioso ante animales salvajes, incluso cuando están encerrados en fuertes jaulas:
A. Si
B. No estoy seguro
C. No

24. Una ley anticuada debería cambiarse:
A. Sólo después de muchas discusiones
B. Término medio
C. Inmediatamente

25. La mayor parte de las personas me consideran un interlocutor agradable:
A. Sí
B. No estoy seguro
C. No

26. Me gusta salir a divertirme o ir a un espectáculo:
A. Más de una vez por semana(más de lo corriente)
B. Alrededor de una vez por semana(lo corriente) 
C. Menos de una vez por semana (menos de lo corriente)

27. Me molesta Cuando veo gente desaliñada y sucia:
A. Lo acepto simplemente
B. Término medio
C. Me disgusta y me fastidia

28. Estando en un grupo social me siento un poco turbado si de pronto paso a ser el foco de atención:
A. Sí
B. Término medio
C. No

29. Cuando voy por la calle prefiero detenerme antes a ver a un artista pintando que a escuchar a la gente discutir:
A. Verdadero
B. No estoy seguro
C. Falso

30. Cuando me ponen al frente de algo, insisto en que se sigan mis instrucciones; en caso contrario, renuncio.
A. Sí
B. Algunas veces
C. No

31. Sería mejor que las vacaciones fueran más largas y obligatorias para todas las personas:
A. De acuerdo
B. No estoy seguro
C. En desacuerdo

32. Hablo acerca de mis sentimientos:
A. Sólo si es necesario
B. Término media
C. Fácilmente, siempre que tengo ocasión

33. Me siento muy abatido cuando la gente me critica en un grupo:
A. Verdadero
B. Término medio
C. Falso

34. Si mi jefe (profesor) me llama a su despacho:
A. Aprovecho la ocasión para pedirle algo que deseo 
B. Término medio
C. Temo haber hecho algo malo, algo que deseo

35. Mis decisiones se apoyan más en:
A. El corazón
B. Los sentimientos y la razón por igual
C. La cabeza

36. En mi adolescencia pertenecía a equipos deportivos:
A. Algunas veces
B. A menudo
C. La mayoría de las veces

37. Cuando hablo con alguien, me gusta:
A. Decir las cosas tal como se me ocurren
B. Término medio
C. Organizar antes mis ideas

38. A veces me pongo en estado de tensión y agitación cuando pienso en los sucesos del día.
A. Si
B. Término medio
C. No

39. He sido elegido para hacer algo:
A. Sólo en pocas ocasiones
B. Varias veces
C. Muchas veces

40. ¿Cuál de las siguientes cosas es diferente de las otras dos?:
A. Vela
B. Ansioso
C. Luz eléctrica

41. "Sorpresa" es a "extraño" como "miedo" es a:
A. Valeroso
B. Ansioso
C. Terrible

42. A veces no puedo dormirme porque tengo una idea que me da vueltas en la cabeza:
A. verdadero
B. No estoy seguro
C. Falso

43. Me siento desasosegado cuando trabajo en un proyecto que requiere una acción rápida que afecta a los demás:
A. Verdadero
B. Término medio
C. Falso

44. Indudablemente tengo menos amigos que la mayoría de las personas:
A. Sí
B. Término medio
C. No

45. Aborrecería tener que estar en un lugar donde hubiera poca gente con quien hablar:
A. Verdadero
B. No estoy seguro
C. Falso

46. Creo que es más importantes mucha libertad que buena educación y respeto a la ley:
A. Verdadero
B. No estoy seguro
C. Falso

47. Siempre me alegra formar parte de un grupo grande, como una reunión, un baile o una asamblea:
A. Sí
B. Término medio
C. No

48. En mi época de estudiante me gustaba (me gusta):
A. La música
B. No estoy seguro
C. La actividad de tipo manual

49. Si alguien se enfada conmigo:
A. Intento calmarle
B. No estoy seguro
C. Me Irrito con él

50. Para los padres es más importante:
A. Ayudar a hijos a desarrollarse afectivamente
B. Término medio
C. Enseñarles a controlar sus emociones

51. Siento de vez en cuando las necesidad de ocuparme en una actividad física enérgica:
A. Si
B. Término medio
C. No

52. Hay veces en que no me siento con humor para ver a alguien:
A. Muy raramente
B. Término medio
C. Muy a menudo

53. A veces los demás me advierten que yo muestro mi excitación demasiado claramente en la voz y en los modales:
A. Sí
B. Término medio
C. No

54. Lo que el mundo necesita es:
A. Ciudadanos más sensatos y constantes
B. No estoy seguro
C. Más "idealistas" con proyectos para un mundo mejor

55. Preferiría tener un negocio propio, no compartido con otra persona:
A. Sí
B. No estoy seguro
C. No

56. Tengo mi habitación organizada de un modo inteligente y estético, con las cosas colocadas casi siempre en lugares conocidas:
A. Si
B. Término medio
C. No

57. En ocasiones dudo si la gente con quien estoy hablando se interesa realmente por lo que digo:
A. Si
B. Término medio
C. No

58. Si tuviera que escoger, preferiría ser:
A. Guarda forestal
B. No estoy seguro
C. Profesor de Enseñanza Media

59. ¿Cuál de las siguientes fracciones es diferente de las otras dos?:
A. 3/7
B. 3/9
C. 3/11

60. "Tamaño" es a "longitud" como "delito" es a:
A. Prisión
B. Castigo
C. Robo

61. En mi vida personal consigo casi siempre todos mis propósitos:
A. Verdadero
B. No estoy seguro
C. Falso

62. Tengo algunas características en las que me siento claramente superior a la mayor parte de la gente:
A. Si
B. No estoy seguro
C. No

63. Sólo asisto a actos sociales cuando estoy obligado, y me mantengo aparte en las demás ocasiones:
A. Si
B. No estoy seguro
C. No

64. Es mejor ser cauto y esperar poco que optimista y esperar siempre el éxito:
A. Verdadero
B. No estoy seguro
C. Falso

65. Algunas veces la gente dice que soy descuidado, aunque me considera una persona agradable.
A. Si
B. Término medio
C. No

66. Suelo permanecer callado delante de personas mayores (con mucha más experiencia, edad o jerarquía): 
A. Si
B. Término medio
C. No

67. Tengo un buen sentido de la orientación (sitúo fácilmente los puntos cardinales), cuando me encuentro en un lugar desconocido:
A. Si
B. Término medio
C. No

68. Cuando leo en una revista un artículo tendencioso o injusto, me inclino más a olvidarlo que a replicar o "devolver el golpe":
A. Verdadero
B. No estoy seguro
C. Falso

69. En tareas de grupo, preferiría:
A. Intentar mejorar los preparativos
B. Término medio
C. Llevar las actas o registros y procurar que se cumplan las normas

70. Me gustaría más andar con, personas corteses que con individuos rebeldes y toscos:
A. Si
B. Término medio
C. No

71. Si mis conocidos me tratan mal o muestran que ya les disgusto:
A. No me importa nada 
B. Término medio
C. Me siento abatido

72. Siempre estoy alerta ante los intentos de propaganda en las cosas que leo:
A. Sí
B. No estoy seguro
C. No

73. Me gustaría más gozar de la vida tranquilamente y a mi modo que ser admirado por mis resultados:
A. Verdadero
B. No estoy seguro
C. Falso

74. Para estar informado, prefiero:
A. Discutir los acontecimientos con la gente
B. Término medio
C. Apoyarme en las informaciones periodísticas de actualidad

75. Me encuentro formado (maduro) para la mayor parte de las cosas:
A. Verdadero
B. No estoy seguro
C. Falso

76. Me encuentro más abatido que ayudado por el tipo de crítica que la gente suele hacer:
A. A menudo
B. Ocasionalmente
C. Nunca

77. En las fiestas de cumpleaños:
A. Me gusta hacer regalos personales
B. No estoy seguro
C. Pienso que comprar regalos es un poco latoso

78. "AB" es a "dc" como "SR" es:
A. qp
B. pq
C. tu

79. "Mejor" es a "pésimo" como "menor" es a:
A. Mayor
B. Optimo
C. Máximo

80. Mis amigos me han fallado:
A. Muy rara vez
B. ocasionalmente
C. Muchas veces

81. Cuando me siento abatido hago grandes esfuerzos por ocultar mis sentimientos a los demás:
A. Verdadero
B. Término medio
C. Falso

82. Gasto gran parte de mi tiempo libre hablando con los amigos sobre situaciones sociales agradables vívidas en el pasado:
A. Si
B. Término medio
C. No

83. Pensando en las dificultades de mi trabajo:
A. Intento organizarme antes de que aparezcan
B. Término medio
C. Doy por supuesto que puedo dominarlas cuando vengan

84. Me cuesta bastante hablar o dirigir la palabra a un grupo numeroso:
A. Sí
B. Término medio
C. No

85. He experimentado en varias situaciones sociales el llamado "nerviosismo del orador":
A. Muy frecuentemente
B. Ocasionalmente
C. Casi nunca

86. Prefiero leer:
A. Una narración realista de contiendas militares o políticas
B. No estoy seguro
C. Una novela imaginativa y delicada

87. Cuando la gente autoritaria trata de dominarme, hago justamente lo contrario de lo que quiere:
A. Sí
B. Término medio
C. No

88. Suelo olvidar muchas cosas triviales y sin importancia, tales como los nombres de las calles y tiendas de la ciudad:
A. Sí
B. Término medio
C. No

89. Me gustaría la profesión de veterinario, ocupado con las enfermedades y curación de los animales:
A. Si
B. Término medio
C. No

90. Me resulta embarazoso que me dediquen elogios o cumplidos:
A. Si
B. Término medio
C. No

91. Siendo adolescente, cuando mi opinión era distinta de la de mis padres, normalmente:
A. Mantenía mi opinión
B. Término medio
C. Aceptaba su autoridad

92. Me gusta tomar parte activa en las tareas sociales, trabajos de comité, etc.:
A. Si
B. Término medio
C. No

93. Al llevar a cabo una tarea, no estoy satisfecho hasta que se ha considerado con toda atención el menor detalle:
A. Verdadero
B. Término medio
C. Falso

94. Tengo ocasiones en que me es difícil alejar un sentimiento de compasión hacia mí mismo:
A. A menudo
B. Algunas veces
C. Nunca

95. Siempre soy capaz de controlar perfectamente la expresión de mis sentimientos:
A. Sí
B. Término medio
C. No

96. Ante un nuevo invento utilitario, me gustaría:
A. Trabajar sobre él en el laboratorio
B. No estoy seguro
C. Venderlo a la gente

97. La siguiente serie de letras XOOOOXXOOOXXX continúa con el grupo:
A. OXXX
B. OOXX
C. XOOO

98. Algunas personas parecen ignorarme o evitarme, aunque no sé por qué:
A. Verdadero
B. No estoy seguro
C. Falso

99. La gente me trata menos razonablemente de lo que merecen mis buenas intenciones:
A. A menudo
B. Ocasionalmente
C. Nunca

100. Aunque no sea en un grupo mixto de mujeres y hombres, me disgusta que se use un lenguaje obsceno.
A. Si
B. Término medio
C. No

101. Me gusta hacer cosas atrevidas y temerarias sólo por el placer de divertirme:
A. Si
B. Término medio
C. No

102. Me resulta molesta la vista de una habitación muy sucia:
A. Si
B. Término medio
C. No

103. Cuando estoy en un grupo pequeño, me agrada quedarme en un segundo término y dejar que otros lleven el peso de la conversación:
A. Si
B. Término medio
C. No

104. Me resulta fácil mezclarme con la gente en una reunión social:
A. Verdadero
B. No estoy seguro
C. Falso

105. Sería más interesante ser:
A. Orientador vocacional para ayudar a los jóvenes en la búsqueda de su profesión 
B. No estoy seguro
C. Directivo de una empresa Industrial

106. Por regla general, mis jefes y mi familia me encuentran defectos sólo cuando realmente existen:
A. Verdadero
B. Término medio
C. Falso

107. Me disgusta el modo con que algunas personas se fijan en otras en la calle o en las tiendas:
A. Sí
B. Término medio
C. No

108. Como los alimentos con gusto y placer, aunque no siempre tan cuidadosa y educadamente como otras personas:
A. Verdadero
B. No estoy seguro
C. Falso

109. Temo algún castigo incluso cuando no he hecho nada malo:
A. A menudo
B. Ocasionalmente
C. Nunca

110. Me gustaría más tener un trabajo con:
A. Un determinado sueldo fijo
B. Término medio
C. Un sueldo más alto pero siempre que demuestre a los demás que lo merezco

111. Me molesta que la gente piense que mi comportamiento es demasiado raro o fuera de lo corriente:
A. Mucho
B. Algo
C. Nada en absoluto

112. A veces dejo que sentimientos de envidia o celos influyan en mis acciones:
A. Sí
B. Término medio
C. No

113. En ocasiones, contrariedades muy pequeñas me irritan mucho:
A. Si
B. Término medio
C. No

114. Siempre duermo bien, nunca hablo en sueños ni me levanto sonámbulo:
A. Sí
B. Término medio
C. No

115. Me resultaría más interesante trabajar en una empresa:
A. Atendiendo a los clientes
B. Término medio
C. Llevando las cuentas o los archivos

116. "Azada" es a "cavar" como "cuchillo" es a:
A. Cortar
E. Afilar
C. Picar

117. Cuando la gente no es razonable, yo normalmente:
A. Me quedo tan tranquilo
B. Término medio
C. La menosprecio

118. Si los demás hablan en voz alta cuando estoy escuchando música:
A. Puedo concentrarme en ella sin que me molesten
B. Término medio
C. Eso me impide disfrutar de ella y me incomoda.

119. Creo que se me describe mejor como:
A. Comedido y reposado
B. Término medio
C. Enérgico

120. Preferiría vestirme con sencillez y corrección que con un estilo personal y llamativo:
A. Verdadero
B. No estoy seguro
C. Falso

121. Me niego a admitir sugerencias bien intencionadas de los demás. aunque sé que no debería hacerlo:
A. Algunas veces
B. Casi nunca
C. Nunca

122. Cuando es necesario que alguien emplee un poco de diplomacia y persuasión para conseguir que la gente actúe, generalmente sólo me lo encargan a mí.
A. Sí
B. Término medio
C. No

123. Me considero a mí mismo como una persona muy abierta y sociable:
A. Sí
B. Término medio
C. No

124. Me gusta la música:
A. Ligera, movida y animada
B. Término medio
C. Emotiva y sentimental

125. Si estoy completamente seguro de que una persona es injusta o se comporta egoístamente, se lo digo, incluso si esto me causa problemas:
A. Sí
B. Término medio
C. No

126. En un viaje largo, preferiría:
A. Leer algo profundo pero Interesante
B. No estoy seguro
C. Pasar el tiempo charlando sobre cualquier cosa con un compañera de viaje

127. En una situación que puede llegar a ser peligrosa, creo que es mejor alborotar o hablar alto, aún cuando se pierdan la calma y la cortesía:
A. Si
B. Término medio
C. No

128. Es muy exagerada la idea de que la enfermedad proviene tanto de causas mentales como físicas:
A. Sí
B. Término medio
C. No

129. En cualquier gran ceremonia oficial debería mantenerse la pompa y el esplendor:
A. Sí
B. Término medio
C. No

130. Cuando hay que hacer algo, me gustaría más trabajar:
A. En equipo
B. No estoy seguro
C. Yo solo

131. Creo firmemente que "tal vez el jefe no tenga siempre la razón, pero siempre tiene la razón por ser el jefe":
A. Si
B. No estoy seguro
C. No

132. Suelo enfadarme con las personas demasiado pronto:
A. Si
B. Término medio
C. No

133. Siempre puedo cambiar viejos hábitos sin dificultad y sin volver a ellos:
A. Si
B. Término medio
C. No

134. Si el sueldo fuera el mismo, preferiría ser:
A. Abogado
B. No estoy seguro entre ambos
C. Navegante o piloto

135. "Llama" es a "calor" como "rosa" es a:
A. Espina
B. Pétalo
C. Aroma

136. Cuando se acerca el momento de algo que he planeado y he esperado, en ocasiones pierdo la ilusión por ello:
A. Verdadero
B. Término medio
C. Falso

137. Puedo trabajar cuidadosamente en la mayor partede las cosas sin que me molesten personas hacen mucho ruido a mi alrededor:
A. Si
B. Término medio
C. No

138. En ocasiones hablo a desconocidos sobre cosas que considero importantes, aunque no me pregunten sobre ellas:
A. Si
B. Término medio
C. No

139. Me atrae más pasar una tarde ocupado en una tarea tranquila a la que tenga afición que estar en una reunión animada:
A. Verdadero
B. No estoy seguro
C. Falso

140. Cuando debo decidir algo, tengo siempre presentes las reglas básicas de lo justo y lo injusto:
A. Sí
B. Término medio
C. No

141. En el trato social:
A. Muestro mis emociones tal como las siento
B. Término medio
C. Guardo mis emociones para mis adentros

142. Admiro más la belleza de un poema que la de un arma de fuego bien construida:
A. Si
B. No estoy seguro
C. No

143. A veces digo en broma disparates, sólo para sorprender a la gente y ver qué responden:
A. Si
B. Término medio
C. No

144. Me agradaría ser un periodista que escribiera sobre, teatro, conciertos, ópera, etc.:
A. Si
B. No estoy seguro
C. No

145. Nunca siento la necesidad de garabatear, dibujar o moverme cuando estoy sentado en una reunión:
A. Verdadero
B. No estoy seguro
C. No

146. Si alguien me dice algo que yo sé que no es cierto, suelo pensar:
A. Es un mentirosos
B. Término medio
C. Evidentemente no está bien Informado

147. La gente me considera con justicia una persona activa pero con éxito sólo mediano:
A. Sí
B. No estoy seguro
C. No

148. Si se suscitara una controversia violenta entre otros miembros de un grupo de discusión:
A. Me gustaría ver quién es el "ganador"
B. Término medio
C. Desearía que se suavizara de nuevo la situación

149. Me gusta planear mis cosas solo, sin interrupciones y sugerencias de otros:
A. Sí
B. Término medio
C. No

150. Me gusta seguir mis propios caminos, en vez de actuar según normas establecidas.
A. Verdadero
B. No estoy seguro
C. Falso

151. Me pongo nervioso (tenso) cuando pienso en todas las cosas que tengo que hacer:
A. Si
B. Algunas veces
C. No

152. No me perturba que la gente me haga alguna sugerencia cuando estoy jugando:
A. Verdadero
B. No estoy seguro
C. Falso

153. Me parece más interesante ser:
A. Artista
B. No estoy seguro
C. Secretario de un club

154. ¿Cuál de las siguientes palabras es diferente de las otras dos?:
A. Ancho
B. Zigzag
C. Recto

155. He tenido sueños tan intensos que no me han dejado dormir bien:
A. A menudo
B. Ocasionalmente
C. Prácticamente nunca

156. Aunque tenga pocas posibilidades de éxito, creo que todavía me merece la pena correr el riesgo:
A. Sí
B. Término medio
C. No

157. Cuando yo sé muy bien lo que el grupo tiene que hacer, me gusta ser el único en dar las órdenes:
A. Si
B. Término medio
C. No

158. Me consideran una persona muy entusiasta:
A. Sí
B. Término medio
C. No

159. Soy una persona bastante estricta, e insisto siempre en hacer las cosas tan correctamente como sea posible:
A. Verdadero
B. Término medio
C. Falso

160. Me disgusta un poco que la gente me esté mirando cuando trabajo:
A. Sí
B. Término medio
C. No

161. Como no siempre es posible conseguir las cosas utilizando gradualmente métodos razonables, a veces es necesario emplear la fuerza:
A. Verdadero
B. Término medio
C. Falso

162. Si se pasa por alto una buena observación mía:
A. La dejo pasar
B. Término medio
C. Doy a la gente la oportunidad de volver a escucharla

163. Me gustaría hacer el trabajo de un oficial encargado de los casos de delincuentes bajo fianza:
A. Si
B. Término medio
C. No

164. Hay que ser prudente antes de mezclarse con cualquier desconocido, puesto que hay peligros de infección y de otro tipo:
A. Si
B. No estoy seguro
C. No

165. En un viaje al extranjero, preferiría ir en un grupo organizado, con un experto, que planear yo mismo los lugares que deseo visitar:
A. Si
B. No estoy seguro
C. No

166. Si la gente se aprovecha de mi amistad, no me quedo resentido y lo olvido pronto:
A. Verdadero
B. Término medio
C. Falso

167. Creo que la sociedad debería aceptar nuevas costumbres, de acuerdo con la razón, y olvidar los viejos usos y tradiciones:
A. Sí
B. Término medio
C. No

168. Aprendo mejor:
A. Leyendo un libro bien escrito
B. Término medio
C. Participando en un grupo de discusión

169. Me gusta esperar a estar seguro de que lo que voy a decir es correcto, antes de exponer mis ideas:
A. Siempre
B. Generalmente
C. Sólo si es posible

170. Algunas veces me "sacan de quicio" de un modo insoportable pequeñas cosas, aunque reconozca que son triviales:
A. Si
B. Término medio
C. No

171. No suelo decir, sin pensarlas, cosas que luego lamento mucho:
A. Verdadero
B. No estoy seguro
C. Falso

172. Si se me pidiera colaborar en una campaña caritativa:
A. Aceptaría
B. No estoy seguro
C. Diría cortésmente que estoy muy ocupado

173. "Pronto" es a "nunca" como "cerca" es a:
A. En ningún sitio
B. Lejos
C. En otro sitio

174. Si cometo una falta social desagradable, puedo olvidarla pronto:
A. Si
B. No estoy seguro
C. No

175. Se me considera un "hombre de ideas" que casi siempre puede apuntar alguna solución a un problema:
A. Si
B. Término medio
C. No

176. Creo que se me da mejor mostrar:
A. Aplomo en las pugnas y discusiones de una reunión 
B. No estoy seguro
C. Tolerancia con los deseos de los demás

177. Me gusta un trabajo que presente cambios, variedad y viajes, aunque implique algún peligro:
A. Si
B. Término medio
C. No

178. Me gusta un trabajo que requiera dotes de atención y exactitud:
A. Si
B. Término medio
C. No

179. Soy de ese tipo de personas con tanta energía que siempre están ocupadas:
A. Si
B. No estoy seguro
C. No

180. En mi época de estudiante prefería (prefiero):
A. Lengua o Literatura 
B. No estoy seguro
C. Matemáticas o Aritmética

181. Algunas veces me ha turbado el que la gente diga a mi espalda cosas desagradables de mí sin fundamento:
A. Si
B. No estoy seguro
C. No

182. Hablar con personas corrientes, convencionales y rutinarias:
A. Es a menudo muy Interesante e Instructivo
B. Término medio
C. Me fastidia porque no hay profundidad o se trata de chismes y cosas sin importancia

183. Algunas cosas me irritan tanto que creo que entonces lo mejor es no hablar:
A. Si
B. Término medio
C. No

184. En la formación del niño, es más importante:
A. Darle bastante afecto
B. Término medio
C. Procurar que aprenda hábitos y actitudes deseables

185. Los demás me consideran una persona firme e imperturbable, impasible ante los vaivenes de las circunstancias:
A. Si
B. Término medio
C. No

186. Creo que en el mundo actual es más importante resolver:
A. El problema de la intención moral
B. No estoy seguro
C. Los problemas políticos

187. Creo que no me he saltado ninguna cuestión y he contestado a todas de modo apropiado:
A. Sí
B. No estoy seguro
C. No`;

  // Procesar el texto para extraer preguntas y opciones
  const lines = content.split('\n');
  let currentQuestion = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detectar inicio de pregunta
    if (/^\d+\./.test(line)) {
      if (currentQuestion) {
        questionTexts.push(currentQuestion);
      }
      currentQuestion = {
        text: line.replace(/^\d+\.\s*/, ''),
        options: []
      };
    } 
    // Detectar opciones de respuesta
    else if (/^[A-Z]\./.test(line) && currentQuestion) {
      currentQuestion.options.push(line.replace(/^[A-Z]\.\s*/, ''));
    }
    // Continuar texto de pregunta si no es una opción
    else if (currentQuestion && line && !/^[A-Z]\./.test(line)) {
      currentQuestion.text += ' ' + line;
    }
  }
  
  // Añadir la última pregunta
  if (currentQuestion) {
    questionTexts.push(currentQuestion);
  }

  allQuestions = questionTexts;
  renderQuestions();
}

// Renderizar preguntas según la página actual
function renderQuestions() {
  const container = document.getElementById("questions-container");
  container.innerHTML = '';
  
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, allQuestions.length);
  
  for (let i = startIndex; i < endIndex; i++) {
    const question = allQuestions[i];
    const questionNum = i + 1;
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.id = `question-${questionNum}`;
    
    let optionsHtml = '';
    for (let j = 0; j < question.options.length; j++) {
      const optionLetter = String.fromCharCode(65 + j);
      const isChecked = answers[questionNum] === optionLetter ? 'checked' : '';
      optionsHtml += `
        <label>
          <input type="radio" name="q${questionNum}" value="${optionLetter}" ${isChecked}>
          ${optionLetter}. ${question.options[j]}
        </label>
      `;
    }
    
    questionDiv.innerHTML = `
      <p><strong>${questionNum}.</strong> ${question.text}</p>
      <div class="options">${optionsHtml}</div>
    `;
    
    container.appendChild(questionDiv);
  }
  
  updateNavigationButtons();
}

// Actualizar botones de navegación
function updateNavigationButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const calculateBtn = document.getElementById("calculate-btn");
  
  prevBtn.style.display = currentPage > 1 ? "inline-block" : "none";
  
  if (currentPage < Math.ceil(allQuestions.length / questionsPerPage)) {
    nextBtn.style.display = "inline-block";
    calculateBtn.style.display = "none";
  } else {
    nextBtn.style.display = "none";
    calculateBtn.style.display = "inline-block";
  }
  
  // Mostrar botones de descarga solo cuando se muestran resultados
  const downloadPdfBtn = document.getElementById("download-pdf");
  const downloadExcelBtn = document.getElementById("download-excel");
  const resetBtn = document.getElementById("reset-form-btn");
  downloadPdfBtn.style.display = "none";
  downloadExcelBtn.style.display = "none";
  resetBtn.style.display = "none";
}

// Guardar respuestas de la página actual
function saveCurrentPageAnswers() {
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, allQuestions.length);
  
  for (let i = startIndex; i < endIndex; i++) {
    const questionNum = i + 1;
    const selectedOption = document.querySelector(`input[name="q${questionNum}"]:checked`);
    
    if (selectedOption) {
      answers[questionNum] = selectedOption.value;
    }
  }
}

// Función para guardar resultados en Supabase
async function saveResults(name, gender, results) {
  try {
    const { data, error } = await supabaseClient
      .from('resultados_16pf')
      .insert([{
        nombre: name,
        genero: gender,
        a: results.A || 1,
        b: results.B || 1,
        c: results.C || 1,
        e: results.E || 1,
        f: results.F || 1,
        g: results.G || 1,
        h: results.H || 1,
        i: results.I || 1,
        l: results.L || 1,
        m: results.M || 1,
        n: results.N || 1,
        o: results.O || 1,
        q1: results.Q1 || 1,
        q2: results.Q2 || 1,
        q3: results.Q3 || 1,
        q4: results.Q4 || 1
      }]);
    
    if (error) {
      console.error('Error al guardar en Supabase:', error);
      alert("No se pudo guardar el resultado. Revisa la consola para más detalles.");
      return false;
    } else {
      console.log('Resultado guardado en Supabase.');
      openModal();
      return true;
    }
  } catch (err) {
    console.error('Error inesperado:', err);
    alert("Ocurrió un error inesperado al guardar los resultados.");
    return false;
  }
}

// Calcular resultados del 16 PF
function calculateResults() {
  // Mapeo de preguntas a factores (simplificado)
  const factorMap = {
    // A - Afectividad
    'A': [3, 26, 27, 51, 52, 76, 101, 126, 151, 176],
    // B - Razonamiento
    'B': [28, 53, 54, 77, 78, 102, 127, 152, 177],
    // C - Estabilidad
    'C': [4, 5, 29, 30, 55, 79, 80, 103, 128, 153, 178],
    // E - Dominancia
    'E': [6, 7, 31, 32, 56, 57, 81, 82, 104, 129, 154, 179],
    // F - Animación
    'F': [8, 9, 33, 34, 58, 59, 83, 84, 105, 130, 155, 180],
    // G - Atención a normas
    'G': [10, 11, 35, 36, 60, 61, 85, 86, 106, 131, 156, 181],
    // H - Atrevimiento
    'H': [12, 13, 37, 38, 62, 63, 87, 88, 107, 132, 157, 182],
    // I - Sensibilidad
    'I': [14, 15, 39, 40, 64, 65, 89, 90, 108, 133, 158, 183],
    // L - Vigilancia
    'L': [16, 17, 41, 42, 66, 67, 91, 92, 109, 134, 159, 184],
    // M - Abstracción
    'M': [18, 19, 43, 44, 68, 69, 93, 94, 110, 135, 160, 185],
    // N - Privacidad
    'N': [20, 21, 45, 46, 70, 71, 95, 96, 111, 136, 161, 186],
    // O - Aprensión
    'O': [22, 23, 47, 48, 72, 73, 97, 98, 112, 137, 162, 187],
    // Q1 - Apertura al cambio
    'Q1': [24, 25, 49, 50, 74, 75, 99, 100, 113, 138, 163],
    // Q2 - Autosuficiencia
    'Q2': [1, 2, 114, 115, 139, 140, 164, 165],
    // Q3 - Perfeccionismo
    'Q3': [116, 117, 141, 142, 166, 167],
    // Q4 - Tensión
    'Q4': [118, 119, 143, 144, 168, 169, 170, 171, 172, 173, 174, 175]
  };
  
  // Puntos por respuesta (simplificado)
  const scoreValues = {
    'A': { 'A': 2, 'B': 1, 'C': 0 },
    'B': { 'A': 0, 'B': 1, 'C': 2 },
    // ... (patrón similar para otros factores)
    // En una implementación real, esto sería más detallado
  };
  
  const results = {};
  const name = document.getElementById("participant-name").value.trim();
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  
  // Calcular puntuaciones para cada factor
  for (const factor in factorMap) {
    const questions = factorMap[factor];
    let score = 0;
    
    for (const qNum of questions) {
      const answer = answers[qNum];
      // En una implementación real, se usaría un sistema de puntuación más complejo
      if (answer === 'A') score += 2;
      else if (answer === 'B') score += 1;
      // 'C' suma 0
    }
    
    // Normalizar puntuación a escala 1-10 (simplificado)
    results[factor] = Math.min(10, Math.max(1, Math.round(score / questions.length * 5)));
  }
  
  // Mostrar resultados
  displayResults(name, gender, results);
  
  // Guardar en Supabase
  saveResults(name, gender, results);
  
  return results;
}

// Mostrar resultados en la página
function displayResults(name, gender, results) {
  document.getElementById("display-name").textContent = name;
  const container = document.getElementById("factors-results");
  container.innerHTML = '';
  
  // Definir descripciones para cada factor
  const factorDescriptions = {
    'A': 'Afectividad: Calidez interpersonal y capacidad para establecer relaciones cercanas.',
    'B': 'Razonamiento: Capacidad de pensamiento abstracto y resolución de problemas.',
    'C': 'Estabilidad: Nivel de ajuste emocional y capacidad para manejar el estrés.',
    'E': 'Dominancia: Tendencia a ser asertivo, competitivo y tomar el liderazgo.',
    'F': 'Animación: Nivel de entusiasmo, espontaneidad y energía expresiva.',
    'G': 'Atención a normas: Grado de responsabilidad y adherencia a normas y obligaciones.',
    'H': 'Atrevimiento: Disposición a asumir riesgos y enfrentar situaciones desafiantes.',
    'I': 'Sensibilidad: Nivel de ternura, sentimentalismo y dependencia emocional.',
    'L': 'Vigilancia: Tendencia a ser suspicaz, desconfiado o vigilante.',
    'M': 'Abstracción: Nivel de imaginación, creatividad y pensamiento innovador.',
    'N': 'Privacidad: Grado de sofisticación social, discreción y tacto.',
    'O': 'Aprensión: Tendencia a experimentar preocupación, culpa e inseguridad.',
    'Q1': 'Apertura al cambio: Disposición a considerar nuevas ideas y enfoques.',
    'Q2': 'Autosuficiencia: Preferencia por trabajar y tomar decisiones de forma independiente.',
    'Q3': 'Perfeccionismo: Nivel de organización, autodisciplina y control.',
    'Q4': 'Tensión: Grado de impaciencia, frustración y tensión experimentada.'
  };
  
  for (const factor in results) {
    const card = document.createElement('div');
    card.className = 'factor-card';
    
    const score = results[factor];
    let interpretation = '';
    
    if (score <= 3) {
      interpretation = 'Bajo';
    } else if (score <= 6) {
      interpretation = 'Medio';
    } else {
      interpretation = 'Alto';
    }
    
    card.innerHTML = `
      <div class="factor-title">Factor ${factor}</div>
      <div class="factor-score">${score}/10 - ${interpretation}</div>
      <div class="factor-description">${factorDescriptions[factor]}</div>
    `;
    
    container.appendChild(card);
  }
  
  document.getElementById("results").style.display = "block";
  
  // Mostrar botones de descarga
  document.getElementById("download-pdf").style.display = "inline-block";
  document.getElementById("download-excel").style.display = "inline-block";
  document.getElementById("reset-form-btn").style.display = "inline-block";
}

function validateAllQuestions() {
  const unanswered = [];
  for (let i = 0; i < allQuestions.length; i++) {
    const questionNum = i + 1;
    if (!answers[questionNum]) {
      unanswered.push(questionNum);
      const questionElement = document.getElementById(`question-${questionNum}`);
      if (questionElement) questionElement.classList.add("invalid");
    } else {
      const questionElement = document.getElementById(`question-${questionNum}`);
      if (questionElement) questionElement.classList.remove("invalid");
    }
  }

  if (unanswered.length > 0) {
    document.getElementById("error-message").textContent = `Faltan preguntas: ${unanswered.join(', ')}`;
    document.getElementById("error-message").style.display = "block";
    return false;
  }

  document.getElementById("error-message").style.display = "none";
  return true;
}

// Event listeners
document.getElementById("prev-btn").addEventListener("click", () => {
  saveCurrentPageAnswers();
  currentPage--;
  renderQuestions();
});

document.getElementById("next-btn").addEventListener("click", () => {
  saveCurrentPageAnswers();
  
  // Verificar que todas las preguntas de la página actual están respondidas
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, allQuestions.length);
  const unanswered = [];
  
  for (let i = startIndex; i < endIndex; i++) {
    const questionNum = i + 1;
    if (!answers[questionNum]) {
      unanswered.push(questionNum);
      const questionElement = document.getElementById(`question-${questionNum}`);
      if (questionElement) questionElement.classList.add("invalid");
    } else {
      const questionElement = document.getElementById(`question-${questionNum}`);
      if (questionElement) questionElement.classList.remove("invalid");
    }
  }
  
  if (unanswered.length > 0) {
    document.getElementById("error-message").textContent = `Faltan preguntas: ${unanswered.join(', ')}`;
    document.getElementById("error-message").style.display = "block";
    return;
  }
  
  document.getElementById("error-message").style.display = "none";
  currentPage++;
  renderQuestions();
});

document.getElementById("calculate-btn").addEventListener("click", () => {
  saveCurrentPageAnswers();
  
  // Verificar que todas las preguntas están respondidas
  const unanswered = [];
  for (let i = 0; i < allQuestions.length; i++) {
    const questionNum = i + 1;
    if (!answers[questionNum]) {
      unanswered.push(questionNum);
      const questionElement = document.getElementById(`question-${questionNum}`);
      if (questionElement) questionElement.classList.add("invalid");
    } else {
      const questionElement = document.getElementById(`question-${questionNum}`);
      if (questionElement) questionElement.classList.remove("invalid");
    }
  }
  
  const name = document.getElementById("participant-name").value.trim();
  const gender = document.querySelector('input[name="gender"]:checked')?.value;
  
  if (!name || !gender || unanswered.length > 0) {
    document.getElementById("error-message").textContent = 
      !name ? "Ingrese su nombre." : 
      !gender ? "Seleccione su género." : 
      `Faltan preguntas: ${unanswered.join(', ')}`;
    document.getElementById("error-message").style.display = "block";
    return;
  }
  
  document.getElementById("error-message").style.display = "none";
  calculateResults();
});

document.getElementById("download-pdf").addEventListener("click", () => {
  const doc = new window.jspdf.jsPDF();
  doc.text("Resultados 16 PF", 20, 20);
  doc.text(`Nombre: ${document.getElementById("participant-name").value}`, 20, 30);
  
  let y = 50;
  const factorDescriptions = {
    'A': 'Afectividad', 'B': 'Razonamiento', 'C': 'Estabilidad', 
    'E': 'Dominancia', 'F': 'Animación', 'G': 'Atención a normas',
    'H': 'Atrevimiento', 'I': 'Sensibilidad', 'L': 'Vigilancia',
    'M': 'Abstracción', 'N': 'Privacidad', 'O': 'Aprensión',
    'Q1': 'Apertura al cambio', 'Q2': 'Autosuficiencia',
    'Q3': 'Perfeccionismo', 'Q4': 'Tensión'
  };
  
  for (const factor in factorDescriptions) {
    const score = Math.floor(Math.random() * 10) + 1; // Ejemplo, en realidad usaríamos los resultados calculados
    let interpretation = '';
    
    if (score <= 3) interpretation = 'Bajo';
    else if (score <= 6) interpretation = 'Medio';
    else interpretation = 'Alto';
    
    doc.text(`${factor} - ${factorDescriptions[factor]}: ${score}/10 (${interpretation})`, 20, y);
    y += 10;
    
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  }
  
  doc.save("Resultados_16PF.pdf");
});

document.getElementById("download-excel").addEventListener("click", () => {
  const wb = XLSX.utils.book_new();
  const factorDescriptions = {
    'A': 'Afectividad', 'B': 'Razonamiento', 'C': 'Estabilidad', 
    'E': 'Dominancia', 'F': 'Animación', 'G': 'Atención a normas',
    'H': 'Atrevimiento', 'I': 'Sensibilidad', 'L': 'Vigilancia',
    'M': 'Abstracción', 'N': 'Privacidad', 'O': 'Aprensión',
    'Q1': 'Apertura al cambio', 'Q2': 'Autosuficiencia',
    'Q3': 'Perfeccionismo', 'Q4': 'Tensión'
  };
  
  const data = [
    ["Nombre", document.getElementById("participant-name").value],
    ["Género", document.querySelector('input[name="gender"]:checked')?.value === 'male' ? 'Hombre' : 'Mujer'],
    ["Factor", "Puntuación", "Interpretación"]
  ];
  
  for (const factor in factorDescriptions) {
    const score = Math.floor(Math.random() * 10) + 1; // Ejemplo, en realidad usaríamos los resultados calculados
    let interpretation = '';
    
    if (score <= 3) interpretation = 'Bajo';
    else if (score <= 6) interpretation = 'Medio';
    else interpretation = 'Alto';
    
    data.push([factorDescriptions[factor], score, interpretation]);
  }
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Resultados");
  XLSX.writeFile(wb, "Resultados_16PF.xlsx");
});

document.getElementById("reset-form-btn").addEventListener("click", resetForm);

document.getElementById("show-results-btn").addEventListener("click", async () => {
  const { data, error } = await supabaseClient.from('resultados_16pf').select('*');
  
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
      <td>${row.a}</td>
      <td>${row.b}</td>
      <td>${row.c}</td>
      <td>${row.e}</td>
      <td>${row.f}</td>
      <td>${row.g}</td>
      <td>${row.h}</td>
      <td>${row.i}</td>
      <td>${row.l}</td>
      <td>${row.m}</td>
      <td>${row.n}</td>
      <td>${row.o}</td>
      <td>${row.q1}</td>
      <td>${row.q2}</td>
      <td>${row.q3}</td>
      <td>${row.q4}</td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById("stored-results").style.display = "block";
});

// Cargar las preguntas al iniciar
window.addEventListener('DOMContentLoaded', loadQuestions);