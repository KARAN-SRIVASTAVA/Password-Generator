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
let passwordLength = 10;
let CheckCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
  // Excludes max
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 10);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const randomInteger = getRandomInteger(0, symbols.length + 1);
  return symbols[randomInteger];
}

function calculateStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;
  if (
    hasUpper &&
    hasLower &&
    (hasNumber || hasSymbol) &&
    password.length >= 8
  ) {
    setIndicator("#0f0");
  } else if (
    (hasUpper || hasLower) &&
    (hasNumber || hasSymbol) &&
    password.length >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
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

function shufflePassword(array) {
  let i = shufflePassword.length;
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

function handleCheckbox() {
  CheckCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) CheckCount++;
  });
  if (passwordLength < CheckCount) {
    passwordLength = CheckCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckbox);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  if (CheckCount <= 0) return;
  if (passwordLength < CheckCount) {
    passwordLength = CheckCount;
    handleSlider();
  }
  password = "";
  let func = [];
  if (uppercaseCheck.checked) func.push(generateUpperCase);
  if (lowercaseCheck.checked) func.push(generateLowerCase);
  if (numbersCheck.checked) func.push(generateRandomNumber);
  if (symbolsCheck.checked) func.push(generateSymbol);
  for (let i = 0; i < func.length; i++) {
    password += func[i]();
  }
  for (let i = 0; i < passwordLength - func.length; i++) {
    const randomNumber = getRandomInteger(0, func.length);
    password += func[randomNumber]();
  }
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;
  calculateStrength();
});
