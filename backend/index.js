import "dotenv/config";
import OpenAI from "openai";
import express from "express";
import axios from "axios";
import cors from "cors";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

async function getFacts(country) {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Return 1 paragraph of not more than 30 words containing 3 statistics about ${country}. You are not allowed to explicitly mention ${country}.`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  return chatCompletion.choices[0].message.content;

  // console.log(chatCompletion.choices[0].message.content);
}

const app = express();
const port = 3000;

// REST Countries API endpoint
const countriesApiUrl =
  "https://restcountries.com/v3.1/independent?status=true";

let countryDetails = {};
let hints = [];
let numHints = 0;

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
    const language = Object.values(selectedCountry.languages);
    const region = selectedCountry.region;
    const flag = selectedCountry.flags;

    const facts = await getFacts(name);

    countryDetails = { name, officialName, altSpellings, capital, flag, facts };

    hints[0] = region;

    for (let index = 0; index < language.length; index++) {
      hints[index + 1] = language[index];
    }

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
  numHints = 0;
  const countryDetails = await getCountryDetails();

  res.json(countryDetails); // Respond with the country's details in JSON format
});

// Default GET endpoint to return a capital
app.get("/capital", async (req, res) => {
  res.json(countryDetails.capital); // Respond with the capital in JSON format
});

// Default GET endpoint to return a capital
app.get("/hint", async (req, res) => {
  if (numHints >= hints.length) {
    res.json("You ran out of hints. Too bad you suck at this.");
  } else if (numHints === 0) {
    numHints++;
    res.json(`This place is in the region of ${hints[0]}`);
  } else {
    numHints++;

    res.json(`They speak ${hints[numHints - 1]} in this mysterious place`);
  }
});

// Default POST endpoint to validate user input
app.post("/validate", async (req, res) => {
  const input = req.body.input.toLowerCase().trim(); // Receive the input from the frontend

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
