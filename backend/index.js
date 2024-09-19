const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

// REST Countries API endpoint
const countriesApiUrl = "https://restcountries.com/v3.1/all";

let countryDetails = {};
let hints = {};

async function getCountryDetails() {
  try {
    const response = await axios.get(countriesApiUrl);
    const countries = response.data;

    // Pick a random country
    const selectedCountry =
      countries[Math.floor(Math.random() * countries.length)];

    // Get the country's capital
    const capital = selectedCountry.capital
      ? selectedCountry.capital[0]
      : "No capital found";

    const name = selectedCountry.name.common;
    const officialName = selectedCountry.name.official;
    const altSpellings = selectedCountry.altSpellings;
    const languages = selectedCountry.languages;
    const region = selectedCountry.region;
    const flag = selectedCountry.flags;

    countryDetails = { name, officialName, altSpellings, capital, flag };
    hints = { languages, region };

    return countryDetails;
  } catch (error) {
    console.error("Error fetching country data:", error);
    return "Error fetching country data.";
  }
}

// Function to get a country's capital
async function getCapital() {
  try {
    return countryDetails.capital;
  } catch (error) {
    console.error("Error fetching country data:", error);
    return "Error fetching capital.";
  }
}

app.use(cors());
app.use(express.json());

// Default GET endpoint to return a capital
app.get("/country-details", async (req, res) => {
  // const capital = await getCapital();
  const countryDetails = await getCountryDetails();
  // console.log("country details: ", countryDetails);

  res.json(countryDetails); // Respond with the country's details in JSON format
});

// Default GET endpoint to return a capital
app.get("/capital", async (req, res) => {
  // const capital = await getCapital();
  // const countryDetails = await getCountryDetails();
  res.json(countryDetails.capital); // Respond with the capital in JSON format
});

// Default GET endpoint to return a capital
app.get("/hint", async (req, res) => {
  // const capital = await getCapital();
  console.log("hints: ", hints);
  res.json(hints); // Respond with the hints in JSON format
});

// Default POST endpoint to validate user input
app.post("/validate", async (req, res) => {
  //   console.log("req.body.input: ", req.body);
  const input = req.body.input.toLowerCase().trim(); // Receive the input from the frontend

  console.log({ countryDetails });
  console.log("Name : ", countryDetails.name);

  let matchesSpellings = false;
  if (
    input === countryDetails.name.toLowerCase() ||
    input === countryDetails.officialName.toLowerCase()
  ) {
    matchesSpellings = true;
  }

  for (let i = 0; i < countryDetails.altSpellings.length; i++) {
    if (input === countryDetails.altSpellings[i].toLowerCase())
      matchesSpellings = true;
  }

  if (matchesSpellings) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
