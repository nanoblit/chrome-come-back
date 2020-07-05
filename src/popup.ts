/// <reference types="chrome"/>

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

// activeCheckboxElement.onclick = (element) => {
//   const checkbox = element.target as HTMLInputElement;
//   setBackgroundColorsBasedOnCheckbox(checkbox);
// };

// ====================================

// TODO: Finish setting up inputs from storage
function setupInputsFromStorage(inputs: HTMLInputElement[]) {
  chrome.storage.sync.get(
    ["website-address", "logout-redirect-address","login-page-address","username-field-selector","password-field-selector","sign-in-button-selector","username","password","active"],
    (storage) => {
      for (let input of inputs) {

      }
    })
}

function setInputInStorageWhenChanged(element: HTMLElement) {
  element.addEventListener("input", (element) => {
    const input = element.target as HTMLInputElement;
    chrome.storage.sync.set(getInputKeyValuePair(input), () => {
      logNewStorageKeyValuePair(input);
    });
  });
}

function getInputKeyValuePair(input: HTMLInputElement) {
  return input.type === "checkbox"
    ? { [input.id]: input.checked }
    : { [input.id]: input.value };
}

function logNewStorageKeyValuePair(input: HTMLInputElement) {
  console.log(
    `${input.id} is set to ${
      input.type === "checkbox" ? input.checked : input.value
    }`
  );
}

// function setBackgroundColorsBasedOnCheckbox(checkbox: HTMLInputElement) {
//   if (checkbox.checked) {
//     isActive = true;
//     setBackgroundOfEveryPageToColor("green");
//   } else {
//     isActive = false;
//     setBackgroundOfEveryPageToColor("white");
//   }
// }

// function setBackgroundOfEveryPageToColor(color: string) {
//   chrome.tabs.query({}, (tabs) => {
//     for (let tab of tabs) {
//       if (stringIsntInUrl(".", tab.url)) {
//         continue;
//       }
//       setBackgroundOfPageToColor(tab, color)
//     }
//   });
// }

// function setBackgroundOfPageToColor(tab: chrome.tabs.Tab, color: string) {
//   chrome.tabs.executeScript(tab.id, {
//     code: `document.body.style.backgroundColor = "${color}";`,
//   });
// }

// function stringIsntInUrl(str: string, url: string) {
//   return url.indexOf(str) < 0;
// }
