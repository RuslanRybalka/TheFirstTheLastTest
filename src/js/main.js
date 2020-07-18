const swiper = new Swiper('.swiper-container', {
  speed: 1000,
  slidesPerView: 'auto',
  centeredSlides: true,
  loop: true
});


document.addEventListener('DOMContentLoaded', function(){
  let cursor = document.createElement('div');
  cursor.textContent = 'DRAG ME';
  cursor.classList.add('custom-cursor');

  let slider = document.querySelector('.swiper-container');
  slider.addEventListener('mouseenter', e => {
    cursor.style.top = e.clientY;
    cursor.style.left = e.clentX;
    document.body.appendChild(cursor);
    let addClasstimer = setTimeout(() => cursor.classList.add('custom-cursor_visible'), 1000)
    

    window.addEventListener('mousemove', moveCursor)

    function moveCursor(e){
      cursor.style.top = e.clientY - 8 + 'px';
      cursor.style.left = e.clientX + 17 + 'px';
    }

    slider.addEventListener('mouseleave', leaveSlider);

    function leaveSlider(e){
      if(!cursor.classList.contains('custom-cursor_visible')){
        clearTimeout(addClasstimer);
      }
      cursor.classList.remove('custom-cursor_visible');
      document.body.removeChild(cursor);
      window.removeEventListener('mousemove', moveCursor);
      slider.removeEventListener('mouseleave', leaveSlider);
    }
  })
  
})