import React, { useState, useEffect } from "react";

function CountriesTrivia() {
  const [input, setInput] = useState("");
  const [capital, setCapital] = useState("");
  const [result, setResult] = useState("");
  // const [country, setCountry] = useState('');

  // Function to fetch the capital from the backend
  const fetchCapital = () => {
    // Send a GET request to the backend
    fetch("http://localhost:3000/capital")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("data: ", data);
        setCapital(data || "Error fetching capital"); // Set the capital from the backend response
        // setCountry(data.name || 'Error fetching country'); // Set the country from the backend response
      })
      .catch((error) => {
        console.error("Error:", error);
        setCapital("Error fetching country details");
      });
  };

  // Fetch the capital when the component mounts
  useEffect(() => {
    fetchCapital();
  }, []); // Empty dependency array to only run once

  // Function to handle form submission
  const validate = (e) => {
    e.preventDefault(); // Prevent the page from refreshing
    console.log("in verification func");

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
        setResult(data); // Set the capital from the backend response

        // return true or false to the user
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Guess the Country!</h1>
      <p>Can you guess the country based on its capital city?</p>
      {/* Display the capital */}
      <p>Capital: {capital}</p>
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
      {/* <p>{JSON.stringify(result)}</p> */}
      <p>{result ? "ok sporcle whiz" : "lol no"}</p>
      {/* if (result) {<p>You geographical genius</p>} else {<p>lol no</p>} */}
      {/* Button to fetch a new capital */}
      <button onClick={fetchCapital}>Get a New Capital</button>
    </div>
  );
}

export default CountriesTrivia;
