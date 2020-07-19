// Init swiper slider
const swiper = new Swiper('.swiper-container', {
  speed: 1000,
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true,
  on: {
    touchEnd: function(){
      console.log(swiper.realIndex);
    },
    slidePrevTransitionEnd: function(swiper){
      let photosMain = document.querySelector('.photo_main');
      changePhotos(photosMain, 'next');

      let photosLeft = document.querySelector('.photo_left');
      changePhotos(photosLeft, 'next');

      let photosRight = document.querySelector('.photo_right');
      changePhotos(photosRight, 'next');
    },
    slideNextTransitionEnd: function(swiper){
      let photosMain = document.querySelector('.photo_main');
      changePhotos(photosMain, 'prev');

      let photosLeft = document.querySelector('.photo_left');
      changePhotos(photosLeft, 'prev');

      let photosRight = document.querySelector('.photo_right');
      changePhotos(photosRight, 'prev');
    },
  }
});


function changePhotos(photoContainer, direction){
  let visibleSlide = photoContainer.querySelector('.photo__img_visible');


  if(direction === 'next'){
    let nextSlide = visibleSlide.nextElementSibling;
    visibleSlide.classList.remove('photo__img_visible');
    if(nextSlide)  {
      nextSlide.classList.add('photo__img_visible');
    }else{
      photoContainer.firstElementChild.classList.add('photo__img_visible');
    }
  }else if(direction === 'prev'){
    let prevSlide = visibleSlide.previousElementSibling;
    visibleSlide.classList.remove('photo__img_visible');
    if(prevSlide)  {
      prevSlide.classList.add('photo__img_visible');
    }else{
      photoContainer.lastElementChild.classList.add('photo__img_visible');
    }
  }
  
}


document.addEventListener('DOMContentLoaded', function(){

  // Customize cursor icon when it is under the slider

  let cursor = document.createElement('div');
  cursor.textContent = 'DRAG ME';
  cursor.classList.add('custom-cursor');


  let slider = document.querySelector('.swiper-container');

  let isIn = false;
  slider.addEventListener('mouseenter', e => {
    isIn = true;
    cursor.style.top = e.clientY;
    cursor.style.left = e.clentX;
    document.body.appendChild(cursor);
    let addClasstimer = setTimeout(() => cursor.classList.add('custom-cursor_visible'), 500);
    
    
    window.addEventListener('mousemove', moveCursor);

    function moveCursor(e){
      if(isIn){
        cursor.style.top = e.clientY - 8 + 'px';
        cursor.style.left = e.clientX + 17 + 'px';        
      }      
    }

    slider.addEventListener('mouseleave', leaveSlider);

    function leaveSlider(e){
      isIn = false;
      if(!cursor.classList.contains('custom-cursor_visible')){
        clearTimeout(addClasstimer);
      }
      cursor.classList.remove('custom-cursor_visible');
      document.body.removeChild(cursor);
      window.removeEventListener('mousemove', moveCursor);
      slider.removeEventListener('mouseleave', leaveSlider);
    }
  })
  
  
  // *****************   Parallax *****************

  let photos = document.querySelectorAll('.photo');
  let photosParentCoords = document.querySelector('.photos').getBoundingClientRect();
  photos = [].map.call(photos, (photo) => {
    let coords = photo.getBoundingClientRect();
    coords.centerX = (coords.left + coords.right) / 2;
    coords.centerY = (coords.top + coords.bottom) / 2;
    return {
      element: photo, 
      params: coords
    };
  })

  window.addEventListener('mousemove', movePhotos);

  function movePhotos(e){
    [].map.call(photos, photo => {
      let mount = +photo.element.dataset['depth'] * 30;
      photo.element.style.left = photo.params.x - (e.clientX - photo.params.centerX) / photo.params.width * mount + 'px';
      photo.element.style.top = photo.params.y - photosParentCoords.top- (e.clientY - photo.params.centerY) / photo.params.height * mount + 'px';
    })
  }

  // EventListeners for clicking burger

  let burgerMenu = document.querySelector('.burger');
  burgerMenu.addEventListener('click', clickBurger)
  function clickBurger(e){
    this.classList.toggle('burger_active');
    if(this.classList.contains('burger_active')){
      document.querySelector('.menu').classList.add('menu_visible');
    }else{
      document.querySelector('.menu').classList.remove('menu_visible');
    }
    
  }
})