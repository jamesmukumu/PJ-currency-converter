const dropList = document.querySelectorAll("form select");
const fromCurrency = document.querySelector(".from");
const toCurrency = document.querySelector(".to");
const exchangeIcon = document.querySelector(".fa-exchange-alt");
const getButton = document.querySelector("form button");

const defaultFromCurrency = "USD";
const defaultToCurrency = "KES";

// Populate select tags
dropList.forEach((select) => {
  for (let currency_code in country_list) {
    const selected =
      select === fromCurrency
        ? currency_code === defaultFromCurrency
          ? "selected"
          : ""
        : currency_code === defaultToCurrency
        ? "selected"
        : "";
    const optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    select.insertAdjacentHTML("beforeend", optionTag);
  }

  select.addEventListener("change", (e) => {
    loadFlag(e.target);
  });
});

function loadFlag(element) {
  for (let code in country_list) {
    if (code === element.value) {
      const imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
    }
  }
}

 window.addEventListener("load", () => {
   getExchangeRate();
 });

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});


exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  if (amountVal === "" || amountVal === "0") {
    amount.value = "1";
    amountVal = 1;
  }

  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/b12e72d566da2b9a73b8dfc7/latest/${fromCurrency.value}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value].toFixed(4)
      let totalExRate = (amountVal * exchangeRate)
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    });
}
