// background.js

// Changed to open as a side panel ***
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// listens for msg from popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.type === "runContentScript"){
    chrome.scripting.executeScript({
      target: {tabId: msg.tabId },
      files: ["contentScript.js"]
    });
  }

  // * apply color change *
  if (msg.type === "applyElementStyle") {
    chrome.scripting.executeScript({
      target: { tabId: msg.tabId },
      func: (element, textColor, bgColor, fontSize, selector) => {
        // Ensure global storage object on window
        window._originalElementStyles = window._originalElementStyles || {};

        function saveOriginalStyle(sel, el) {
          // only store original if this selector hasn't been saved yet
          if (!window._originalElementStyles[sel]) {
            // Check if this element was already modified by a broader selector
            let foundOriginal = false;
            
            for (const [existingSelector, styles] of Object.entries(window._originalElementStyles)) {
              // Check if the element matches an existing selector
              if (el.matches(existingSelector)) {
                // Copy the original styles from the broader selector
                window._originalElementStyles[sel] = { ...styles };
                foundOriginal = true;
                break;
              }
            }
            
            // If no existing selector matched, get the current computed style
            if (!foundOriginal) {
              const computed = getComputedStyle(el);
              window._originalElementStyles[sel] = {
                color: computed.color,
                backgroundColor: computed.backgroundColor,
                fontSize: computed.fontSize
              };
            }
          }
        }

        if(selector){
          const el = document.querySelector(selector);
          if(el){
            // save original value to window
            window._originalElementStyles = window._originalElementStyles || {};

            saveOriginalStyle(selector, el);

            // apply only to selected element
            el.style.color = textColor;
            el.style.backgroundColor = bgColor;
            el.style.fontSize = fontSize;
          }
        } else {
          const elems = document.querySelectorAll(element);
          elems.forEach(el => {
            // Save original color if not already saved
            saveOriginalStyle(element, el);

            // Apply new colors
            console.log("Element: ", el);
            el.style.color = textColor;
            el.style.backgroundColor = bgColor;
            el.style.fontSize = fontSize;
          });
      }
      },
      args: [msg.element, msg.textColor, msg.bgColor, msg.fontSize, msg.selector]
    });
  }

  // * Reset element style to original *
  // if (msg.type === "resetElementStyle") {
  //   chrome.scripting.executeScript({
  //     target: {tabId: msg.tabId },
  //     func: (element) => {
  //       if (!window._originalElementStyles || !window._originalElementStyles[element]) {
  //         console.warn("No stored original styles for element:", element);
  //         return;
  //       }

  //       const { color, backgroundColor } = window._originalElementStyles[element];
  //       const elems = document.querySelectorAll(element);
  //       elems.forEach(el => {
  //         el.style.color = color;
  //         el.style.backgroundColor = backgroundColor;
  //         el.style.fontSize = fontSize;
  //       });
  //     },
  //     args: [msg.element]
  //   });
  // }

  // * Reset all styles to original *
  if (msg.type === "resetAllStyles") {
    chrome.scripting.executeScript({
      target: { tabId: msg.tabId },
      func: () => {
        if (!window._originalElementStyles) {
          console.warn("No styles stored to reset.");
          return;
        }

        // Restore all elements stored in the map
        Object.entries(window._originalElementStyles).forEach(([element, styles]) => {
          const elems = document.querySelectorAll(element);
          elems.forEach(el => {
            el.style.color = styles.color;
            el.style.backgroundColor = styles.backgroundColor;
            el.style.fontSize = styles.fontSize;
          });
        });

        // Clear all saved original styles after restoring
        window._originalElementStyles = {};
      }
    });
  }

  // * change mode to select element *
  if (msg.type === "activateElementSelector") {
    chrome.scripting.executeScript({
      target: { tabId: msg.tabId },
      files: ["elementSelector.js"]
    });
  }
  // eof
});





// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["contentscript.js"]
//   });
// });

// function injectedFunction() {
//   document.body.style.backgroundColor = "orange";
// }

// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target : {tabId : tab.id},
//     func : injectedFunction,
//   });
// });
