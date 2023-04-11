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

const timer = {
 buttonStartValue : document.querySelector('[data-start]'),
 daysValue : document.querySelector('[data-days]'),
 hoursValue : document.querySelector('[data-hours]'),
 minutesValue : document.querySelector('[data-minutes]'),
 secondsValue : document.querySelector('[data-seconds]'),
}

let timerId = null;
let ms = null;

timer.buttonStartValue.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      Notify.failure('Please choose a date in the future');
      return;
    }
    timer.buttonStartValue.removeAttribute('disabled');

    const showTimer = () => {
      const now = new Date();
      localStorage.setItem('selectedData', selectedDates[0]);
      const selectData = new Date(localStorage.getItem('selectedData'));

      if (!selectData) return;

      const diff = selectData - now;
      const { days, hours, minutes, seconds } = convertMs(diff);
      timer.daysValue.textContent = days;
      timer.hoursValue.textContent = hours;
      timer.minutesValue.textContent = minutes;
      timer.secondsValue.textContent = seconds;

      if (
        timer.daysValue.textContent === '0' &&
        timer.hoursValue.textContent === '00' &&
        timer.minutesValue.textContent === '00' &&
        timer.secondsValue.textContent === '00'
      ) {
        clearInterval(timerId);
      }
    };

    const onClick = () => {
      if (timerId) {
        clearInterval(timerId);
      }
      showTimer();
      timerId = setInterval(showTimer, 1000);
    };

    timer.buttonStartValue.addEventListener('click', onClick);
  },
};

flatpickr('#datetime-picker', { ...options });
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

