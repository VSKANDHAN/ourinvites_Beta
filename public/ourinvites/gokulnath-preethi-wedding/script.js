$(document).ready(function () {
    // Function to check if element is in the viewport
    function isElementInViewport(el) {
      var rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  
    // Function to handle the scroll animation
    function handleScrollAnimation() {
      $(".animate").each(function () {
        if (isElementInViewport(this)) {
          $(this).addClass("active");
        }
      });
    }
  
   
  
    // Call the handleScrollAnimation function on scroll
    $(window).on("scroll", function () {
      handleScrollAnimation();
    });
  
    // Call the handleScrollAnimation function on page load
    handleScrollAnimation();
  });
  






  