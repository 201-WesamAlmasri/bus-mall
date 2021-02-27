'use-strict';

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
let numberOfProducts = 3;

// array contain the index of last products was shown to the user
let lastProductsShown = [];

function Product(name, img) {
  this.name = name;
  this.img = img;
  this.timesShown = 0;
}

// function to generate random images and show them in the web page
function getRandomProducts() {
  const productsContainerElement = document.getElementById('products_container');
  let newProductsToShow = [];
  for(let i = 0; i < numberOfProducts; i++){
    let randomProductIndex = Math.floor(Math.random() * productsImages.length);
    if((lastProductsShown.length > 0 && lastProductsShown[i] === randomProductIndex ) || newProductsToShow.includes(randomProductIndex)){
      i--;
      continue;
    }
    newProductsToShow.push(randomProductIndex);
    // creating element inside html page
    const imageWrapperElement = document.createElement('div');
    imageWrapperElement.setAttribute('class', 'img_wrapper');
    productsContainerElement.appendChild(imageWrapperElement);
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', productsImages[randomProductIndex]);
    imageWrapperElement.appendChild(imgElement);
  }
  lastProductsShown = newProductsToShow;
}

getRandomProducts();
