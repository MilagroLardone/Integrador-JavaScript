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

  // obtenerPromedio() {
  //   if (this.estudiantes.length === 0) return 0; // No hay estudiantes, promedio es 0
  //   const sumaNotas = this.estudiantes.reduce((suma, estudiante) => suma + estudiante.nota, 0);
  //   return (sumaNotas / this.estudiantes.length).toFixed(2); // Promedio con dos decimales
  // }

  editar(nombre, profesor) {
    this.nombre = nombre;
    this.profesor = profesor;
  }

  eliminarEstudiante(id) {
    this.estudiantes = this.estudiantes.filter(est => est.id !== id);
  }
}

var cursosGuardados = JSON.parse(localStorage.getItem("CursosGuardados")) || []


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
const botonGuardarCambios = document.getElementById('guardar-cambios');
const botonCancelarCurso = document.getElementById('cancelar-curso');
const botonCancelarEstudiante = document.getElementById('cancelar-estudiante');
const botonGuardarCambiosEstudiante = document.getElementById('guardar-estudiante');
// Evento para cancelar edición de curso
botonCancelarCurso.addEventListener('click', () => {
  resetFormularioCurso();
});

// Evento para cancelar edición de estudiante
botonCancelarEstudiante.addEventListener('click', () => {
  resetFormularioEstudiante();
});

// Títulos de formularios
const tituloFormCurso = document.getElementById('titulo-form-curso');
const tituloFormEstudiante = document.getElementById('titulo-form-estudiante');




// Pedimos el cuerpo donde mostramos nuestros cursos y estudiantes
const cuerpo = document.querySelector("#lista-cursos");


// Validar el formulario de curso
function AgregarCurso() {
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
      const nuevoCurso = new Curso(idCursoActual++, nombreCurso, profesorCurso);
      cursosGuardados.push(nuevoCurso)
      localStorage.setItem('CursosGuardados', JSON.stringify(cursosGuardados));
    }
    ;
    // Limpiar formulario
    formCurso.reset();

    // Actualizar la lista de cursos en el select
    actualizarCursosSelect();


    // Vaciamos el cuerpo donde estaban los cursos y estudiantes viejos y volvemos Mostrar los cursos actualizados
    cuerpo.innerHTML = "";
    mostrarCursosDesdeLocalStorage();
  }

}

// Validar el formulario de estudiante
function agregarEstudiante() {

  const nombreEstudiante = document.getElementById('nombre-estudiante').value;
  const edadEstudiante = parseInt(document.getElementById('edad-estudiante').value);
  const notaEstudiante = parseFloat(document.getElementById('nota-estudiante').value);
  const cursoIndex = cursoEstudianteSelect.value;
  console.log(cursoIndex)
  var bandera = true;
  var bandera1 = true;
  var bandera2 = true;

  if (nombreEstudiante == "") {
    alert('El nombre del estudiante no puede estar vacío.');
    bandera = false
  }

  if (edadEstudiante <= 0 || edadEstudiante.toString() == "") {
    alert("la edad debe ser un numero positivo")
    bandera1 = false
  }

  if (notaEstudiante < 0 || notaEstudiante > 10 || notaEstudiante.toString() == "") {
    alert('La nota debe estar entre 0 y 10.');
    bandera2 = false
  }
  const idEstudiante = document.getElementById('id-estudiante').value;

  if (bandera == true && bandera1 == true && bandera2 == true) {

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

      // Buscar el curso por su índice (cursoIndex es el índice del select)
      const cursoSeleccionado = cursosGuardados[cursoIndex];
      console.log(cursosGuardados[cursoIndex])
      // Verificar si el curso tiene una lista de estudiantes, si no, inicializarla
      if (!cursoSeleccionado.estudiantes) {
        cursoSeleccionado.estudiantes = [];
      }

      // Agregar el nuevo estudiante al curso
      cursoSeleccionado.estudiantes.push(nuevoEstudiante);

      // Guardar la nueva lista de cursos en el localStorage
      localStorage.setItem('CursosGuardados', JSON.stringify(cursosGuardados));
    }

    // Limpiar formulario
    formEstudiante.reset();

    // Vaciamos el cuerpo donde estaban los cursos y estudiantes viejos y volvemos Mostrar los cursos actualizados
    cuerpo.innerHTML = "";
    mostrarCursosDesdeLocalStorage();
  }
}

// Función para actualizar el select de cursos
function actualizarCursosSelect() {
  cursoEstudianteSelect.innerHTML = '';
  let opciones = "";
  cursosGuardados.forEach((cursoGuardado, index) => {
    opciones += `
       <option value="${index}">${cursoGuardado.nombre}</option>
     `
  });
  console.log(opciones)
  cursoEstudianteSelect.innerHTML = opciones
}
actualizarCursosSelect();

// Mostrar cursos desde LocalStorage
function mostrarCursosDesdeLocalStorage() {

  if (cursosGuardados && cursosGuardados.length > 0) {
    let sumaPromedios = 0;
    let totalCursos = 0;

    cursosGuardados.forEach(cursoGuardado => {
      let curso = new Curso(cursoGuardado.id, cursoGuardado.nombre, cursoGuardado.profesor, cursoGuardado.estudiantes);
      
      let listaEstudiantes = Array.isArray(cursoGuardado.estudiantes)
        ? cursoGuardado.estudiantes.map(est => `
        <div class="estudiante" data-id="${est.id}">
           ${est.nombre} (${est.edad} años) - Nota: ${est.nota}
          <button class="editar-estudiante" onClick="editarEstudiante(${cursoGuardado.id}, ${est.id})">Editar</button>
          <button class="eliminar-estudiante" onClick="EliminarEstudiantes(${cursoGuardado.id}, ${est.id})">Eliminar</button>
        </div>
        `).join('')
        : 'No hay estudiantes inscritos';

      // Calcular el promedio del curso
      

      // Añadir el curso y su lista de estudiantes al cuerpo
      cuerpo.innerHTML += ` 
      <div id="curso-${curso.id}">
        <h3>Curso: ${cursoGuardado.nombre} (Profesor: ${cursoGuardado.profesor})</h3>
        <button class="editar-curso" onClick="editarCurso(${cursoGuardado.id})">Editar Curso</button>
        <button class="eliminar-curso" onClick="eliminarCurso(${cursoGuardado.id})">Eliminar Curso</button>
        <p><strong>Promedio del Curso:</strong> ${obtenerPromedio(cursoGuardado.estudiantes).toFixed(2)}</p>
        <div class="estudiantes"> 
          <strong>Estudiantes:</strong><br>
          ${listaEstudiantes}
        </div>
      </div>
      `;
    });

    //Calcular el promedio total de todos los cursos
    const promedioTotal = (sumaPromedios / cursosGuardados.length).toFixed(2);

    //Mostrar el promedio total de todos los cursos
    cuerpo.innerHTML += `
    <div>
      <h3>Promedio Total de Todos los Cursos: ${promedioTotal}</h3>
    </div>
  `;
  } else {
    console.log('No hay cursos en localStorage'); // Indica que no hay cursos guardados
  }
}

// Función para calcular el promedio de las notas de los estudiantes
function obtenerPromedio(estudiantes) {
  if (estudiantes.length === 0) return 0; // Si no hay estudiantes, el promedio es 0
  let sumaNotas = estudiantes.reduce((suma, estudiante) => suma + estudiante.nota, 0);
  return sumaNotas / estudiantes.length; // Retorna el promedio de las notas
}

mostrarCursosDesdeLocalStorage();  // Mostrar cursos desde LocalStorage


function EliminarEstudiantes(idCurso, idEstudiante) {
  // Buscar el curso correspondiente
  const curso = cursosGuardados.find(c => c.id === idCurso);

  if (curso) {
    // Filtrar a los estudiantes, eliminando el que tiene el id correspondiente
    curso.estudiantes = curso.estudiantes.filter(est => est.id !== idEstudiante);

    // Guardar nuevamente en el localStorage
    localStorage.setItem("CursosGuardados", JSON.stringify(cursosGuardados));

    // Eliminar el estudiante del DOM directamente
    const estudianteDiv = document.querySelector(`.estudiante[data-id="${idEstudiante}"]`);
    if (estudianteDiv) {
      estudianteDiv.remove();  // Elimina el elemento directamente del DOM
    }

  } else {
    console.error('Curso no encontrado');
  }
}

// Funciones para eliminar cursos
function eliminarCurso(idCurso) {
  if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
    const cursoActualizado = cursosGuardados.filter(c => c.id !== idCurso);
    localStorage.setItem("CursosGuardados", JSON.stringify(cursoActualizado));

    // Eliminar el curso del DOM dinámicamente
    const cursoElemento = document.querySelector(`#curso-${idCurso}`);
    if (cursoElemento) {
      cursoElemento.remove(); // Elimina el elemento del curso de la página
    }
  }
}

// Funciones para EDITAR cursos
function editarCurso(idCurso) {
  const cursoEditado = cursosGuardados.find(c => c.id === idCurso);

  document.getElementById('id-curso').value = cursoEditado.id;
  document.getElementById('nombre-curso').value = cursoEditado.nombre;
  document.getElementById('profesor-curso').value = cursoEditado.profesor;

  tituloFormCurso.textContent = 'Editar Curso';
  document.getElementById('boton-curso').style.display = 'none';
  botonGuardarCambios.style.display = 'inline-block';
  botonCancelarCurso.style.display = 'inline-block';


  botonGuardarCambios.onclick = function () {
    // Obtener los valores actualizados del formulario
    const nombreCursoActualizado = document.getElementById('nombre-curso').value;
    const profesorCursoActualizado = document.getElementById('profesor-curso').value;

    // Actualizar los datos del curso en el array
    cursoEditado.nombre = nombreCursoActualizado;
    cursoEditado.profesor = profesorCursoActualizado;

    // Actualizar localStorage con los cursos editados
    localStorage.setItem('CursosGuardados', JSON.stringify(cursosGuardados));


    // Limpiar el formulario y restaurar su estado original
    formCurso.reset();
    tituloFormCurso.textContent = 'Agregar Nuevo Curso';
    document.getElementById('boton-curso').style.display = 'inline-block';
    botonGuardarCambios.style.display = 'none';
    botonCancelarCurso.style.display = 'none';

    // Actualizar la vista con los cursos editados
    cuerpo.innerHTML = "";
    mostrarCursosDesdeLocalStorage();
  }
}

function editarEstudiante(idCurso, idEstudiante) {

  // Buscar el curso correspondiente
  const curso = cursosGuardados.find(c => c.id === idCurso);

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
      document.getElementById('boton-estudiante').style.display = 'none';
      botonCancelarEstudiante.style.display = 'inline-block';
      botonGuardarCambiosEstudiante.style.display = 'inline-block';

      botonGuardarCambiosEstudiante.onclick = function () {
        const nombreEstudiante = document.getElementById('nombre-estudiante').value;
        const edadEstudiante = parseInt(document.getElementById('edad-estudiante').value);
        const notaEstudiante = parseFloat(document.getElementById('nota-estudiante').value);

        // Actualizar los datos del estudiante
        estudiante.nombre = nombreEstudiante;
        estudiante.edad = edadEstudiante;
        estudiante.nota = notaEstudiante;

        // Guardar la nueva lista de cursos en el localStorage
        localStorage.setItem('CursosGuardados', JSON.stringify(cursosGuardados));

        // Limpiar el formulario y restaurar su estado original
        formEstudiante.reset();
        tituloFormEstudiante.textContent = 'Agregar Nuevo Estudiante';
        document.getElementById('boton-estudiante').style.display = 'inline-block'; // Mostrar el botón de agregar
        botonGuardarCambiosEstudiante.style.display = 'none'; // Ocultar botón de guardar cambios
        botonCancelarEstudiante.style.display = 'none'; // Ocultar botón de cancelar

        // Vaciamos el cuerpo donde estaban los cursos y estudiantes viejos y volvemos a mostrar los cursos actualizados
        cuerpo.innerHTML = "";
        mostrarCursosDesdeLocalStorage();
      }
    }
  }
}

function buscarEstudiante() {
  const busqueda = document.getElementById('busqueda-estudiante').value.toLowerCase();
  listaCursos.innerHTML = '';

  cursosGuardados.forEach(curso => {
    const estudiantesFiltrados = curso.estudiantes ? curso.estudiantes.filter(est => est.nombre.toLowerCase().includes(busqueda)) : [];

    if (estudiantesFiltrados.length > 0) {
      let cursoDiv = document.createElement('div');
      cursoDiv.classList.add('curso');
      cursoDiv.setAttribute('data-id', curso.id);
      cursoDiv.innerHTML = `
        <h3>Curso: ${curso.nombre} (Profesor: ${curso.profesor})</h3>
        <p><strong>Promedio:</strong> ${curso.estudiantes.length > 0 ? (curso.estudiantes.reduce((total, est) => total + est.nota, 0) / curso.estudiantes.length).toFixed(2) : 'N/A'}</p>
        <div class="estudiantes">
          <strong>Estudiantes:</strong><br>
          ${estudiantesFiltrados.map(est => `
            <div class="estudiante" data-id="${est.id}">
              ${est.nombre} (${est.edad} años) - Nota: ${est.nota}
              <button class="editar-estudiante" onClick="editarEstudiante(${curso.id}, ${est.id})">Editar</button>
              <button class="eliminar-estudiante" onClick="EliminarEstudiantes(${curso.id}, ${est.id})">Eliminar</button>
            </div>
          `).join('')}
        </div>
      `;
      listaCursos.appendChild(cursoDiv);
    }
  });
}

// Función para ordenar estudiantes por nota
function ordenarPorNota() {
  listaCursos.innerHTML = '';
  cursosGuardados.forEach(curso => {
    // Ordenar estudiantes por nota de mayor a menor
    curso.estudiantes.sort((a, b) => b.nota - a.nota);

    let cursoDiv = document.createElement('div');
    cursoDiv.classList.add('curso');
    cursoDiv.setAttribute('data-id', curso.id);


    let listaEstudiantes = Array.isArray(curso.estudiantes)
    ? curso.estudiantes.map(est => `
    <div class="estudiante" data-id="${est.id}">
       ${est.nombre} (${est.edad} años) - Nota: ${est.nota}
      <button class="editar-estudiante" onClick="editarEstudiante(${curso.id}, ${est.id})">Editar</button>
      <button class="eliminar-estudiante" onClick="EliminarEstudiantes(${curso.id}, ${est.id})">Eliminar</button>
    </div>
    `).join('')
    : 'No hay estudiantes inscritos';



    cuerpo.innerHTML += ` 
      <div id="curso-${curso.id}">
        <h3>Curso: ${curso.nombre} (Profesor: ${curso.profesor})</h3>
        <button class="editar-curso" onClick="editarCurso(${curso.id})">Editar Curso</button>
        <button class="eliminar-curso" onClick="eliminarCurso(${curso.id})">Eliminar Curso</button>
        <p><strong>Promedio del Curso:</strong> ${promedioCurso.toFixed(2)}</p>
        <div class="estudiantes"> 
          <strong>Estudiantes:</strong><br>
          ${listaEstudiantes}
        </div>
      </div>
      `;

    listaCursos.appendChild(cursoDiv);
  });

  // Añadir event listeners nuevamente después de mostrar los estudiantes
  document.querySelectorAll('.editar-estudiante').forEach(btn => {
    btn.addEventListener('click', editarEstudiante);
  });
  document.querySelectorAll('.eliminar-estudiante').forEach(btn => {
    btn.addEventListener('click', eliminarEstudiante);
  });
}































// Mostrar los errores debajo del formulario
// function mostrarErrores(errores, idElementoError) {
//   const divErrores = document.getElementById(idElementoError);
//   divErrores.innerHTML = errores.join('<br>');
//   divErrores.style.display = 'block';
// }

// Ocultar mensajes de error
// function ocultarErrores(idElementoError) {
//   const divErrores = document.getElementById(idElementoError);
//   divErrores.innerHTML = '';
//   divErrores.style.display = 'none';
// }

// let option = document.createElement('option');
// option.value = index;
// option.textContent = curso.nombre;
// cursoEstudianteSelect.appendChild(option);


//     listaCursos.appendChild(cursoDiv);
//   });

//   // Añadir event listeners para botones de cursos
//   document.querySelectorAll('.editar-curso').forEach(btn => {
//     btn.addEventListener('click', editarCurso);
//   });
//   document.querySelectorAll('.eliminar-curso').forEach(btn => {
//     btn.addEventListener('click', eliminarCurso);
//   });

//   // Añadir event listeners para botones de estudiantes
//   document.querySelectorAll('.editar-estudiante').forEach(btn => {
//     btn.addEventListener('click', editarEstudiante);
//   });
//   document.querySelectorAll('.eliminar-estudiante').forEach(btn => {
//     btn.addEventListener('click', eliminarEstudiante);
//   });
// }



























// function ordenarPorEdad() {
//   cursos.forEach(curso => {
//     curso.estudiantes.sort((a, b) => a.edad - b.edad);
//   });
//   mostrarCursos();
// }


// // Añadir evento de búsqueda
// document.getElementById('busqueda-estudiante').addEventListener('input', buscarEstudiante);

// // Actualizar los cursos y estudiantes después de aplicar filtros y orden
// function mostrarCursos() {
//   listaCursos.innerHTML = '';
//   cursos.forEach((curso) => {
//     let cursoDiv = document.createElement('div');
//     cursoDiv.classList.add('curso');
//     cursoDiv.setAttribute('data-id', curso.id);

//     cursoDiv.innerHTML = `
//       <h3>Curso: ${curso.nombre} (Profesor: ${curso.profesor})</h3>
//       <button class="editar-curso">Editar Curso</button>
//       <button class="eliminar-curso">Eliminar Curso</button>
//       <p><strong>Promedio:</strong> ${curso.obtenerPromedio()}</p>
//       <div class="estudiantes">
//         <strong>Estudiantes:</strong><br>
//         ${curso.listarEstudiantes()}
//       </div>
//     `;

//     listaCursos.appendChild(cursoDiv);
//   });

//   // Añadir event listeners para botones de edición de cursos
//   document.querySelectorAll('.editar-curso').forEach(btn => {
//     btn.addEventListener('click', editarCurso);
//   });

//   // Añadir event listeners para botones de eliminación de cursos
//   document.querySelectorAll('.eliminar-curso').forEach(btn => {
//     btn.addEventListener('click', eliminarCurso);
//   });

//   // Añadir event listeners para botones de edición de estudiantes
//   document.querySelectorAll('.editar-estudiante').forEach(btn => {
//     btn.addEventListener('click', editarEstudiante);
//   });

//   // Añadir event listeners para botones de eliminación de estudiantes
//   document.querySelectorAll('.eliminar-estudiante').forEach(btn => {
//     btn.addEventListener('click', eliminarEstudiante);
//   });
// }


// // Funciones para resetear los formularios
// function resetFormularioCurso() {
//   formCurso.reset();
//   document.getElementById('id-curso').value = ''; // Limpiar el id oculto
//   tituloFormCurso.textContent = 'Agregar Curso';
//   document.getElementById('boton-curso').textContent = 'Agregar Curso';
//   botonCancelarCurso.style.display = 'none';
// }

// function resetFormularioEstudiante() {
//   formEstudiante.reset();
//   document.getElementById('id-estudiante').value = ''; // Limpiar el id oculto
//   tituloFormEstudiante.textContent = 'Agregar Estudiante';
//   document.getElementById('boton-estudiante').textContent = 'Agregar Estudiante';
//   botonCancelarEstudiante.style.display = 'none';
// }


// // Inicialización: crear algunos cursos y estudiantes de ejemplo
// function inicializarDatos() {
//   // Crear cursos
//   const cursoJS = new Curso(idCursoActual++, "JavaScript", "Prof. Pérez");
//   const cursoHTML = new Curso(idCursoActual++, "HTML y CSS", "Prof. Gómez");
//   const cursoPython = new Curso(idCursoActual++, "Python", "Prof. Fernández");
//   cursos.push(cursoJS, cursoHTML, cursoPython);

//   // Crear estudiantes
//   const estudiante1 = new Estudiante(idEstudianteActual++, "Ana", 20, 85);
//   const estudiante2 = new Estudiante(idEstudianteActual++, "Juan", 22, 90);
//   const estudiante3 = new Estudiante(idEstudianteActual++, "Carlos", 21, 78);
//   const estudiante4 = new Estudiante(idEstudianteActual++, "Lucía", 23, 92);

//   // Agregar estudiantes a los cursos
//   cursoJS.agregarEstudiante(estudiante1);
//   cursoJS.agregarEstudiante(estudiante2);
//   cursoHTML.agregarEstudiante(estudiante3);
//   cursoPython.agregarEstudiante(estudiante4);
// }
// function inicializarDatos() {


//   // actualizarCursosSelect();
//   // mostrarCursos();
// }
// inicializarDatos()

// // Ejecutar la inicialización y mostrar los datos
// // inicializarDatos();
// // actualizarCursosSelect();
// // mostrarCursos();
