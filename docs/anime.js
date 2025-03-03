document.querySelector(".bookmark-btn").addEventListener("click", function() {
    const icon = document.getElementById("fa-heart");
    icon.classList.toggle("active");
});

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
    let rating = document.querySelector('input[name="rating"]:checked')?.value;

    if (!reviewText || !rating) {
        alert("Please write a review and select a rating before submitting!");
        return;
    }

    fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: reviewText, rating: parseInt(rating) })  
    })
    .then(response => response.json())
    .then(data => {
        alert(`Sentiment Analyzed: ${data.sentiment}`);
        document.getElementById('reviewText').value = '';
        document.querySelector('input[name="rating"]:checked').checked = false;
        displayReviews(); 
    })
    .catch(error => console.error('Error:', error));
}

function displayReviews() {
    fetch('http://127.0.0.1:5000/reviews')
        .then(response => response.json())
        .then(data => {
            const reviewsContainer = document.querySelector('.reviews-scroll');
            reviewsContainer.innerHTML = '';

            data.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.classList.add('review-card');
                reviewCard.innerHTML = `
                    <div class="review-header">
                        <h3>Anonymous User</h3>
                        <div class="star-rating">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        </div>
                    </div>
                    <p class="review-text">${review.text}</p>
                    <p>Sentiment: ${review.sentiment}</p>
                `;
                reviewsContainer.appendChild(reviewCard);
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
}

document.addEventListener('DOMContentLoaded', displayReviews);
