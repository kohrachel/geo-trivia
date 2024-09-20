import React, { useState, useEffect } from "react";

function CountriesTrivia() {
  const [input, setInput] = useState("");
  const [countryDetails, setCountryDetails] = useState("");
  const [capital, setCapital] = useState("");
  const [result, setResult] = useState("");
  const [hints, setHints] = useState("");
  let numHints = 0;
  let flagURL = "";
  // const [country, setCountry] = useState('');

  // Function to fetch the capital from the backend
  const fetchCountryDetails = () => {
    // Send a GET request to the backend
    fetch("http://localhost:3000/country-details")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data: ", data);
        setCountryDetails(data || "Error fetching country details"); // Set the capital from the backend response
        // setCountry(data.name || 'Error fetching country'); // Set the country from the backend response
      })
      .catch((error) => {
        console.error("Error:", error);
        setCountryDetails("Error fetching country details");
      });
  };

  // Function to fetch the capital from the backend
  const fetchCapital = () => {
    return countryDetails.capital;
    // // Send a GET request to the backend
    // fetch("http://localhost:3000/capital")
    //   .then((res) => {
    //     if (!res.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return res.json();
    //   })
    //   .then((data) => {
    //     console.log("data: ", data);
    //     setCapital(data || "Error fetching capital"); // Set the capital from the backend response
    //     // setCountry(data.name || 'Error fetching country'); // Set the country from the backend response
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     setCapital("Error fetching country details");
    //   });
  };

  // Function to fetch the capital from the backend
  const fetchHint = () => {
    // Send a GET request to the backend
    fetch("http://localhost:3000/hint")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("hints: ", data);

        // get all the hints
        const languages = Object.values(data.languages);
        let hintList = {};

        hintList[0] = data.region;

        for (let index = 0; index < languages.length; index++) {
          console.log("current language: ", languages[index]);
          hintList[index + 1] = languages[index];
        }

        console.log("region: ", hintList[0]);
        console.log("all hints: ", hintList);

        // setHints(hintList || "Error setting hints");

        setHints(printHints(hintList));
        // setHints(languages || "Error setting hints");

        // setHints(data || "Error setting hints"); // Set the capital from the backend response
      })
      .catch((error) => {
        console.error("Error:", error);
        setCapital("Error fetching hints");
      });
  };

  // Fetch the capital when the component mounts
  useEffect(() => {
    fetchCountryDetails();
  }, []); // Empty dependency array to only run once
  useEffect(() => {
    fetchCapital();
  }, []); // Empty dependency array to only run once

  // Function to handle form submission
  const validate = (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    console.log("in verification function");

    // Make a POST request to the backend
    fetch("http://localhost:3000/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: input }), // Send the input string as part of the request body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Truth value of guess: ", data);
        setResult(printResult(data)); // Set the capital from the backend response
        // printResult(data);
        // return true or false to the user
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const printHints = (allHints) => {
    if (numHints >= allHints.length) {
      return "You ran out of hints. Too bad you suck at this.";
    }
    if (numHints === 0) {
      numHints++;
      return "This place is in the " + hints[0] + " region";
    }
    return "They speak " + hints[numHints++] + " in this mysterious place";
  };

  const printResult = (result) => {
    const resCorrectAns = [
      "🏆 ok geography whiz 🏆",
      "🏆 did you study for this instead of your test? 🏆",
      "🏆 ding ding ding 🏆",
      "🏆 okay you googled that didn't you 🏆",
      "🏆 einstein would be jealous of you 🏆",
    ];

    const resWrongAns = [
      "❌ no lol ❌",
      "❌ your american is showing ❌",
      "❌ ...wrong ❌",
      "❌ really? ❌",
      "❌ no, you can't get partial credit ❌",
      "❌ it's okay, we all have bad days ❌",
    ];
    const responseOk =
      resCorrectAns[Math.floor(Math.random() * resCorrectAns.length)];
    const responseNotOk =
      resWrongAns[Math.floor(Math.random() * resWrongAns.length)];
    return result ? responseOk : responseNotOk;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Guess the Country!</h1>
      <p>Can you guess the country based on its capital city and flag?</p>
      {/* Display the capital */}
      {/* {console.log("country details: ", countryDetails)} */}
      {/* {console.log("capital (frontend): ", countryDetails.capital)} */}
      <p>Capital: {countryDetails.capital}</p>
      <p>Fun facts:</p>
      <p>{countryDetails.facts}</p>
      <p>Flag: </p>
      {countryDetails.flag && <img src={countryDetails.flag.png}></img>}
      <br></br>
      {/* Form to input the string literal */}
      <form onSubmit={validate}>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            // console.log(input);
            // console.log(e.target.value);
            setInput(e.target.value);
          }}
          placeholder="Guess the country!"
        />
        <button type="submit">Guess</button>
      </form>
      <br></br>
      <p>{result}</p>
      <br></br>
      {/* <p>{JSON.stringify(result)}</p> */}
      {/* Button to get a hint */}
      <button onClick={fetchHint}>Stuck? Get a hint!</button>
      <br></br>

      {hints}

      <br></br>

      {/* Button to fetch a new capital */}
      <button onClick={fetchCountryDetails}>
        I rage quit, give me a new capital
      </button>
    </div>
  );
}

export default CountriesTrivia;
