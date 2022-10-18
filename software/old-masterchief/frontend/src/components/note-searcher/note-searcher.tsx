import { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';

export default function NoteSearcher() {
  const [term, setTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/notes/search?query=${term}`)
      .then((response) => response.json())
      .then((response) => {
        setSearchResults(response.hits);
      });
  }, [term]);
  console.log(searchResults);

  return (
    <>
      <label htmlFor="search-notes">Search: </label>
      <input
        type="search"
        id="search-notes"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      da
      <ul>
        {searchResults.map((result) => (
          <li>
            <Highlighter
              searchWords={[term]}
              autoEscape
              // @ts-ignore
              textToHighlight={result._source.body}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
