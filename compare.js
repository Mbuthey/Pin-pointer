let tabs = document.querySelectorAll('.tabs__toggle'),
    contents = document.querySelectorAll('.tabs__content');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        contents.forEach((content) => {
            content.classList.remove('is-active');
        });
        tabs.forEach((tab) => {
            tab.classList.remove('is-active');
        });
        contents[index].classList.add('is-active');
        tabs[index].classList.add('is-active');
    });
});



const wrappers = document.querySelectorAll(".wrapper"),
    selectBtns = document.querySelectorAll(".select-btn");

selectBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        wrappers[i].classList.toggle("active");
    });

})


const timezone = async ([lat, lng]) => {
    let time = new Date().toLocaleString();

    const timeData = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=MSZM8JQITRJK&format=json&by=position&lat=${lat}&lng=${lng}`)

    if (timeData.ok) {
        const data = timeData.json();
        if (data) return data.formatted
    }

    return time;
}


const firstSelectCity = document.querySelector('.first-city-select');
const aboutCityImage = document.querySelector(".about-city img");
const aboutDetails = document.querySelectorAll(".about-city .city span");
const mapContainer = document.querySelector(".gmap_canvas iframe");
const timezoneContainer = document.querySelector('.localtime');
const attrDetails = document.querySelectorAll('.attr-details p');
const detailsTitle = document.querySelector(".details-ttle h3");


const updateAboutDetails = (capital, country, flag, population, latlng, region, subregion, currency, callingCode) => {
    aboutDetails[0].textContent = capital;
    aboutDetails[1].textContent = country;
    aboutCityImage.src = flag;
    mapContainer.src = `https://maps.google.com/maps?q=Lavinton%20${capital.replace("", "+")},%20%${country.replace("", "+")}&t=&z=13&ie=UTF8&iwloc=&output=embed`

    attrDetails[0].textContent = `${region}`;
    attrDetails[1].textContent = `${population} million`;
    attrDetails[2].textContent = `Lat: ${latlng[0]}, Lng:${latlng[1]}`
    attrDetails[3].textContent = `${subregion}`;
    attrDetails[4].textContent = `${currency}`;
    attrDetails[5].textContent = `${callingCode}`;

    detailsTitle.textContent = `About ${capital}`


}

const initialCountryData = JSON.parse(localStorage.getItem("current-country"));

if (initialCountryData) {
    // const currentTimeZone = timezone(initialCountryData.latlng);

    firstSelectCity.textContent = initialCountryData.capital[0];
    updateAboutDetails(
        initialCountryData.capital[0],
        initialCountryData.name.common,
        initialCountryData.flag,
        (Number(initialCountryData.population.split(",").join("")) / 1000000).toFixed(2),
        initialCountryData.latlng,
        initialCountryData.region,
        initialCountryData.subregion,
        Object.entries(initialCountryData.currencies)[0][1].name,
        initialCountryData.callingCodes[0]
    )

    // console.log(Object.entries(initialCountryData.currencies)[0][1].name)
}




const renderCountries = (data, container, key) => {
    container.innerHTML = '';

    data.forEach((country) => {
        const template = `<li>${country.capital[0]}</li>`;
        container.insertAdjacentHTML('beforeend', template);
    })

    const countries = container.querySelectorAll('.options li');
    const countrySpan = document.querySelectorAll('.select-btn span')[key];

    countries.forEach((country) => {
        country.addEventListener('click', () => {
            countrySpan.textContent = country.textContent;
            wrappers[key].classList.toggle("active");

            const selectedCountry = data.find((el) => el.capital[0].includes(country.textContent));
            console.log(selectedCountry);

            if (key === 0 && selectedCountry) {
                updateAboutDetails(
                    selectedCountry.capital[0],
                    selectedCountry.name.common,
                    selectedCountry.flag,
                    (Number(selectedCountry.population.split(",").join("")) / 1000000).toFixed(2),
                    selectedCountry.latlng,
                    selectedCountry.region,
                    selectedCountry.subregion,
                    Object.entries(selectedCountry.currencies)[0][1].name,
                    selectedCountry.callingCodes[0]
                )
            }

        })
    })
}



let countryData;
const containers = document.querySelectorAll("ul.options");

const loadCountries = () => {
    const countriesLoaders = document.querySelectorAll('.loader-container');

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '56bbf4478emshb077a99ea3e813ep1bda73jsn16cef74dce25',
            'X-RapidAPI-Host': 'country-facts.p.rapidapi.com'
        }
    };

    countriesLoaders[0].classList.remove('hidden');
    countriesLoaders[1].classList.remove('hidden');

    // fetch('https://country-facts.p.rapidapi.com/all', options)
    fetch('https://cyrruscodex.onrender.com/countries')

        .then(response => response.json())
        .then(response => {

            countryData = response.data;
            console.log(countryData)

            countriesLoaders[0].classList.add('hidden');
            countriesLoaders[1].classList.add('hidden');

            renderCountries(countryData, containers[0], 0);
            renderCountries(countryData, containers[1], 1);


        })
        .catch(err => console.error(err));

}

loadCountries();


const searchInputs = document.querySelectorAll('.search-country');

searchInputs.forEach((searchInput, key) => {
    searchInput.addEventListener('keyup', (e) => {
        const filteredData = countryData.filter((datum) => datum.capital[0].toLowerCase().includes(e.target.value.toLowerCase()));
        renderCountries(filteredData, containers[key], key);
    })

})


// http://worldtimeapi.org/api/timezone/Indian/Mauritius



// /-----------------------------/ 
const apiUrl = "https://api.example.com/data";
const table = document.getElementById("data-table");

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Add header row
    const headerRow = document.createElement("tr");
    for (const header of Object.keys(data[0])) {
      const headerCell = document.createElement("th");
      headerCell.innerText = header;
      headerRow.appendChild(headerCell);
    }
    table.appendChild(headerRow);

    // Add data rows
    for (const row of data) {
      const dataRow = document.createElement("tr");
      for (const value of Object.values(row)) {
        const dataCell = document.createElement("td");
        dataCell.innerText = value;
        dataRow.appendChild(dataCell);
      }
      table.appendChild(dataRow);
    }
  });
