let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const newToyButton = document.querySelector('input[name="submit"]');
  const toyFormContainer = document.querySelector(".container");
  const URL = "http://localhost:3000/toys";
  fetch(URL)
  .then(response=>response.json())
  .then(toys => toys.forEach(toy => {
       showToysCards(toy);
  }))

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  })

  newToyButton.addEventListener('click',(event) => {
    event.preventDefault();
    const newToyName = document.querySelector('input[name="name"]').value;
    const newImgLink = document.querySelector('input[name="image"]').value;
    console.log (newToyName, '      ', newImgLink);
    const data = {
      name: newToyName,
      image: newImgLink,
      likes: 0
    }
    fetch(URL,{
      method:"POST",
      headers:{
          "Content-Type":"application/json",
          "Accept":"application/json"
      },
      body:JSON.stringify(data)         //convert JS object to JSON format
    })
    .then(response => response.json())
    .then(updatedToys => {
      console.log("Toys updated successfully:", showToysCards(updatedToys));   // add new toy into DOM without refreshing. invoking showToysCard function with new lemenet
    })
    .catch(error => {
      console.error("Error updating Toys:", error);
    });
  })
    //<img src="[toy_image_url]" class="toy-avatar" />
});

function showToysCards (toy) {
  const toyCard = document.querySelector("div#toy-collection");
  const h2Tag = document.createElement("h2");
  h2Tag.innerHTML = toy.name;
  toyCard.appendChild(h2Tag);

  const img = document.createElement("img");
  img.src = toy.image;
  img.classList.add("toy-avatar");
  toyCard.appendChild(img);

  const likes = document.createElement("p");
  likes.innerHTML = `${toy.likes} Likes`;
  toyCard.appendChild(likes);
  
  const button = document.createElement("button");
  button.classList.add("like-btn");
  button.id = (toy.id);
  button.innerHTML = "Like ❤️";
  toyCard.appendChild(button);
  button.addEventListener ('click', addLike)
}

function addLike (e) {
  console.log(e.target.id);
  const toyId = e.target.id;
  fetch (`http://localhost:3000/toys/${toyId}`)
  .then(response=>response.json())
  .then(toy => {
    const newLikes = toy.likes + 1;
    const likes = document.getElementById(`${toyId}`).previousElementSibling;
    //const likes = document.querySelector(`#${toyId} + p`);
    likes.textContent = `${newLikes} Likes`;
    const subURL = `http://localhost:3000/toys/${toy.id}`;
    fetch (subURL, {
      method:"PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "id": toyId,
        "likes": newLikes
      })
    })  
   
  });
}