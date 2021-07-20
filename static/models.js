"use strict"

const BASE_URL = 'http://localhost:5000/api'; // BASE_URL never changes so set to const

/************************************************
 * List of Cupcakes: used by UI to show
 * cupcakes list in DOM.
 */

class Cupcake {
  /** returns all cupcakes from cupcakes database.*/ 
  static async fetchAllCupcakes() {
    let response = await axios.get(`${BASE_URL}/cupcakes`);
    let allCupcakes = response.data.cupcakes;
    return allCupcakes;
  }

  /** submits data to database and returns a new cupcake. 
   * { id, flavor, size, rating, image }
  */
  static async createCupcake(flavor, size, rating, image) {
    let response = await axios.post(`${BASE_URL}/cupcakes`, {
      flavor,
      size,
      rating,
      image,
    });

    let cupcake = response.data.cupcake;
    return cupcake;
  }

  /** Takes in a cupcakeId.
   *  Deletes that cupcake from the database.
   *  What am i returning?
  */
  static async deleteCupcake(cupcakeId) {
    return await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
  }
}