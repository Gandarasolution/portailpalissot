import { Form } from "react-bootstrap";

const Search = ( {setSearch,search}) => {
  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  return (
    <Form.Control
      type="search"
      placeholder="Rechercher"
      aria-label="Search"
      onChange={(e)=> {handleSearch(e)}}
      className="noBorder"
      value={search}
    />
  );
};

export default Search;
