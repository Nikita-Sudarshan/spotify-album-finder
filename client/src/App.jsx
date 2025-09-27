import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [albums, setAlbums] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setAlbums(data.items || []);
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Spotify Album Finder</h1>
      <input
        type="text"
        placeholder="Search albums..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "0.5rem", width: "250px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: "1rem", padding: "0.5rem" }}>
        Search
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "2rem" }}>
        {albums.map((album) => (
          <div key={album.id} style={{ margin: "1rem", width: "150px", textAlign: "center" }}>
            <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img src={album.images[0]?.url} alt={album.name} style={{ width: "150px" }} />
              <p className="album-name">{album.name}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
