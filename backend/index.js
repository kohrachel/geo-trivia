const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3000;

// REST Countries API endpoint
const countriesApiUrl = "https://restcountries.com/v3.1/all";

let countryDetails = {};

// Function to get a country's capital
async function getCapital() {
  try {
    const response = await axios.get(countriesApiUrl);
    const countries = response.data;

    // Pick a random country
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];

    // Get the country's capital
    const capital = randomCountry.capital
      ? randomCountry.capital[0]
      : "No capital found";

    const name = randomCountry.name.common;
    countryDetails = { name, capital };
    return capital;
  } catch (error) {
    console.error("Error fetching country data:", error);
    return "Error generating capital.";
  }
}

app.use(cors());
app.use(express.json());

// Default GET endpoint to return a capital
app.get("/capital", async (req, res) => {
  // const capital = await getCapital();
  const countryDetails = await getCapital();
  res.json(countryDetails); // Respond with the capital in JSON format
});

// Default POST endpoint to validate user input
app.post("/validate", async (req, res) => {
  //   console.log("req.body.input: ", req.body);
  const input = req.body.input; // Receive the input from the frontend

  console.log("Name? : ", countryDetails.name);
  if (input === countryDetails.name) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
