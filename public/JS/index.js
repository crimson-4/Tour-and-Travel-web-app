import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

//Dom Elements
const logOutBtn = document.querySelector('.nav__el--logout');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
// values
console.log(userPasswordForm);
if (loginForm)
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //console.log(email, password);
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  console.log('hi userdata');
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    updateSettings({ name, email }, 'profile');
  });
}
if (userPasswordForm) {
  console.log('password');
  userPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    console.log(passwordCurrent, password, passwordConfirm);
    //console.log('hi user');
    updateSettings({ passwordCurrent, password, passwordConfirm }, 'success');
  });
}
