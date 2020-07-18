const swiper = new Swiper('.swiper-container', {
  speed: 1000,
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true,
  on: {
    touchEnd: function(){
     
      console.log(swiper.activeIndex);
    }
  }
});

document.addEventListener('DOMContentLoaded', function(){
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
  
  
  // let photo = document.querySelector('.photo_main');
  // let photoCoords = photo.getBoundingClientRect();
  // photoCoords.centerY = (photoCoords.top + photoCoords.bottom) / 2;
  // photoCoords.centerX = (photoCoords.left + photoCoords.right) / 2;  
  // console.log(photoCoords);

  // window.addEventListener('mousemove', movePhoto);

  // function movePhoto(e){
  //   //photo.style.left = photoCoords.left - (e.clientX - photoCoords.centerX) / window.innerWidth * 50 + 'px';
  //   photo.style.left = photoCoords.centerX - (e.clientX - photoCoords.centerX)  / window.innerWidth * 50 + 'px';
  // }

   
  let photos = document.querySelectorAll('.photo');
  photos = [].map.call(photos, (photo) => {
    let coords = photo.getBoundingClientRect();
    coords.centerX = (coords.left + coords.right) / 2;
    coords.centerY = (coords.top + coords.bottom) / 2;
    return {
      element: photo, 
      params: coords
    };
  })
  console.log(photos);
  window.addEventListener('mousemove', movePhotos);
  function movePhotos(e){
    [].map.call(photos, photo => {
      let mount = +photo.element.dataset['depth'] * 30;
      photo.element.style.left = photo.params.x - (e.clientX - photo.params.centerX) / photo.params.width * mount + 'px';
      photo.element.style.top = photo.params.y - (e.clientY - photo.params.centerY) / photo.params.height * mount + 'px';
    })
  }
})