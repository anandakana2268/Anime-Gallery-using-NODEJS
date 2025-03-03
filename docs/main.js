let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
}


var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 7500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop:true,
  });

  var swiper = new Swiper(".anime-slider", {
    slidesPerView: 4,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop:true
  });

  var swiper = new Swiper(".action-slider", {
    slidesPerView: 4,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop:true
  });


  var swiper = new Swiper(".child-slider", {
    slidesPerView: 4,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop:true
  });

  var swiper = new Swiper(".family-slider", {
    slidesPerView: 4,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop:true
  });

  var swiper = new Swiper(".website-slider", {
    slidesPerView: 5,
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 7500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    loop: true,
  });


  function submitReview() {
    let reviewText = document.getElementById('reviewText').value;

    if (!reviewText) {
        alert("Please write a review before submitting!");
        return;
    }

    fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review: reviewText })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Sentiment Analyzed: ${data.sentiment}`);
        displayReviews(); 
        document.getElementById('reviewText').value = ''; 
    })
    .catch(error => console.error('Error:', error));
}

function displayReviews() {
  fetch('http://127.0.0.1:5000/reviews')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          let reviewDropdown = document.getElementById('reviewDropdown');
          reviewDropdown.innerHTML = '<option value="">Reviews</option>';
          data.forEach((review, index) => {
              let option = document.createElement('option');
              option.value = index; 
              option.innerText = `Review ${index + 1}: ${review.text} - Sentiment: ${review.sentiment}`;
              option.setAttribute('data-review', review.text); 
              option.setAttribute('data-sentiment', review.sentiment); 
              reviewDropdown.appendChild(option);
          });
      })
      .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  displayReviews();


  document.getElementById('reviewDropdown').addEventListener('change', function() {
      let selectedOption = this.options[this.selectedIndex];
      let reviewText = selectedOption.getAttribute('data-review');  
      let sentiment = selectedOption.getAttribute('data-sentiment'); 
      let selectedReview = document.getElementById('selectedReview');

      if (reviewText) {
          selectedReview.innerText = `Review: ${reviewText}\nSentiment: ${sentiment}`;
          selectedReview.classList.remove('positive', 'negative', 'neutral');

          if (sentiment === 'Positive') {
              selectedReview.classList.add('positive');
          } else if (sentiment === 'Negative') {
              selectedReview.classList.add('negative');
          } else if (sentiment === 'Neutral') {
              selectedReview.classList.add('neutral');
          }
      } else {
          selectedReview.innerText = '';
          selectedReview.classList.remove('positive', 'negative', 'neutral');
      }
  });
});




