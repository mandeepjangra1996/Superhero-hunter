// PUBLIC KEY
// 8958aa025b5644d155fabf46ff68cb31

// PRIVATE KEY
// b53ad7e0285dca9ae135eeda735fce7833f227bd

// MD5 Hash
// 97b0903eaa6d1f87439ab9bd4643602d


let charactersContainer = document.getElementById("characters-container");

// function to fetch data
async function fetchData() {
  const response = await fetch(
    "https://gateway.marvel.com/v1/public/characters?ts=1&apikey=8958aa025b5644d155fabf46ff68cb31&hash=97b0903eaa6d1f87439ab9bd4643602d"
  );
  const data = await response.json();
  return data;
}

// get local favorite characters from local storage
function getStorage() {
  let data = JSON.parse(localStorage.getItem("favorite")) || [];
  return data;
}

fetchData()
  .then((data) => {
    // console.log(getStorage());
    let favoriteData = getStorage();
    let arr = data.data.results;
    charactersContainer.innerHTML = "";

    // iterate over an resultant array and render the output on the screen
    for (let i = 0; i < arr.length; i++) {
      let favorite = "favorite";

      // check character is already favorite or not
      for (let j = 0; j < favoriteData.length; j++) {
        if (arr[i].id == favoriteData[j].id) {
          favorite = "UnFavorite";
          break;
        }
      }

      // creare a character div and append it to the container
      const { id, thumbnail, name } = arr[i];
      let div = document.createElement("div");
      div.classList.add("character-card");
      div.setAttribute("id", id);
      let path = `../cn-superhero-hunter/pages/characterdetails.html#${id}`;
  
      // let path = `../pages/characterdetails.html#${id}`; this path is for development purpose
      div.innerHTML = `
        <img class="poster" src=${thumbnail.path}.jpg alt="">
        <div class="card-body">
          <a href=${path}>${name}</a>
          <input type="button" value=${favorite} id=${id} data-character='{"id": "${id}", "name": "${name}", "path": "${thumbnail.path}"}' onclick="updateFavorite(this)"/>
        </div>
      `;
      charactersContainer.appendChild(div);
    }
  })
  // if any error occured while fetching data from api then display it on console
  .catch((error) => {
    console.error(error);
  });

// search functionality
let searchBtn = document.getElementById("searchBtn");
let searchBox = document.getElementById("searchBox");
let searchResult = document.getElementById("searchResult");

// added an click event on search button
searchBtn.addEventListener("click", () => {
  let query = searchBox.value;
  searchBox.value = "";

  let url = `https://gateway.marvel.com/v1/public/characters?name=${query}&ts=1&apikey=8958aa025b5644d155fabf46ff68cb31&hash=97b0903eaa6d1f87439ab9bd4643602d`;

  // fetch data based on the query provided by user
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data.data.results);
      let result = data.data.results[0];
      const { id, name, thumbnail } = result;

      // get local favorite character list from local storage
      let favoriteData = getStorage();

      let favorite = "favorite";
      // check searched character is already favorite or not
      for (let j = 0; j < favoriteData.length; j++) {
        if (result.id == favoriteData[j].id) {
          favorite = "UnFavorite";
          break;
        }
      }

      searchResult.innerHTML = "";
      let h2 = document.createElement("h2");
      h2.innerText = "search results :";
      searchResult.appendChild(h2);

      // create a chracter and append it to the container div of html
      let div = document.createElement("div");
      div.classList.add("character-card");
      div.setAttribute("id", id);
      let path = `../cn-superhero-hunter/pages/characterdetails.html#${id}`;
      div.innerHTML = `
        <img class="poster" src=${thumbnail.path}.jpg alt="">
        <div class="card-body">
          <a href=${path}>${name}</a>
          <input type="button" value=${favorite} id=${id} data-character='{"id": "${id}", "name": "${name}", "path": "${thumbnail.path}"}' onclick="updateFavorite(this)"/>
        </div>
      `;
      searchResult.appendChild(div);
    })
    // if any error occured while fetching data from api then display it on console
    .catch((error) => {
      console.error(error);
    });
});
