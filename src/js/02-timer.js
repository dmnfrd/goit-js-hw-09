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

let timerId = null;
let ms = null;

buttonStartValue.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    
    onClose(selectedDates) {
        ms = selectedDates[0].getTime();
        if (ms < new Date()) {
            Notify.failure('Please choose a date in the future')
            return;
        }
        buttonStartValue.disabled = false;
    },
};

flatpickr("#datetime-picker", options);

let object = {};

const onCountTime = () => {
    timerId = setInterval(() => {
        const diff = ms - new Date().getTime();
        if (diff <= 0) {
            clearTimeout(timerId);
            return;
        };
    object = convertMs(diff);
    onChangeContent(addLeadingZero(object));
    }, 1000)
}


function onChangeContent({ days, hours, minutes, seconds }) {
    daysValue.textContent = addLeadingZero(days);
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
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

buttonStartValue.addEventListener("click", onCountTime);