/* Напиши скрипт таймера, який здійснює зворотний відлік до певної дати. 

Елементи інтерфейсу
HTML містить готову розмітку таймера, поля вибору кінцевої дати і кнопку, по кліку на яку, таймер повинен запускатися. Додай мінімальне оформлення елементів інтерфейсу.

Бібліотека flatpickr
Використовуй бібліотеку flatpickr для того, щоб дозволити користувачеві кросбраузерно вибрати кінцеву дату і час в одному елементі інтерфейсу. Для того щоб підключити CSS код бібліотеки в проект, необхідно додати ще один імпорт, крім того, що описаний в документації.*/

// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

import "../css/common.css";

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const buttonStartValue = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes');
const secondsValue = document.querySelector('[data-seconds]');
const timePicker = document.querySelector('#datetime-picker');
const timer = document.querySelector('.timer');



const setFlatpickr = flatpickr(timePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] > Date.now()) {
      buttonStartValue.removeAttribute('disabled');
    } else {
      Notify.failure('Please choose a date in the future');
    }
  },
});

function onClick() {
  buttonStartValue.setAttribute('disabled', true);

  const timer = setInterval(() => {
    const selectedDate = setFlatpickr.selectedDates[0].getTime() - Date.now();

    if (selectedDate > 0) {
      renderTimer(convertMs(selectedDate));
      secondsValue.classList.add('zero');
    } else {
      clearInterval(timer);
      timePicker.removeAttribute('disabled');
    }
  }, 1000);
}

function renderTimer({ days, hours, minutes, seconds }) {
  daysValue.textContent = days;
  hoursValue.textContent = hours;
  minutesValue.textContent = minutes;
  secondsValue.textContent = seconds;
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

buttonStartValue.setAttribute('disabled', true);
buttonStartValue.addEventListener('click', onClick);












