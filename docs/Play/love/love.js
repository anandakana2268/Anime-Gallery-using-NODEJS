const trailerButtons = document.querySelectorAll('.trailer-btn');


trailerButtons.forEach(button => {
    button.onclick = function(event) {
        event.preventDefault(); 
        const modal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');


        const videoUrl = button.getAttribute('data-video');
        

        videoFrame.src = videoUrl;
        

        modal.style.display = 'block';
    };
});


document.querySelector('.close').onclick = function() {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    

    modal.style.display = 'none';
    videoFrame.src = ''; 
};


window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    
    if (event.target == modal) {
        modal.style.display = 'none';
        videoFrame.src = ''; 
    }
};




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
      .then(response => response.json())
      .then(data => {
          let reviewDropdown = document.getElementById('reviewDropdown');
          reviewDropdown.innerHTML = '<option value="">Reviews</option>';
          data.forEach((review, index) => {
              let option = document.createElement('option');
              option.value = index;
              option.innerText = `Review ${index + 1} - Sentiment: ${review.sentiment}`;
              option.setAttribute('data-review', review.text); 
              option.setAttribute('data-sentiment', review.sentiment); 
              reviewDropdown.appendChild(option);
          });
      })
      .catch(error => console.error('Error:', error));
}


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

window.onload = displayReviews;

