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
  productsInstances.push(this);
}

// creating instances for each product image
for(let index = 0; index < productsImages.length; index++){
  new Product(getFileName(productsImages[index]), productsImages[index]);
}

// functio to get the image file name from url (relative or absolute)
function getFileName(url) {
  return url.split('/')[url.split('/').length - 1].split('.')[0];
}

// get the parent (container element) of the images and add event listener
const productsContainerElement = document.getElementById('products_container');
productsContainerElement.addEventListener('click', handleClick); // event listener on click

// function to generate random images and show them in the web page
function renderRandomProducts() {
  currentRound++;
  // remove all previous images
  removeAllChildNodes(productsContainerElement);
  let newProductsToShow = [];
  for(let i = 0; i < numberOfProductsPerPage; i++){
    let randomProductIndex = getRandomIndex(productsImages);
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
  }
  lastProductsShown = newProductsToShow;
}

// function to handle click on images
function handleClick(event) {
  console.log(event.target);
  if(event.target.nodeName === 'IMG'){
    productsInstances[Number(event.target.id)].timesClicked++;
    if(currentRound === numberOfRounds){
      const resultBtn = document.getElementById('view_result_btn');
      resultBtn.setAttribute('class', 'show');
      resultBtn.addEventListener('click', showResult);
      productsContainerElement.removeEventListener('click', handleClick);
      return;
    }
    renderRandomProducts();
  }
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

// function to generate a random index number for the image
function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

// function to remove all child nodes and events listeners for an element
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// generate random products for first time
renderRandomProducts();
