// auth.js
// Sends data directly to backend without frontend email restrictions

const emailEl = document.getElementById('email');
const nameEl = document.getElementById('name');
const passwordEl = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const msg = document.getElementById('msg');

btnRegister.onclick = async () => {
    const email = emailEl.value.trim().toLowerCase();
    const name = nameEl.value.trim();
    const pass = passwordEl.value;

    if (!email || !name || !pass) {
        msg.textContent = 'Enter name, email, and password';
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass })
        });

        const data = await res.json();
        msg.textContent = data.message || '';

        if (res.ok) {
            // Redirect after successful registration
            window.location.href = 'home.html';
        }
    } catch (err) {
        msg.textContent = 'Error connecting to server';
        console.error(err);
    }
};

btnLogin.onclick = async () => {
    const email = emailEl.value.trim().toLowerCase();
    const pass = passwordEl.value;

    if (!email || !pass) {
        msg.textContent = 'Enter email and password';
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });

        const data = await res.json();
        msg.textContent = data.message || '';

        if (res.ok) {
            window.location.href = 'home.html';
        }
    } catch (err) {
        msg.textContent = 'Error connecting to server';
        console.error(err);
    }
};
