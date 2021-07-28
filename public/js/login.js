/* eslint-disable */
const loginForm = document.querySelector('.form--login');
const stockForm = document.querySelector('.form--stock');

 const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
 const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

 const login = async (email) => {

  try {
    const res = await axios({
      method: 'POST',
      url: '/users/signup',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Start now');
      window.setTimeout(() => {
        location.assign('/stock');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const stockAction = async (stock) => {

  try {
    const res = await axios({
      method: 'POST',
      url: '/stock/info',
      data: {
        stock
      }
    });

    if (res.data.status === 'success') {
      console.log(res.data);
      showAlert('success', 'Please wait! Graph Loading');
      window.setTimeout(() => {
        location.assign('/stock/page');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    login(email);
  });

  if (stockForm)
  stockForm.addEventListener('submit', e => {
    e.preventDefault();
    const stock = document.getElementById('stock').value;
    stockAction(stock);
  });