// popup.js

// element to change specfic instance
let selectedElement = null;
const selectButton = document.getElementById("selectElementBtn");
let selectorActive = false;

// Helper function to reset color inputs back to default 
function resetColorInputs() {
  document.getElementById("textColor").value = "#000000";
  document.getElementById("elementBg").value = "#ffffff";
}

async function DEBUG_print_saved_data(tab) {
  const url = tab.url;
  console.log("Url to load saved data from: " + url)
  const pref = await chrome.storage.local.get(url)
  console.log("Saved data: " + JSON.stringify(pref))
}

document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // await DEBUG_print_saved_data(tab);
  const url = tab.url
  const pref = await chrome.storage.local.get(url)
  const site_data = pref[url]

  console.log("On Load: " + JSON.stringify(site_data))

  for (saved_element_idx in site_data) {
    let saved_element = site_data[saved_element_idx]
    // console.log("Saved Element: " + JSON.stringify(saved_element))
    chrome.runtime.sendMessage({
      type: "applyElementStyle",
      tabId: tab.id,
      element: saved_element["element"],
      textColor: saved_element["textColor"],
      bgColor: saved_element["bgColor"],
      fontSize: saved_element["fontSize"],
      selector: null  // may be null
    });
  }
});

// send message to apply color changes
document.getElementById("applyStyleBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });


  const element = document.getElementById("elementSelect").value;
  const element_id = document.getElementById("elementSelect").id
  const textColor = document.getElementById("textColor").value;
  const bgColor = document.getElementById("elementBg").value;

  const fontSize = document.getElementById("font-size-selector").value;

  // save to storage
  const url = tab.url;
  const pref = await chrome.storage.local.get(url)
  let site_data = []
  if (Object.hasOwn(pref, url)) {
    site_data = pref[url]
  }

  const element_to_save = { element, textColor, bgColor, fontSize }
  site_data.push(element_to_save)
  let site_to_save = {}
  site_to_save[url] = site_data
  await chrome.storage.local.set(site_to_save);
  // DEBUG_print_saved_data(tab)

  // get current tab
  // const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // send message to background
  chrome.runtime.sendMessage({
    type: "applyElementStyle",
    tabId: tab.id,
    element,
    textColor,
    bgColor,
    fontSize,
    selector: selectedElement  // may be null
  });
  selectedElement = null
});

document.getElementById("clearSavedDataBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  let site_to_save = {}
  site_to_save[url] = []
  await chrome.storage.local.set(site_to_save);
  reset()
})

// send message to reset current element
// document.getElementById("resetStyleBtn").addEventListener("click", async() => {
//   const element = document.getElementById("elementSelect").value;
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true});

//   chrome.runtime.sendMessage({
//     type: "resetElementStyle",
//     tabId: tab.id,
//     element
//   });

//   // reset inputs
//   resetColorInputs();
// });

// send message to reset all 

let reset = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.runtime.sendMessage({
    type: "resetAllStyles",
    tabId: tab.id
  });

  // reset inputs
  resetColorInputs();
}

document.getElementById("resetAllBtn").addEventListener("click", reset);

// send message to change mode
document.getElementById("selectElementBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ type: "activateElementSelector", tabId: tab.id });
});

// Listen for the selected element info from content script
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "elementSelected") {
    selectedElement = msg.selector;
    console.log("SELECTED ELEMENT: ", selectedElement)
    document.getElementById("elementSelect").value = msg.tag;
    //alert(`Selected element: ${msg.selector}`);
  }

  if (msg.type === "selectionComplete") {
    const selectButton = document.getElementById("selectElementBtn");
    selectButton.style.backgroundColor = "";
    selectorModeActive = false;
  }
});

selectButton.addEventListener("click", () => {
  selectorActive = !selectorActive;

  if (selectorActive) {
    selectButton.style.backgroundColor = "#ffcc00"; // highlight yellow
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({
        type: "activateElementSelector",
        tabId: tabs[0].id,
      });
    });
  } else {
    selectButton.style.backgroundColor = "";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "deactivateElementSelector",
        tabId: tabs[0].id,
      });
    });
  }
});
