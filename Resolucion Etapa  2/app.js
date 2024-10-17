// Clase Estudiante
class Estudiante {
  constructor(id, nombre, edad, nota) {
    this.id = id;
    this.nombre = nombre;
    this.edad = edad;
    this.nota = nota;
  }

  presentarse() {
    return `${this.nombre} (${this.edad} años) - Nota: ${this.nota}`;
  }
}

// Clase Curso
class Curso {
  constructor(id, nombre, profesor) {
    this.id = id;
    this.nombre = nombre;
    this.profesor = profesor;
    this.estudiantes = [];
  }

  agregarEstudiante(estudiante) {
    this.estudiantes.push(estudiante);
  }

  listarEstudiantes() {
    if (this.estudiantes.length === 0) return 'No hay estudiantes en este curso.';
    return this.estudiantes.map(est => `
        <div class="estudiante" data-id="${est.id}">
          ${est.presentarse()}
          <button class="editar-estudiante">Editar</button>
          <button class="eliminar-estudiante">Eliminar</button>
        </div>
      `).join('');
  }

  obtenerPromedio() {
    let totalNotas = this.estudiantes.reduce((total, est) => total + est.nota, 0);
    return (this.estudiantes.length > 0) ? (totalNotas / this.estudiantes.length).toFixed(2) : 'N/A';
  }

  editar(nombre, profesor) {
    this.nombre = nombre;
    this.profesor = profesor;
  }

  eliminarEstudiante(id) {
    this.estudiantes = this.estudiantes.filter(est => est.id !== id);
  }
}

// Arreglo para almacenar los cursos
let cursos = [];
let idCursoActual = 0;
let idEstudianteActual = 0;

// DOM elements
const formCurso = document.getElementById('form-curso');
const formEstudiante = document.getElementById('form-estudiante');
const cursoEstudianteSelect = document.getElementById('curso-estudiante');
const listaCursos = document.getElementById('lista-cursos');


// Botones de cancelar
const botonCancelarCurso = document.getElementById('cancelar-curso');
const botonCancelarEstudiante = document.getElementById('cancelar-estudiante');

// Títulos de formularios
const tituloFormCurso = document.getElementById('titulo-form-curso');
const tituloFormEstudiante = document.getElementById('titulo-form-estudiante');

// Validar el formulario de curso

function ValidarCursos() {
  const nombreCurso = document.getElementById('nombre-curso').value;
  const profesorCurso = document.getElementById('profesor-curso').value;
  
  var bandera = true;
  var bandera1 = true;

  if (nombreCurso == '') {
    alert('El nombre del curso no puede estar vacío.');
    bandera = false
  }

  if (profesorCurso == '') {
    alert('El nombre del profesor no puede estar vacío.');
    bandera1 = false
  }

  console.log(bandera, bandera1)


  if (bandera == true && bandera1 == true) {

    const idCurso = document.getElementById('id-curso').value
    if (idCurso) {
      // Editar curso existente
      const curso = cursos.find(c => c.id === parseInt(idCurso));
      if (curso) {
        curso.editar(nombreCurso, profesorCurso);
        resetFormularioCurso();
      }
    } else {
      // Crear un nuevo curso
      console.log("estuve aqui")
      const nuevoCurso = new Curso(idCursoActual++, nombreCurso, profesorCurso);
      cursos.push(nuevoCurso);
    }
    ;
    // Limpiar formulario
    formCurso.reset();

    // Actualizar la lista de cursos en el select
    actualizarCursosSelect();

    // Mostrar los cursos
    mostrarCursos();
  }

}
// Validar el formulario de estudiante
function validarEstudiante(nombreEstudiante, edadEstudiante, notaEstudiante) {

  if (!nombreEstudiante.trim()) {
    alert('El nombre del estudiante no puede estar vacío.');
  }

  if (edadEstudiante <= 0) {
    alert("la edad debe ser un numero positivo")
  }

  if (notaEstudiante < 0 || notaEstudiante > 10) {
    alert('La nota debe estar entre 0 y 10.');
  }
}

// Mostrar los errores debajo del formulario
function mostrarErrores(errores, idElementoError) {
  const divErrores = document.getElementById(idElementoError);
  divErrores.innerHTML = errores.join('<br>');
  divErrores.style.display = 'block';
}

// Ocultar mensajes de error
function ocultarErrores(idElementoError) {
  const divErrores = document.getElementById(idElementoError);
  divErrores.innerHTML = '';
  divErrores.style.display = 'none';
}

// Evento para agregar un curso o editar


// Evento para cancelar edición de curso
botonCancelarCurso.addEventListener('click', () => {
  resetFormularioCurso();
});

// Evento para agregar un estudiante o editar
formEstudiante.addEventListener('submit', (e) => {
  e.preventDefault();

  // Capturar datos del formulario
  const nombreEstudiante = document.getElementById('nombre-estudiante').value;
  const edadEstudiante = parseInt(document.getElementById('edad-estudiante').value);
  const notaEstudiante = parseFloat(document.getElementById('nota-estudiante').value);
  const cursoIndex = cursoEstudianteSelect.value;

  const idEstudiante = document.getElementById('id-estudiante').value;

  if (idEstudiante) {
    // Editar estudiante existente
    const curso = cursos.find(c => c.id === parseInt(document.getElementById('id-curso-estudiante').value));
    if (curso) {
      const estudiante = curso.estudiantes.find(est => est.id === parseInt(idEstudiante));
      if (estudiante) {
        estudiante.nombre = nombreEstudiante;
        estudiante.edad = edadEstudiante;
        estudiante.nota = notaEstudiante;
        resetFormularioEstudiante();
      }
    }
  } else {
    // Crear un nuevo estudiante
    const nuevoEstudiante = new Estudiante(idEstudianteActual++, nombreEstudiante, edadEstudiante, notaEstudiante);
    cursos[cursoIndex].agregarEstudiante(nuevoEstudiante);
  }

  // Limpiar formulario
  formEstudiante.reset();

  // Mostrar los cursos actualizados
  mostrarCursos();
});

// Evento para cancelar edición de estudiante
botonCancelarEstudiante.addEventListener('click', () => {
  resetFormularioEstudiante();
});


// Función para actualizar el select de cursos
function actualizarCursosSelect() {
  cursoEstudianteSelect.innerHTML = '';
  cursos.forEach((curso, index) => {
    let option = document.createElement('option');
    option.value = index;
    option.textContent = curso.nombre;
    cursoEstudianteSelect.appendChild(option);
  });
}

// Función para mostrar los cursos y estudiantes
function mostrarCursos() {
  listaCursos.innerHTML = '';
  cursos.forEach((curso) => {
    let cursoDiv = document.createElement('div');
    cursoDiv.classList.add('curso');
    cursoDiv.setAttribute('data-id', curso.id);

    cursoDiv.innerHTML = `
      <h3>Curso: ${curso.nombre} (Profesor: ${curso.profesor})</h3>
      <button class="editar-curso">Editar Curso</button>
      <button class="eliminar-curso">Eliminar Curso</button>
      <p><strong>Promedio:</strong> ${curso.obtenerPromedio()}</p>
      <div class="estudiantes">
        <strong>Estudiantes:</strong><br>
        ${curso.listarEstudiantes()}
      </div>
    `;

    listaCursos.appendChild(cursoDiv);
  });

  // Añadir event listeners para botones de cursos
  document.querySelectorAll('.editar-curso').forEach(btn => {
    btn.addEventListener('click', editarCurso);
  });
  document.querySelectorAll('.eliminar-curso').forEach(btn => {
    btn.addEventListener('click', eliminarCurso);
  });

  // Añadir event listeners para botones de estudiantes
  document.querySelectorAll('.editar-estudiante').forEach(btn => {
    btn.addEventListener('click', editarEstudiante);
  });
  document.querySelectorAll('.eliminar-estudiante').forEach(btn => {
    btn.addEventListener('click', eliminarEstudiante);
  });
}
// Funciones para editar y eliminar cursos
function editarCurso(e) {
  const cursoDiv = e.target.parentElement;
  const idCurso = parseInt(cursoDiv.getAttribute('data-id'));
  const curso = cursos.find(c => c.id === idCurso);
  if (curso) {
    // Rellenar el formulario con los datos del curso
    document.getElementById('id-curso').value = curso.id;
    document.getElementById('nombre-curso').value = curso.nombre;
    document.getElementById('profesor-curso').value = curso.profesor;

    // Cambiar el título y el botón del formulario
    tituloFormCurso.textContent = 'Editar Curso';
    document.getElementById('boton-curso').textContent = 'Guardar Cambios';
    botonCancelarCurso.style.display = 'inline-block';
  }
}

function eliminarCurso(e) {
  if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
    const cursoDiv = e.target.parentElement;
    const idCurso = parseInt(cursoDiv.getAttribute('data-id'));
    cursos = cursos.filter(c => c.id !== idCurso);
    actualizarCursosSelect();
    mostrarCursos();
  }
}

// Funciones para editar y eliminar estudiantes
function editarEstudiante(e) {
  const estudianteDiv = e.target.parentElement;
  const idEstudiante = parseInt(estudianteDiv.getAttribute('data-id'));
  const cursoDiv = e.target.closest('.curso');
  const idCurso = parseInt(cursoDiv.getAttribute('data-id'));
  const curso = cursos.find(c => c.id === idCurso);
  if (curso) {
    const estudiante = curso.estudiantes.find(est => est.id === idEstudiante);
    if (estudiante) {
      // Rellenar el formulario con los datos del estudiante
      document.getElementById('id-estudiante').value = estudiante.id;
      document.getElementById('id-curso-estudiante').value = cursoEstudianteSelect.options[cursoEstudianteSelect.selectedIndex].value;
      document.getElementById('nombre-estudiante').value = estudiante.nombre;
      document.getElementById('edad-estudiante').value = estudiante.edad;
      document.getElementById('nota-estudiante').value = estudiante.nota;
      document.getElementById('curso-estudiante').value = cursos.findIndex(c => c.id === idCurso);

      // Cambiar el título y el botón del formulario
      tituloFormEstudiante.textContent = 'Editar Estudiante';
      document.getElementById('boton-estudiante').textContent = 'Guardar Cambios';
      botonCancelarEstudiante.style.display = 'inline-block';
    }
  }
}

function eliminarEstudiante(e) {
  if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
    const estudianteDiv = e.target.parentElement;
    const idEstudiante = parseInt(estudianteDiv.getAttribute('data-id'));
    const cursoDiv = e.target.closest('.curso');
    const idCurso = parseInt(cursoDiv.getAttribute('data-id'));
    const curso = cursos.find(c => c.id === idCurso);
    if (curso) {
      curso.eliminarEstudiante(idEstudiante);
      mostrarCursos();
    }
  }
}

// Funciones para resetear los formularios
function resetFormularioCurso() {
  formCurso.reset();
  document.getElementById('id-curso').value = '';
  tituloFormCurso.textContent = 'Agregar Curso';
  document.getElementById('boton-curso').textContent = 'Agregar Curso';
  botonCancelarCurso.style.display = 'none';
}

function resetFormularioEstudiante() {
  formEstudiante.reset();
  document.getElementById('id-estudiante').value = '';
  document.getElementById('id-curso-estudiante').value = '';
  tituloFormEstudiante.textContent = 'Agregar Estudiante';
  document.getElementById('boton-estudiante').textContent = 'Agregar Estudiante';
  botonCancelarEstudiante.style.display = 'none';
}

// Inicialización: crear algunos cursos y estudiantes de ejemplo
function inicializarDatos() {
  // Crear cursos
  const cursoJS = new Curso(idCursoActual++, "JavaScript", "Prof. Pérez");
  const cursoHTML = new Curso(idCursoActual++, "HTML y CSS", "Prof. Gómez");
  const cursoPython = new Curso(idCursoActual++, "Python", "Prof. Fernández");
  cursos.push(cursoJS, cursoHTML, cursoPython);

  // Crear estudiantes
  const estudiante1 = new Estudiante(idEstudianteActual++, "Ana", 20, 85);
  const estudiante2 = new Estudiante(idEstudianteActual++, "Juan", 22, 90);
  const estudiante3 = new Estudiante(idEstudianteActual++, "Carlos", 21, 78);
  const estudiante4 = new Estudiante(idEstudianteActual++, "Lucía", 23, 92);

  // Agregar estudiantes a los cursos
  cursoJS.agregarEstudiante(estudiante1);
  cursoJS.agregarEstudiante(estudiante2);
  cursoHTML.agregarEstudiante(estudiante3);
  cursoPython.agregarEstudiante(estudiante4);
}

// Ejecutar la inicialización y mostrar los datos
inicializarDatos();
actualizarCursosSelect();
mostrarCursos();
