function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const imgIcon = document.getElementById('iconPassword');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    const icon = passwordInput.getAttribute('type') === 'password' ? 'https://cdn-icons-png.flaticon.com/512/9759/9759281.png' : 'https://cdn-icons-png.flaticon.com/512/6684/6684701.png ';
    passwordInput.setAttribute('type', type);
    imgIcon.setAttribute('src', icon);

}
