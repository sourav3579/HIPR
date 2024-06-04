
$(document).ready(function () {

  setTimeout(() => {

    // alert('hii')
    var boxes = $('#locations .location_box');
    var previousId = null;
    var intervalId;

    function randomHideShow() {
      var randomBox = boxes.eq(Math.floor(Math.random() * boxes.length));
      var randomId = randomBox.attr('id');

      // Ensure the newly generated ID is different from the previous one
      while (randomId === previousId) {
        randomBox = boxes.eq(Math.floor(Math.random() * boxes.length));
        randomId = randomBox.attr('id');
      }

      // Update the previousId with the current one
      previousId = randomId;

      // Toggle the 'active' class
      $(randomBox).toggleClass('active').siblings().removeClass('active');
    }

    function startInterval() {
      intervalId = setInterval(randomHideShow, 5000);
    }

    function stopInterval() {
      clearInterval(intervalId);
    }

    boxes.mouseenter(function () {
      stopInterval();
      $(this).addClass('active').siblings().removeClass('active');
    });

    boxes.mouseleave(function () {
      startInterval();
    });

    startInterval();

  }, 1000)



});