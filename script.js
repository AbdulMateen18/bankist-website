'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const allSections = document.querySelectorAll('.section');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // Function which gives different coordinates with respect to current visible viewport
  // console.log(s1coords);
  console.log('currentScroll X/Y:', window.pageXOffset, window.pageYOffset);

  //scrolling

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation

//performance issues as same copy of function will be created for each event call
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

//   });
// });

// 1. Add event listener to common parent element
// 2. determine what element originated the next

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // by e.target
  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

// tabs.forEach(t=>t.addEventListener('click',()=>console.log('Tab');))

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  // active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // active content area
  tabContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    sibling.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this; //this keyword is set by the bind method which returns a new function
  }
};

// Passing "arguments" into handler

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
//mouse enter can't bubble while mouseover do

//  Sticky Navigation bar

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// Intersection Observer API

// enteries in the argument is the array of threshold
// const obsCallBack = function (enteries, observer) {
//   enteries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, //determines the element with which intersection is to be ibserved (whole viewport in this case)
//   threshold: [0, 0.2], // percentage of root at which intersection is to be ibserved
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions); //accepts callback function and abject respectively
// observer.observe(section1); // Section1 is the target element which when intersected by root, is observed

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (enteries) {
  const [entry] = enteries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// reveal sections
const revealSection = function (enteries, observer) {
  const [entry] = enteries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY LOADING IMGS=> FOR IMAGE OPTIMIZATION

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (enteries, observer) {
  const [entry] = enteries;
  if (!entry.isIntersecting) return;
  //Replace src with data src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Silder
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSLide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSLide(curSlide);
    activateDot(curSlide);
  };
  // Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSLide(curSlide);
    activateDot(curSlide);
  };
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Keyboard press
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });

  // Dots implementation
  const creatDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSLide(slide);
      activateDot(slide);
    }
  });

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    const selector = `.dots__dot[data-slide="${slide}"]`;
    document.querySelector(selector).classList.add('dots__dot--active');
  };
  const init = function () {
    goToSLide(0);
    creatDots();
    activateDot(0);
  };
  init();
};
slider();
//////////////////////////////////////////
/*
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

//Following methods returns a HTMLCollection which is different from nodeList such that it is a live collection and is updated when an element is changed.
//1)
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
//2)
document.getElementsByClassName('btn');

//Creating and inserting HTMl elements

// insertAdjacentHTML()
const msg = document.createElement('div'); //It is not part of DOM , it's just a Object
msg.classList.add('cookie-message');
// msg.textContent = 'We use cookies to improve functionality andanaytics';
msg.innerHTML =
  'We use cookies to improve functionality andanaytics. <button class ="btn btn--close-cookie">Got it!</button>';
header.prepend(msg); //prepends adds the element as the first child of caller
// header.append(msg); //last child
// header.append(msg.cloneNode(true));
header.before(msg); //before caller as a sibling
header.after(msg); //after caller as a sibling
// Remove

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    msg.remove();
  });

// Styles
msg.style.backgroundColor = '#37383d';
msg.style.width = '120%'; //inline-styles
//cannot read styled(except only which we wrote)
console.log(getComputedStyle(msg).color);
msg.style.height =
  Number.parseFloat(getComputedStyle(msg).height, 10) + 30 + 'px';

// CSS custom properties/Variables
document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
//can read these attributes directly but only which are defined, for other attributes see following
// console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

// Data attributes
// starts with data
console.log(logo.dataset.versionNumber);
*/
/*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); // Function which gives different coordinates with respect to current visible viewport
  // console.log(s1coords);
  console.log('currentScroll X/Y:', window.pageXOffset, window.pageYOffset);

  //scrolling

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// event is a signal generated by DOM which tells something has happened, events always happend no matter we listen to it or not
// see mdn reference for events
const h1 = document.querySelector('h1');
const h1Alert = function (e) {
  alert('Youre readinh h1 heading');
  // h1.removeEventListener('mouseenter',h1Alert);
};
h1.addEventListener('mouseenter', h1Alert);

setTimeout(() => h1.removeEventListener('mouseenter', h1Alert), 4000);
// h1.onmouseenter() -->works same
//  addEventListener has the advantage that it can be called by diferent functions and can remove the event handler

// Bubling and Event Propagation

// addevenetlistener happens at bubling phase
// if we pass third argument to addEventListener it will work in capturing phase
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // stop propagation
  // e.stopPropagation()
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
  }
  // ,true
);

// DOM Traversing

const h1 = document.querySelector('h1');
// going downward:child

console.log(h1.querySelectorAll('.highlight'));
// To select direct child
console.log(h1.childNodes);
console.log(h1.children); // Live collection
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upward: Parents
console.log(h1.parentNode); //direct Parent
console.log(h1.parentElement);

// Not a direct parent
h1.closest('.header').style.background = 'var(--gradient-secondary)'; //closest parent element of caller
h1.closest('h1').style.background = 'var(--gradient-primary)';

// sideways: Siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);
// all siblings
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('Html parsed and DOM Tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Fully loaded page', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = 'Are you sure?';
}); // works only on sticky activation
