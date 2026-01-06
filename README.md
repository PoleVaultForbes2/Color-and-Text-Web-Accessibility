<!-- Markdeep: -->
<meta charset="utf-8">
<style class="fallback">body{visibility:hidden;white-space:pre;font-family:monospace}</style>
<script src="https://casual-effects.com/markdeep/latest/markdeep.min.js?"></script>

# Color and Text Web Accessibility  
### A User-Controlled Browser Extension for Improving Readability

**Authors:** Josh Forbes, Sterling Davis, Jordan Norris  
**Course:** Research II  
**Date:** December 9, 2025  

---

## 📌 Project Overview

Color choice and text readability play a critical role in web accessibility. Poor design decisions can make websites difficult or impossible to use for individuals with visual impairments, including color vision deficiencies.

This project introduces a **browser extension** that places accessibility control directly into the hands of users. Rather than relying solely on developers to follow accessibility standards, users can **customize webpage colors, text size, and contrast** to suit their own needs.

With over a billion websites online—many of which violate accessibility guidelines—this project aims to offer a practical, user-focused solution.

---

## 🎯 Research Goals

The primary goals of this project were to:

- Design a **proof-of-concept browser extension** for accessibility customization
- Allow users to:
  - Modify webpage colors
  - Adjust text size
  - Improve element contrast
- Evaluate whether **user-controlled customization** improves perceived accessibility
- Measure accessibility improvements using **WCAG-based tools** and user feedback

---

## 📚 Background & Motivation

### Why Accessibility Matters

- Web accessibility ensures equal access for users with visual impairments
- The Web Content Accessibility Guidelines (WCAG) define industry standards
- Existing tools:
  - Primarily target developers, not end users
  - Often detect issues without offering actionable fixes
  - Can be inaccurate or difficult to use

### Identified Research Gap

- Lack of **user-facing accessibility tools**
- Overemphasis on aesthetics over usability
- Limited real-world user testing in existing research

---

## 🧠 Methodology

### Tools & Technologies

- Google Chrome Extension API
- WCAG 2.x guidelines as baseline metrics
- Cloudflare (hosting a deliberately inaccessible test webpage)
- WAccess accessibility checker
- Chrome Developer Tools (Inspector)
- Color blindness simulation filters
- VS Code and GitLab for development and version control

---

### Extension Design Process

1. **Proof of Concept**  
   - Modify basic HTML elements (`p`, `h1`, background colors)

2. **Persistence**  
   - Save and load user-defined accessibility modes

3. **Element Selection**  
   - Hover and select specific elements for customization

4. **Full Extension Integration**  
   - Stable UI and extension behavior

5. **Evaluation Phase**  
   - User testing and accessibility measurement

---

## 🧪 Data Collection

- **18 total participants**
- Participants viewed a deliberately inaccessible webpage
- Most users used a **color blindness filter** to simulate visual impairments
- One participant was truly colorblind (results aligned with simulated users)

### Testing Procedure

1. Users rated webpage accessibility (1–10)
2. Users had 10 minutes to modify the page using the extension
3. Users re-rated accessibility after customization
4. WCAG contrast errors were analyzed before and after modifications

---

## 📊 Results & Findings

### Quantitative Results

- **Average accessibility rating before:** 4.22 / 10
- **Average accessibility rating after:** 9.56 / 10
- WAccess initially detected **11 contrast violations**
- After customization, **all contrast violations were resolved**

> Note: WAccess could not re-evaluate dynamically modified pages, so Chrome Inspector was used for final verification.

---

## 🧩 Discussion

- Users experienced significantly improved readability
- The tool successfully empowered users to fix accessibility issues themselves
- Feedback indicated:
  - The extension was effective
  - The interface was not always intuitive

---

## ⚠️ Limitations

- Small and demographically narrow sample size
- Only one test webpage
- Heavy reliance on simulated color blindness
- Short testing duration

Despite these limitations, results were consistent and promising.

---

## 🚀 Future Work

Planned improvements include:

- Simplifying the user interface
- Adding **pre-made colorblind-friendly themes**
- Replacing HTML tag names with human-readable labels
- Supporting dynamic and complex webpages
- Expanding testing across diverse user groups

---

## ✅ Conclusion

This project demonstrates that **user-controlled accessibility tools** can dramatically improve website readability and usability. While limited in scope, the findings support further development and larger-scale testing.

By shifting accessibility control from developers alone to end users, this approach offers a powerful complementary solution to existing accessibility standards.

---

## 📖 References

A full list of academic references, WCAG documentation, and accessibility tools used in this project can be found in the accompanying research presentation and paper.

---

*This project was completed as part of the Research II course and is intended as an academic proof of concept.*
