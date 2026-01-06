// function to get tag we have implemented
function getRelevantElement(el) {
  const ignoredTags = ["span", "b", "i", "strong", "em", "u"];

  // climb up until we hit a meaningful element
  while (el && ignoredTags.includes(el.tagName.toLowerCase())) {
    el = el.parentElement;
  }

  return el;
}

// get information to only change a specfic instance
function getElementSelector(el) {
  // If no ID, inject one
  if (!el.id) {
    el.id = "wgac-" + Math.random().toString(36).substr(2, 9);
  }

  return `#${el.id}`;
}


// (() => { ... makes it run when the webpage is loaded
(() => {
  // Prevent multiple activations
  if (window._elementSelectorActive) return;
  window._elementSelectorActive = true;

  // Add highlight style
  const highlightStyle = document.createElement("style");
  highlightStyle.textContent = `
    ._elementHighlight {
      outline: 3px solid #00aaff !important;
      cursor: crosshair !important;
    }
  `;
  document.head.appendChild(highlightStyle);

  // keep track of last thing highlighted so we can remove later
  let lastHighlighted = null;

  // e is the current element
  function onMouseOver(e) {
    if (lastHighlighted && lastHighlighted !== e.target) {
      lastHighlighted.classList.remove("_elementHighlight");
    }
    e.target.classList.add("_elementHighlight");
    lastHighlighted = e.target;
  }

  function onMouseOut(e) {
    e.target.classList.remove("_elementHighlight");
  }

  function onClick(e) {
    // stops normal behavior like a link click
    e.preventDefault();
    // prevents triggering JavaScript events
    e.stopPropagation();

    const selected = getRelevantElement(e.target)

    if (lastHighlighted) {
      lastHighlighted.classList.remove("_elementHighlight");
    }

    if (!selected.id) {
      selected.id = "wgac-" + Math.random().toString(36).substr(2, 9);
    }

    // Send info back to popup
    chrome.runtime.sendMessage({
      type: "elementSelected",
      tag: selected.tagName.toLowerCase(),
      selector: `#${selected.id}`
    });

    chrome.runtime.sendMessage({ type: "selectionComplete" });

    disableSelectorMode();
  }

  // Function to enable/disable selector mode
  function enableSelectorMode(){
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick, true);
    window._elementSelectorActive = true;
  }

  function disableSelectorMode(){
    document.removeEventListener("mouseover", onMouseOver);
    document.removeEventListener("mouseout", onMouseOut);
    document.removeEventListener("click", onClick, true);
    window._elementSelectorActive = false;

    // Clean up any highlight left behind
    if (lastHighlighted) {
      lastHighlighted.classList.remove("_elementHighlight");
      lastHighlighted = null;
    }
  }

  // listen for message to deactivate selection from other js files
  chrome.runtime.onMessage.addListener((msg) => {
    console.log("made it from listener");
    if (msg.type === "deactivateElementSelector") {
      disableSelectorMode();
    }
  });

  enableSelectorMode();
})();
