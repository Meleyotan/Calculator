let display = document.getElementById("calc_result");
let buttons = document.querySelectorAll(".calc_button");
let isOpeningBracket = true; // Flag to track the current bracket state
let recordingIcon = document.getElementById("recording");
let recording_container = document.getElementById("recording_container");
let soundwaveContainer = document.querySelector(".soundwave-container"); // Select the soundwave container

// Function to round to the nearest decimal place
function roundToDecimalPlace(num, decimalPlaces = 3) {
  return parseFloat(num.toFixed(decimalPlaces)); // Round to the specified decimal place
}

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    // Limit the number of characters to 15
    if (
      display.innerHTML.length >= 15 &&
      button.innerHTML !== "C" &&
      button.innerHTML !== "="
    ) {
      return; // Prevent further input if the limit is reached
    }

    //Prevent multiple decimal points in a number
    if (display.innerHTML.includes(".") && button.innerHTML === ".") {
      return; // Prevent adding another decimal point
    }

    // Prevent "/" and "*" from being pressed first
    if (
      (display.innerHTML === "0" || display.innerHTML === "") &&
      (button.innerHTML === "/" || button.innerHTML === "*")
    ) {
      return; // Do nothing if "/" or "*" is pressed first
    }

    // Clear "Error" on pressing any number, operator, or bracket
    if (
      display.innerHTML === "Error" &&
      (!isNaN(button.innerHTML) ||
        [".", "-", "+", "*", "/", "(", ")"].includes(button.innerHTML))
    ) {
      display.innerHTML = ""; // Clear the error
    }

  // Handle the bracket button
if (button.innerHTML === "()") {
  if (isOpeningBracket) {
    // Add opening bracket
    if (display.innerHTML === "0" || display.innerHTML === "") {
      display.innerHTML = "("; // Clear display and add opening bracket
    } else if (
      display.innerHTML.length > 0 &&
      !isNaN(display.innerHTML.slice(-1))
    ) {
      // If the last character is a number, add a multiplication sign before the opening bracket
      display.innerHTML += "*(";
    } else {
      display.innerHTML += "(";
    }
  } else {
    // Add closing bracket
    if (
      display.innerHTML.length > 0 &&
      (display.innerHTML.slice(-1) === ")" ||
        !isNaN(display.innerHTML.slice(-1)))
    ) {
      // If the last character is a number or a closing bracket, add a closing bracket
      display.innerHTML += ")";
    } else {
      display.innerHTML += ")";
    }
  }
  isOpeningBracket = !isOpeningBracket; // Toggle the flag
  return; // Exit the function after handling the bracket
}

// Add multiplication if a number follows a closing bracket
if (
  display.innerHTML.slice(-1) === ")" &&
  !isNaN(button.innerHTML)
) {
  display.innerHTML += "*"; // Add multiplication sign before the number
}
    // Handle the clear button
    if (button.innerHTML === "C") {
      display.innerHTML = "0"; // Reset display on 'C'
      isOpeningBracket = true; // Reset the bracket state
      return;
    }

    // Handle the erase button

    if (button.innerHTML === "⌫") {
      // Assuming the erase button has the text "⌫"
      if (display.innerHTML.length > 1) {
        display.innerHTML = display.innerHTML.slice(0, -1); // Remove the last character
      } else {
        display.innerHTML = "0"; // Reset to "0" if the display becomes empty
      }
      return;
    }

    // Handle the equals button
    if (button.innerHTML === "=") {
      try {
        let result = eval(display.innerHTML); // Evaluate the expression

        // Check if the result is a large number or in scientific notation
        if (
          result.toString().includes("e") ||
          result > 1e15 ||
          result < 1e-15
        ) {
          result = result.toExponential(3); // Convert to scientific notation with 3 decimal places
        } else {
          result = roundToDecimalPlace(result); // Round to the nearest decimal place
        }

        display.innerHTML = result; // Display the result
      } catch (error) {
        display.innerHTML = "Error"; // Handle errors
      }
      return;
    }
    // Handle leading zeros
    if (display.innerHTML === "0") {
      if (button.innerHTML === "0") {
        return; // Prevent adding multiple leading zeros
      } else if (!isNaN(button.innerHTML)) {
        display.innerHTML = ""; // Clear the zero if a different number is pressed
      }
    }

    // Add the button's value to the display
    display.innerHTML += button.innerHTML;
    display.innerHTML = display.innerHTML.replace(/^0+/, "0"); // Ensure leading zeros are handled correctly
  });
});

// Handle keyboard input
document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (key === "Enter") {
    // Handle Enter key as equals
    try {
      display.innerHTML = eval(display.innerHTML);
      console.log(display.innerHTML); // Evaluate expression
    } catch (error) {
      display.innerHTML = "Error"; // Handle errors
    }
  } else if (key === "Escape") {
    // Handle Escape key as clear
    display.innerHTML = "0"; // Reset display
  } else if (["(", ")", "+", "-", "*", "/", "."].includes(key)) {
    // Handle mathematical operators and brackets
    if (display.innerHTML === "0" && key !== ".") {
      display.innerHTML = ""; // Clear display if it starts with 0
    }
    display.innerHTML += key; // Add the key to the display
  } else if (!isNaN(key)) {
    // Handle numeric keys
    if (
      display.innerHTML === "0" ||
      display.innerHTML === "Error" ||
      display.innerHTML === "("
    ) {
      display.innerHTML = ""; // Clear display if it starts with 0
    }
    display.innerHTML += key; // Add the number to the display
  }
});

// Initialize Speech Recognition
let recognition;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true; // Keep listening until stopped
  recognition.interimResults = false; // Only return final results
  recognition.lang = "en-US"; // Set language to English
} else {
  console.error("Speech Recognition API is not supported in this browser.");
}

// Add a click event listener to the recording icon
recordingIcon.addEventListener("click", function () {
  // Toggle the background color of the recording container
  if (recording_container.style.backgroundColor === "tomato") {
    recording_container.style.backgroundColor = ""; // Reset to default
    soundwaveContainer.innerHTML = ""; // Clear the soundwave container
    soundwaveContainer.classList.remove("animate-soundwave"); // Remove animation class

    // Stop speech recognition
    if (recognition) {
      recognition.stop();
    }
  } else {
    recording_container.style.backgroundColor = "tomato"; // Set to tomato
    soundwaveContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <path d="M4 16h2v4H4zm4-4h2v12H8zm4 8h2v4h-2zm4-12h2v20h-2zm4 8h2v4h-2zm4-4h2v12h-2zm4-4h2v4h-2z"></path>
            </svg>
        `; // Add a wave icon
    soundwaveContainer.classList.add("animate-soundwave"); // Add animation class

    // Start speech recognition
    if (recognition) {
      recognition.start();
    }
  }

  // Handle speech recognition results
  if (recognition) {
    recognition.addEventListener("result", function (event) {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      display.innerHTML += transcript; // Append the recognized speech to the display
      console.log(transcript);
    });

    recognition.addEventListener("error", function (event) {
      console.error("Speech recognition error:", event.error);
    });
  }

  // Check the current icon and toggle it
  if (
    recordingIcon.innerHTML ===
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="recording"><path d="M16 23c3.865 0 7-3.135 7-7V8c0-3.865-3.135-7-7-7S9 4.135 9 8v8c0 3.865 3.135 7 7 7zm-3-9h-2v-1h2a1 1 0 1 0 0-2h-2v-1h2a1 1 0 1 0 0-2h-2c0-2.757 2.243-5 5-5s5 2.243 5 5h-2a1 1 0 1 0 0 2h2v1h-2a1 1 0 1 0 0 2h2v1h-2a1 1 0 1 0 0 2h2v1h-2a1 1 0 1 0 0 2h2c0 2.757-2.243 5-5 5s-5-2.243-5-5h2a1 1 0 1 0 0-2z"></path><path d="M26 16h-2c0 4.411-3.589 8-8 8s-8-3.589-8-8H6c0 5.177 3.954 9.445 9 9.949V29h-3v2h8v-2h-3v-3.051c5.046-.504 9-4.772 9-9.949z"> </path> </svg>'
  ) {
    // Change to another icon
    recordingIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 4a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 5h2v8h-2zm0 10h2v2h-2z"></path></svg>';
  } else {
    // Change back to the original icon
    recordingIcon.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="recording"><path d="M16 23c3.865 0 7-3.135 7-7V8c0-3.865-3.135-7-7-7S9 4.135 9 8v8c0 3.865 3.135 7 7 7zm-3-9h-2v-1h2a1 1 0 1 0 0-2h-2v-1h2a1 1 0 1 0 0-2h-2c0-2.757 2.243-5 5-5s5 2.243 5 5h-2a1 1 0 1 0 0-2h2v1h-2a1 1 0 1 0 0 2h2v1h-2a1 1 0 1 0 0 2h2v1h-2a1 1 0 1 0 0 2h2c0 2.757-2.243 5-5 5s-5-2.243-5-5h2a1 1 0 1 0 0-2z"></path><path d="M26 16h-2c0 4.411-3.589 8-8 8s-8-3.589-8-8H6c0 5.177 3.954 9.445 9 9.949V29h-3v2h8v-2h-3v-3.051c5.046-.504 9-4.772 9-9.949z"> </path> </svg>';
  }
});
