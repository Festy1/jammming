import React, { useState, useCallback } from "react";
import "./SearchBar.css";

function SearchBar(props) {
  const [term, setTerm] = useState("");

  const handleTermChange = useCallback((event) => {
    setTerm(event.target.value);
  }, []);

  const search = useCallback(
    (event) => {
      event.preventDefault();
      props.onSearch(term);
    },
    [props.onSearch, term]
  );

  return (
    <div className="SearchBar">
      <input
        value={term}
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
      />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
}

export default SearchBar;
