"use strict" // always remember!

let $cupcakesList = $('.cupcakes');
let $cupcakesForm = $('.cupcakes-form');
let $cupcakesSearch = $('.cupcakes-search');

/** Generates and returns HTML markup for a cupcake */
function generateCupcakeHTML(cupcake) {
  return $(`
    <li class="Cupcake" data-cupcakeId=${cupcake.id}>
      <h4>
        ${cupcake.flavor}, 
        ${cupcake.size}, 
        ${cupcake.rating}
      </h4>
      <img src="${cupcake.image}">
      <p>
        <button id="delete-btn" class="btn btn-danger mt-2">Delete Cupcake</button>
      </p>
    </li>`);
}

/** Get and lists all cupcakes in the cupcakes database */
async function getAndShowCupcakes() {
  console.debug('showCupcakes');

  let cupcakes = await Cupcake.fetchAllCupcakes();

  for (let cupcake of cupcakes) {
    let $newCupcake = generateCupcakeHTML(cupcake);
    $cupcakesList.append($newCupcake);
  }
}

/** Handles add cupcake form submission */
$cupcakesForm.on("submit", addCupCake);

/** Submits user inputted form data to create a new Cupcake instance */
async function addCupCake(evt) {
  console.debug('addCupCake');
  evt.preventDefault();
  
  let flavor = $('#cupcake-flavor').val();
  let size = $('#cupcake-size').val();
  let rating = $('#cupcake-rating').val();
  let image = $('#cupcake-image').val();

  let cupcake = await Cupcake.createCupcake(flavor, size, rating, image);

  let newCupcake = generateCupcakeHTML(cupcake);
    $cupcakesList.append(newCupcake);
    $cupcakesForm.trigger("reset");
}

/** Handles searching for cupcake form submission */
$cupcakesSearch.on("submit", searchCupcakeFlavor)

/** Lists all cupcakes in the database that matches the search term */
async function searchCupcakeFlavor(evt) {
  console.debug('searchCupcakeFlavor');
  evt.preventDefault();
  $cupcakesList.empty();

  let term = $('#search-term').val();
  let response = await axios.get(`${BASE_URL}/search?term=${term}`);

  for (let cupcake of response.data.cupcakes) {
    let $newCupcake = generateCupcakeHTML(cupcake);
    $cupcakesList.append($newCupcake);
  }
}

/** Handles clicking on delete cupcake button */
$cupcakesList.on("click", '#delete-btn', deleteCupCake);

/** Deletes the Cupcake instance from the database */
async function deleteCupCake(evt) {
  console.debug('deleteCupCake');
  evt.preventDefault();

  let $cupcake = ($(evt.target).closest('li.Cupcake'))
  let cupcakeId = $cupcake.data('cupcakeid');

  await Cupcake.deleteCupcake(cupcakeId);
  $cupcake.remove();
}

getAndShowCupcakes();