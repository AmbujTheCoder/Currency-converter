const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
dropdowns.forEach((select) => {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
});

// Function to update flag based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode] || "UN"; // Default to unknown if missing
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Fetch exchange rate and update UI
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);

  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}currencies/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch data");

    let data = await response.json();
    let rates = data[fromCurr.value.toLowerCase()];

    if (rates && rates[toCurr.value.toLowerCase()]) {
      let rate = rates[toCurr.value.toLowerCase()];
      let finalAmt = amtVal * rate;
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmt.toFixed(2)} ${
        toCurr.value
      }`;
    } else {
      throw new Error("Invalid currency data");
    }
  } catch (error) {
    msg.innerText =
      "Error: Unable to retrieve conversion data. Please try again.";
    console.error(error);
  }
});
