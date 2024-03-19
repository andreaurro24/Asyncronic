const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

function CoctelAlAzar() {
    var loader = document.getElementById("loader");
    loader.style.display = "block"; // Mostrar el loader

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const coctel = data.drinks[0];
            mostrarCoctel(coctel);
            loader.style.display = "none"; // Ocultar el loader una vez que se obtienen los datos
        })
        .catch(error => {
            console.error('Error al obtener coctel:', error);
            loader.style.display = "none"; // Ocultar el loader en caso de error
        });
}

// Función para mostrar la información del coctel en la página
function mostrarCoctel(coctel) {
    document.getElementById('coctelId').textContent = coctel.idDrink;
    document.getElementById('coctelNombre').textContent = coctel.strDrink;
    document.getElementById('coctelCategoria').textContent = coctel.strCategory;
    document.getElementById('coctelInstrucciones').textContent = coctel.strInstructions;
    document.getElementById('coctelImagen').src = coctel.strDrinkThumb;

    // Limpiar lista de ingredientes antes de agregar nuevos
    const ingredientesElement = document.getElementById('coctelIngredientes');
    ingredientesElement.innerHTML = '';
    
    // Mostrar los ingredientes
    for (let i = 1; i <= 15; i++) {
        const ingrediente = coctel[`strIngredient${i}`];
        if (ingrediente) {
            const medida = coctel[`strMeasure${i}`];
            const ingredienteHTML = `<li>${medida} ${ingrediente}</li>`;
            ingredientesElement.innerHTML += ingredienteHTML;
        } else {
            // Si no hay más ingredientes, salimos del loop
            break;
        }
    }
}

// Función para guardar el coctel actual como favorito
function guardarFavorito() {
    const coctelId = document.getElementById('coctelId').textContent;
    const coctelNombre = document.getElementById('coctelNombre').textContent;

    // Crear un objeto con la información del coctel
    const coctelFavorito = {
        id: coctelId,
        nombre: coctelNombre
    };

    // Obtener la lista de cócteles favoritos del localStorage
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    // Agregar el cóctel actual a la lista de favoritos
    favoritos.push(coctelFavorito);

    // Guardar la lista de favoritos en el localStorage
    localStorage.setItem('favoritos', JSON.stringify(favoritos));

    // Actualizar la lista de favoritos en el HTML
    mostrarFavoritos();
}

// Función para guardar todos los cócteles favoritos en el localStorage
function guardarTodo() {
    const listaFavoritos = document.getElementById('listaFavoritos');
    const favoritosListItems = listaFavoritos.getElementsByTagName('li');

    // Crear una lista de favoritos con ID y nombre
    const favoritos = [];
    for (let i = 0; i < favoritosListItems.length; i++) {
        const favorito = favoritosListItems[i].textContent;
        const [nombre, id] = favorito.split('(ID: ');
        favoritos.push({ id: id.slice(0, -1), nombre: nombre.trim() });
    }

    // Guardar la lista de favoritos en el localStorage
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

// Función para mostrar la lista de favoritos
function mostrarFavoritos() {
    const listaFavoritos = document.getElementById('listaFavoritos');
    listaFavoritos.innerHTML = '';

    // Obtener la lista de favoritos del localStorage
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    // Mostrar los favoritos en la lista
    favoritos.forEach(favorito => {
        const favoritoElement = document.createElement('li');
        favoritoElement.textContent = `${favorito.nombre} (ID: ${favorito.id})`;
        favoritoElement.addEventListener('click', () => {
            obtenerDetalleFavorito(favorito.id);
        });
        listaFavoritos.appendChild(favoritoElement);
    });
}

// Función para obtener los detalles de un coctel favorito
function obtenerDetalleFavorito(coctelId) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${coctelId}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const coctel = data.drinks[0];
            mostrarCoctel(coctel);
        })
        .catch(error => console.error('Error al obtener detalle del coctel:', error));
}

// Función para eliminar todos los favoritos del localStorage
function eliminarFavoritos() {
    localStorage.removeItem('favoritos');
    mostrarFavoritos();
}
