/// <reference types="chrome"/>

"use strict";

interface urlData {
  url: string;
  lastStatus: string;
}

const lastUrls: { [key: number]: urlData } = {};

chrome.runtime.onInstalled.addListener(() => {
  // setColorInStorage("#3aa757");

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    printNewPagesUrl(tabId, changeInfo, tab);
  });

  InludePageActionOnPagesWithStringInAddress(".");
});

// function setColorInStorage(color: string) {
//   chrome.storage.sync.set({ color }, () => {
//     console.log("The color is green.");
//   });
// }

function printNewPagesUrl(
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.TabChangeInfo
) {
  chrome.storage.sync.get(
    ["website-address", "logout-redirect-address"],
    (storage) => {
      console.log(JSON.stringify(lastUrls));
      console.log(changeInfo.status);
      if (
        storage["website-address"] &&
        changeInfo.status === "complete" &&
        stringIsInUrl(storage["website-address"], lastUrls[tabId].url) &&
        stringIsInUrl(storage["logout-redirect-address"], tab.url)
      ) {
        console.log(`Last URL: ${lastUrls[tabId].url}`);
        console.log(`New URL: ${tab.url}`);
      }
      setNewUrl(tabId, tab.url, changeInfo.status);
    }
  );
}

function setNewUrl(tabId: number, url: string, status: string) {
  console.log("we are in setNewUrl");
  console.log(url);
  lastUrls[tabId] = {
    ...lastUrls[tabId],
    lastStatus: status,
  };
  // first time after changing the page url is set to the new page, not the last one
  if (!lastUrls[tabId].url || lastUrls[tabId].lastStatus === "complete") {
    lastUrls[tabId] = { ...lastUrls[tabId], url };
  }
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
