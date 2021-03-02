'use-strict';

// list of all products images
let productsImages = [
  './assets/img/bag.jpg',
  './assets/img/banana.jpg',
  './assets/img/bathroom.jpg',
  './assets/img/boots.jpg',
  './assets/img/breakfast.jpg',
  './assets/img/bubblegum.jpg',
  './assets/img/chair.jpg',
  './assets/img/cthulhu.jpg',
  './assets/img/dog-duck.jpg',
  './assets/img/dragon.jpg',
  './assets/img/pen.jpg',
  './assets/img/pet-sweep.jpg',
  './assets/img/scissors.jpg',
  './assets/img/shark.jpg',
  './assets/img/sweep.png',
  './assets/img/tauntaun.jpg',
  './assets/img/unicorn.jpg',
  './assets/img/usb.gif',
  './assets/img/water-can.jpg',
  './assets/img/wine-glass.jpg'
];

// constant to store the result key stored in localStorage
const RESULTS_KEY = 'RESULTS';

// number of image to show at the same time
let numberOfProductsPerPage = 3;

// array contain the index of last products was shown to the user
let lastProductsShown = [];

// array to store instances of the product objects
let productsInstances = [];

// number of rounds
let numberOfRounds = 25;

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

if(loadFromLocalStorage(RESULTS_KEY)){
  // get the stored objects from the localStorage
  productsInstances = loadFromLocalStorage(RESULTS_KEY);
} else {
  // creating instances for each product image
  for(let index = 0; index < productsImages.length; index++){
    new Product(getFileName(productsImages[index]), productsImages[index]);
  }
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
    if((lastProductsShown.length > 0 && lastProductsShown.includes(randomProductIndex)) || newProductsToShow.includes(randomProductIndex)){
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
    imgElement.setAttribute('alt', productsInstances[randomProductIndex].name);
    imageWrapperElement.appendChild(imgElement);
  }
  lastProductsShown = newProductsToShow;
}

// function to handle click on images
function handleClick(event) {
  if(event.target.nodeName === 'IMG'){
    productsInstances[Number(event.target.id)].timesClicked++;
    if(currentRound === numberOfRounds){
      saveInLocalStorage(RESULTS_KEY, productsInstances);
      barChart(productsInstances); // draw the bar chart
      pieChart(productsInstances); // draw the pie chart
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
function showResult(event) {
  event.target.textContent = 'Reset';
  event.target.className += ' red';
  event.target.removeEventListener('click', showResult);
  event.target.addEventListener('click', () => location.reload());
  let totalProductsClicks = totalClicks(productsInstances);
  const resultListElement = document.getElementById('result_list');
  for(let product = 0; product < productsInstances.length; product++){
    const liElement = document.createElement('li');
    resultListElement.appendChild(liElement);
    liElement.textContent = `${productsInstances[product].name}: ${productsInstances[product].timesClicked} votes (${percentage(productsInstances[product].timesClicked, totalProductsClicks)}%), seen: ${productsInstances[product].timesShown} times.`;
  }
}

// function to calculate the total number of clicks for all product
function totalClicks(productsArray) {
  let totalProductsClicks = 0;
  productsArray.map(item => totalProductsClicks += item.timesClicked);
  return totalProductsClicks;
}

// function to calcualte the percentage of votes
function percentage(productVotes, totalVotes) {
  return ((productVotes / totalVotes) * 100).toFixed(1);
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


// function to draw the bar chart
function barChart(objectArray) {
  let ctx = document.getElementById('barChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from(objectArray, product => product.name),
      datasets: [{
        label: '# of Votes',
        data: Array.from(objectArray, product => product.timesClicked),
        backgroundColor: 'hsl(0, 90%, 60%)',
        borderColor: 'hsl(0, 90%, 40%)',
        borderWidth: 1
      },
      {
        label: '# of shows',
        data: Array.from(objectArray, product => product.timesShown),
        backgroundColor: 'hsl(200, 70%, 60%)',
        borderColor: 'hsl(200, 70%, 40%)',
        borderWidth: 1
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Results'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

// function to draw the pie chart
function pieChart(objectArray) {
  let totalProductsClicks = totalClicks(productsInstances);
  let ctx = document.getElementById('pieChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Array.from(objectArray, product => product.name),
      datasets: [{
        data: Array.from(objectArray, product => percentage(product.timesClicked, totalProductsClicks)),
        backgroundColor: Array.from(objectArray, (product, index) => `hsl(${index * 50}, 50%, 55%)`),
        borderColor: Array.from(objectArray, (product, index) => `hsl(${index * 50}, 50%, 30%)`),
        borderWidth: 1
      }]
    },
    options: {
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label: function(tooltipItem, data) {
            let label = `${data.labels[tooltipItem.index]}: ${data.datasets[0].data[tooltipItem.index]} %`;
            console.log();
            return label;
          }
        }
      },
      title: {
        display: true,
        text: 'Results'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}


// function to store items in localStorage
function saveInLocalStorage (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// function to get items from localStorage
function loadFromLocalStorage (key) {
  return JSON.parse(localStorage.getItem(key));
}
