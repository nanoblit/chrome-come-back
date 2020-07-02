/// <reference types="chrome"/>

"use strict";

chrome.runtime.onInstalled.addListener(() => {
  setColorInStorage("#3aa757");

  chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
    printNewPagesUrl(changeInfo, tab);
  });

  InludePageActionOnPagesWithStringInAddress(".");
});

function setColorInStorage(color: string) {
  chrome.storage.sync.set({ color }, () => {
    console.log("The color is green.");
  });
}

function printNewPagesUrl(
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.TabChangeInfo
) {
  chrome.storage.sync.get(["website-address"], (inputs) => {
    if (!inputs["website-address"] || changeInfo.status !== "complete") {
      return;
    }
    if (stringIsInUrl(inputs["website-address"], tab.url)) {
      console.log(`New URL: ${tab.url}`);
    }
  });
}

function stringIsInUrl(str: string, url: string) {
  return url.indexOf(str) > -1;
}

function InludePageActionOnPagesWithStringInAddress(str: string) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: str },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
}
