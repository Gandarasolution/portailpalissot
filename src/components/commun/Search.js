import { Form } from "react-bootstrap";

const Search = ( {setSearch}) => {
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <Form.Control
      type="search"
      placeholder="Rechercher"
      aria-label="Search"
      onChange={handleSearch}
    />
  );
};

export default Search;
