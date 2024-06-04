$(document).ready(function () {
  var swiper = new Swiper(".mySwiper", {
    allowTouchMove: false,
    slidesPerView: 1,
    loop: true,
    type: "fraction",
    spaceBetween: 10,
    effect: "fade",
    navigation: {
      nextEl: ".swiper-button-next, #reportnextBTN",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  var nextSlide = document.getElementById('nextBTN');
  var rangeBtn = $('.rangeBtn');
  var prevSlide = document.getElementById('previous');
  $(nextSlide).click(function () {
    var getIndex = $('.swiper-slide-active').attr('data-swiper-slide-index');
    console.log(getIndex);
    if (getIndex == 1) {
      $(this).hide();
    }
    if (getIndex == 4) {
      $('#sub-menu').hide();
      $('#tigerimg').show();
    }
  })

  $(rangeBtn).click(function () {
    var getIndex = $('.swiper-slide-active').attr('data-swiper-slide-index');
    console.log(getIndex);
    if (getIndex == 3) {
      $(nextSlide).show();
    }
    if (getIndex == 4) {
      $('#sub-menu').hide();
      $('#tigerimg').show();
    }
  })

  $(prevSlide).click(function () {
    var getIndex = $('.swiper-slide-active').attr('data-swiper-slide-index');
    console.log(getIndex);
    if (getIndex == 0) {
      $(nextSlide).show();
    }
    if (getIndex == 2) {
      $(nextSlide).hide();
    }
  })

  // setTimeout(() => {
  //   let workspace = $('#workspace').height() + 80;
  //   $('#sticky').css("height", workspace);
  // }, 2000)

  $('#helpsubmit').click(function () {
    $('.modal#helppop .thank-you').css({ 'opacity': '1', 'visibility': 'visible' })
  })

  $('#sharesubmit').click(function () {
    $('.modal#sharepop .thank-you').css({ 'opacity': '1', 'visibility': 'visible' })
  })

  // const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

  // accordionItemHeaders.forEach(accordionItemHeader => {
  //     accordionItemHeader.addEventListener("click", event => {


  //         accordionItemHeader.classList.toggle("active");
  //         const accordionItemBody = accordionItemHeader.nextElementSibling;
  //         if (accordionItemHeader.classList.contains("active")) {
  //             accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
  //         }
  //         else {
  //             accordionItemBody.style.maxHeight = 0;
  //         }

  //     });
  // });

});