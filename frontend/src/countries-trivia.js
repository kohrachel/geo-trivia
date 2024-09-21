import React, { useState, useEffect } from "react";

function CountriesTrivia() {
  const [input, setInput] = useState("");
  const [countryDetails, setCountryDetails] = useState("");
  const [capital, setCapital] = useState("");
  const [result, setResult] = useState("");
  const [hints, setHints] = useState("");
  let [numHints, setNumHints] = useState(0);
  let flagURL = "";

  // Function to fetch country details from the backend
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
        console.log("hint: ", data);

        // // get all the hints
        // const languages = Object.values(data.language);
        // let hintList = [];

        // hintList[0] = data.region;

        // for (let index = 0; index < languages.length; index++) {
        //   console.log("current language: ", languages[index]);
        //   hintList[index + 1] = languages[index];
        // }

        // console.log("region: ", hintList[0]);
        // console.log("all hints: ", hintList);

        // setHints(hintList || "Error setting hints");

        setHints(printHints(data));

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
    return allHints;
    console.log(allHints);
    console.log("allHints[0]: ", allHints[0]);
    console.log("allHints[1]: ", allHints[1]);

    console.log("numHints before: ", numHints);

    if (numHints >= allHints.length) {
      return "You ran out of hints. Too bad you suck at this.";
    }
    let newNum = numHints + 1;

    if (numHints === 0) {
      setNumHints(newNum);
      return `This place is in the region of ${allHints[0]}`;
    }

    setNumHints(newNum);
    console.log("numHints after: ", numHints);

    return `They speak ${allHints[numHints - 1]} in this mysterious place`;
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
      <h3>Can you guess the country based on some clues?</h3>
      {/* Display the capital */}
      {/* {console.log("country details: ", countryDetails)} */}
      {/* {console.log("capital (frontend): ", countryDetails.capital)} */}
      <p>Capital: {countryDetails.capital}</p>
      <p>Fun facts:</p>
      <p>{countryDetails.facts}</p>
      <p>Flag: </p>
      {countryDetails.flag && <img src={countryDetails.flag.png}></img>}
      <br></br>
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
      <br></br>
      {/* Button to fetch a new capital */}
      <button onClick={fetchCountryDetails}>
        I rage quit, give me a new capital
      </button>
    </div>
  );
}

export default CountriesTrivia;
