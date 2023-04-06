const wrapper = document.querySelector(".wrapper"),
    selectBtn = wrapper.querySelector(".select-btn");

selectBtn.addEventListener("click", () => {
    wrapper.classList.toggle("active");
});

var listItems = document.querySelectorAll(".options");
var submitButton = document.getElementById("submit-button");

listItems.forEach(function(item) {
  item.addEventListener("click", function() {
    submitButton.style.display = "block";
  });
});


const renderCountries = (data) => {
    const optionsContainer = document.querySelector("ul.options");
    optionsContainer.innerHTML = '';

    data.forEach((country) => {
        const template = `<li>${country.name.common}</li>`;
        optionsContainer.insertAdjacentHTML('beforeend', template);
    })

    const countries = document.querySelectorAll('.options li');
    const countrySpan = document.querySelector('.select-btn span')

    countries.forEach((country) => {

        country.addEventListener('click', () => {
            const currentCountry = data.find((item) => item.name.common.includes(country.textContent));

            console.log("DDx", currentCountry)

            countrySpan.textContent = country.textContent;
            wrapper.classList.toggle("active");

            localStorage.setItem("current-country", JSON.stringify(currentCountry))

        })
    })
}

let countryData;
const loadCountries = () => {
    const countriesLoader = document.querySelector('.loader-container');

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '56bbf4478emshb077a99ea3e813ep1bda73jsn16cef74dce25',
            'X-RapidAPI-Host': 'country-facts.p.rapidapi.com'
        }
    };

    countriesLoader.classList.remove('hidden');

    // fetch('https://country-facts.p.rapidapi.com/all', options)
    fetch('https://cyrruscodex.onrender.com/countries')

        .then(response => response.json())
        .then(response => {

            countryData = response.data;
            console.log(countryData)

            countriesLoader.classList.add('hidden');

            renderCountries(countryData)

        })
        .catch(err => console.error(err));



}

loadCountries();


const searchInput = document.querySelector('.search-country');

searchInput.addEventListener('keyup', (e) => {
    const filteredData = countryData.filter((datum) => datum.name.common.toLowerCase().includes(e.target.value.toLowerCase()));
    renderCountries(filteredData);
})




