const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link'); 

window.addEventListener('load', () => {
    wrapper.classList.add('active-popup');
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    wrapper.classList.add('active'); 
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault(); 
    wrapper.classList.remove('active'); 
});


document.querySelector('.form-box.register .btn').addEventListener('click', function(event) {
    event.preventDefault();
    const role = document.getElementById('role').value;
    const username = document.querySelector('.form-box.register input[type="text"]').value;
    const email = document.querySelector('.form-box.register input[type="email"]').value;
    const password = document.querySelector('.form-box.register input[type="password"]').value;

    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, role })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`${role.charAt(0).toUpperCase() + role.slice(1)} Registration Successful!`);
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});

document.querySelector('.form-box.Login .btn').addEventListener('click', function(event) {
    event.preventDefault();
    const email = document.querySelector('.form-box.Login input[type="email"]').value;
    const password = document.querySelector('.form-box.Login input[type="password"]').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login Successful!');

        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});



document.querySelector('.register-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const formData = {
      username: document.querySelector('#username').value,
      email: document.querySelector('#email').value,
      password: document.querySelector('#password').value,
      role: document.querySelector('#role').value
    };
  
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    alert(result.message);
  });
  
  document.querySelector('.login-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const formData = {
      email: document.querySelector('#email').value,
      password: document.querySelector('#password').value
    };
  
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    if (result.token) {
      localStorage.setItem('token', result.token); 
      alert('Login successful');
    } else {
      alert(result.error);
    }
  });
  



