"use strict";

const websiteAddressInputElement = document.getElementById("website-address");
const logoutRedirectAddressInputElement = document.getElementById(
  "logout-redirect-address"
);
const loginPageAddressInputElement = document.getElementById(
  "login-page-address"
);
const usernameFieldSelectorInputElement = document.getElementById(
  "username-field-selector"
);
const passwordFieldSelectorInputElement = document.getElementById(
  "password-field-selector"
);
const signInButtonSelectorInputElement = document.getElementById(
  "sign-in-button-selector"
);
const usernameInputElement = document.getElementById("username");
const passwordInputElement = document.getElementById("password");
const activeCheckboxElement = document.getElementById("active");

let isActive = false;

const elements = [
  websiteAddressInputElement,
  logoutRedirectAddressInputElement,
  loginPageAddressInputElement,
  usernameFieldSelectorInputElement,
  passwordFieldSelectorInputElement,
  signInButtonSelectorInputElement,
  usernameInputElement,
  passwordInputElement,
  activeCheckboxElement,
];

// ====================================

for (let element of elements) {
  setInputInStorageWhenChanged(element);
}

activeCheckboxElement.onclick = (element) => {
  const checkbox = element.target;
  setBackgroundColorsBasedOnCheckbox(checkbox);
};

// ====================================

function setInputInStorageWhenChanged(element) {
  element.addEventListener("input", (element) => {
    const input = element.target;
    chrome.storage.sync.set(getInputKeyValuePair(input), () => {
      logNewStorageKeyValuePair(input);
    });
  });
}

function getInputKeyValuePair(input) {
  return input.type === "checkbox"
    ? { [input.id]: input.checked }
    : { [input.id]: input.value };
}

function logNewStorageKeyValuePair(input) {
  console.log(
    `${input.id} is set to ${
      input.type === "checkbox" ? input.checked : input.value
    }`
  );
}

function setBackgroundColorsBasedOnCheckbox(checkbox) {
  if (checkbox.checked) {
    isActive = true;
    setBackgroundOfEveryPageToColor("green");
  } else {
    isActive = false;
    setBackgroundOfEveryPageToColor("white");
  }
}

function setBackgroundOfEveryPageToColor(color) {
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      if (stringIsntInUrl(".", tab.url)) {
        continue;
      }
      setBackgroundOfPageToColor(tab, color)
    }
  });
}

function setBackgroundOfPageToColor(tab, color) {
  chrome.tabs.executeScript(tab.id, {
    code: `document.body.style.backgroundColor = "${color}";`,
  });
}

function stringIsntInUrl(str, url) {
  return url.indexOf(str) < 0;
}
