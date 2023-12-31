import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "b775496c44944543921f202d47afc481";
const CLIENT_SECRET = "0d1288fa707d46589b0c0758705dd404";

function App() {
  // API Access Token
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    };

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
      .catch(error => {
        console.error("Error fetching access token:", error);
      });
  }, []);

  async function search() {
    console.log("Searching For " + searchInput);

    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    };

    fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParameters)
      .then(response => response.json())
      .then(data => {
        const artistID = data.artists.items[0].id;
        console.log("Artist ID:", artistID);
        fetchAlbums(artistID, searchParameters);
      })
      .catch(error => {
        console.error("Error fetching data from Spotify API:", error);
      });
  }

  async function fetchAlbums(artistID, searchParameters) {
    const albumsResponse = await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`, searchParameters);
    const albumsData = await albumsResponse.json();
    setAlbums(albumsData.items);
  }

  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search For Artists'
            type='input'
            onKeyPress={event => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4'>
          {albums.map((album, i) => (
            <Col key={i} className='mb-4'>
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
