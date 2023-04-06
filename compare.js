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



let countryData = [];
const containers = document.querySelectorAll("ul.options");

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '56bbf4478emshb077a99ea3e813ep1bda73jsn16cef74dce25',
        'X-RapidAPI-Host': 'country-facts.p.rapidapi.com'
    }
};

const loadCountries = () => {
    const countriesLoaders = document.querySelectorAll('.loader-container');

    

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



  const handleCompareCities = async(city1, city2)=>{

    const country1 = countryData.find((country)=>country.capital.includes(city1))?.name?.common;
    const country2 = countryData.find((country)=>country.capital.includes(city2))?.name?.common;


    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '56bbf4478emshb077a99ea3e813ep1bda73jsn16cef74dce25',
            'X-RapidAPI-Host': 'cost-of-living-and-prices.p.rapidapi.com'
        }
      };

    const response1 = await fetch(`https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${city1}&country_name=${country1}`, options);
    const response2 = await fetch(`https://cost-of-living-and-prices.p.rapidapi.com/prices?city_name=${city2}&country_name=${country2}`, options);

        if(!response1.ok || !response2.ok){

        }

        else{
            const data1 = await response1.json();
            const data2 = await response2.json();

            if(data1 && data2){

                const compareData = [];

                data1?.prices?.forEach((price, i)=>{
                  
                    const matches = data2?.prices?.filter((item)=>item.item_name.includes(price.item_name));
                                       
                    if(matches.length > 0)
                        compareData.push({
                            item:price.item_name,
                            category:price.category_name,
                            price1:`${price.usd?.avg}`,
                            price2:`${matches[0].usd?.avg}`
                            
                    })

                });

                const uniqueCategories = Array.from(new Set(compareData.map((datum)=>datum.category)));
                
                const categories = [
                    "Buy Apartment",
                    "Childcare",
                    "Clothing And Shoes",
                    "Markets",
                    "Rent Per Month",
                    "Restaurants",
                    "Salaries And Financing",
                    "Sports And Leisure",
                    "Transportation",
                    "Utilities Per Month"
                ]

                const compareTables = document.querySelectorAll(".compare-table");

    
                compareTables.forEach((table, i)=>{
                    let dataToUse;
                    
                    if(i===0) dataToUse = compareData.filter((el)=>el.category.includes(categories[0]) || el.category.includes(categories[4]))
                    else if(i===1) dataToUse = compareData.filter((el)=>el.category.includes(categories[3]) || el.category.includes(categories[5]) )
                    else if(i===2) dataToUse = compareData.filter((el)=>el.category.includes(categories[8]) )
                    else if(i===3) dataToUse = compareData.filter((el)=>el.category.includes(categories[6]))
                    else if(i===4) dataToUse = compareData.filter((el)=>el.category.includes(categories[9]) || el.category.includes(categories[2]) || el.category.includes(categories[7]) )

                    table.innerHTML = '';
    
                    const temp = `
                            <tr>
                                <td>ITEM</td>
                                <td>${city1}</td>
                                <td>${city2}</td>
                            </tr>
                    `
    
                    table.insertAdjacentHTML("beforeend", temp);
    
                    dataToUse.forEach((datum)=>{
                        const template = `
                                <tr>
                                    <td>${datum.item}</td>
                                    <td>${datum.price1}</td>
                                    <td>${datum.price2}</td>
                                </tr>
                        `;
    
                        table.insertAdjacentHTML("beforeend", template);
    
                    })


                    



                })

                            
           
            }

        }
            

  }

  const compareBtn = document.querySelector(".compareBtn");
  const cityFirst = document.querySelector(".city1");
  const citySecond = document.querySelector(".city2");

  compareBtn.addEventListener('click', ()=>{
    handleCompareCities(cityFirst.textContent, citySecond.textContent)
  })