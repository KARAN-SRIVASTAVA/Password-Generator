const inputSlider = document.querySelector("[data-lenghtSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".Generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = `!~@#$%^&*()_-+={[}]:;><=|?.,"'`;
let password = "";
let passwordLenght = 10;
let CheckCount = 0;
handleslider();
setindicator("#ccc");
// color grey of strnght counter
function handleslider() {
  inputSlider.value = passwordLenght;
  lengthDisplay.innerText = passwordLenght;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLenght - min) * 100) / (max - min) + "% 100%";
}

function setindicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}
function generatesymbol() {
  const Rndind = getRandomInteger(0, symbols.length);
  return symbols.charAt(Rndind);
}

function calcstrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hassymbol = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hassymbol = true;
  if (
    hasUpper &&
    hasLower &&
    (hasNumber || hassymbol) &&
    password.length >= 8
  ) {
    setindicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hassymbol) &&
    password.length >= 6
  ) {
    setindicator("#ff0");
  } else {
    setindicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflepassword(array) {
  let i = shufflepassword.length;
  while (--i > 0) {
    let temp = Math.floor(Math.random() * (i + 1));
    [array[temp], array[i]] = [array[i], array[temp]];
  }
  let str = "";
  array.forEach((el) => {
    str += el;
  });
  return str;
}

function handlecheckbox() {
  CheckCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked)
      CheckCount++;
  });
  if (passwordLenght < CheckCount) {
    passwordLenght = CheckCount;
    handleslider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handlecheckbox);
});


inputSlider.addEventListener("input", (e) => {
  passwordLenght = e.target.value;
  handleslider();
});


copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});



generateBtn.addEventListener("click", () => { 
  if (CheckCount <= 0) return;
  if (passwordLenght < CheckCount) {
    passwordLenght = CheckCount;
    handleslider();
  }
  password = "";
  let func = [];
  if (uppercaseCheck.checked) func.push(generateUpperCase);
  if (lowercaseCheck.checked) func.push(generateLowerCase);
  if (numbersCheck.checked) func.push(generateRandomNumber);
  if (symbolsCheck.checked) func.push(generatesymbol);
  // compulsory work
  for (let i = 0; i < func.length; i++) {
    password += func[i]();
  }
  for (let i = 0; i < passwordLenght - func.length; i++) {
    const rndmnumber = getRandomInteger(0, func.length);
    password += func[rndmnumber]();
  }
  password = shufflepassword(Array.from(password));
  passwordDisplay.value = password;
  calcstrength();
});
