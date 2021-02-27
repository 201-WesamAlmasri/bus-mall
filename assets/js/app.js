'use-strict';

// list of all products images
let productsImages = [
  '/assets/img/bag.jpg',
  '/assets/img/banana.jpg',
  '/assets/img/bathroom.jpg',
  '/assets/img/boots.jpg',
  '/assets/img/breakfast.jpg',
  '/assets/img/bubblegum.jpg',
  '/assets/img/chair.jpg',
  '/assets/img/cthulhu.jpg',
  '/assets/img/dog-duck.jpg',
  '/assets/img/dragon.jpg',
  '/assets/img/pen.jpg',
  '/assets/img/pet-sweep.jpg',
  '/assets/img/scissors.jpg',
  '/assets/img/shark.jpg',
  '/assets/img/sweep.png',
  '/assets/img/tauntaun.jpg',
  '/assets/img/unicorn.jpg',
  '/assets/img/usb.gif',
  '/assets/img/water-can.jpg',
  '/assets/img/wine-glass.jpg'
];

// number of image to show at the same time
let numberOfProductsPerPage = 3;

// array contain the index of last products was shown to the user
let lastProductsShown = [];

// array to store instances of the product objects
let productsInstances = [];

// number of rounds
let numberOfRounds = 10;

// number of current round
let currentRound = 0;

// object constructor function
function Product(name, img) {
  this.name = name;
  this.img = img;
  this.timesShown = 0;
  this.timesClicked = 0;
}

// creating instances for each product image and push it to instances array
for(let index = 0; index < productsImages.length; index++){
  productsInstances.push(new Product(productsImages[index].split('/')[3].split('.')[0], productsImages[index]));
}

// function to remove all child nodes and events listeners for an element
function removeAllEventsAndChildNodes(parent) {
  while (parent.firstChild) {
    parent.firstChild.firstChild.removeEventListener('click', handleClick);
    parent.removeChild(parent.firstChild);
  }
}

// function to remove all events listeners for an parent's element children
function removeAllEventsForChildNodes(parent) {
  for (let child = 0; child < parent.childNodes.length; child++) {
    console.log(parent.childNodes[child].firstChild);
    parent.childNodes[child].firstChild.removeEventListener('click', handleClick);
  }
}

// get the parent (container element) of the images
const productsContainerElement = document.getElementById('products_container');

// function to generate random images and show them in the web page
function getRandomProducts() {
  currentRound++;
  // remove all previous images and their event listener
  removeAllEventsAndChildNodes(productsContainerElement);
  let newProductsToShow = [];
  for(let i = 0; i < numberOfProductsPerPage; i++){
    let randomProductIndex = Math.floor(Math.random() * productsImages.length);
    if((lastProductsShown.length > 0 && lastProductsShown[i] === randomProductIndex ) || newProductsToShow.includes(randomProductIndex)){
      i--;
      continue;
    }
    newProductsToShow.push(randomProductIndex);
    productsInstances[randomProductIndex].timesShown++;
    // creating element inside html page
    const imageWrapperElement = document.createElement('div');
    imageWrapperElement.setAttribute('class', 'img_wrapper');
    productsContainerElement.appendChild(imageWrapperElement);
    const imgElement = document.createElement('img');
    imgElement.setAttribute('id', randomProductIndex);
    imgElement.setAttribute('src', productsInstances[randomProductIndex].img);
    imageWrapperElement.appendChild(imgElement);
    imgElement.addEventListener('click', handleClick); // event listener on click
  }
  lastProductsShown = newProductsToShow;
}

// function to handle click on images
function handleClick(event) {
  productsInstances[Number(event.target.id)].timesClicked++;
  if(currentRound === numberOfRounds){
    const resultBtn = document.getElementById('view_result_btn');
    resultBtn.setAttribute('class', 'show');
    resultBtn.addEventListener('click', showResult);
    removeAllEventsForChildNodes(productsContainerElement);
    return;
  }
  getRandomProducts();
}

// function to show the result on the web page
function showResult() {
  const resultListElement = document.getElementById('result_list');
  for(let product = 0; product < productsInstances.length; product++){
    const liElement = document.createElement('li');
    resultListElement.appendChild(liElement);
    liElement.textContent = `${productsInstances[product].name}: ${productsInstances[product].timesClicked} votes, seen: ${productsInstances[product].timesShown} times.`;
  }
}

// generate random products for first time
getRandomProducts();
