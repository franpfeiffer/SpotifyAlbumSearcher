import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect} from 'react';


const CLIENT_ID = "b775496c44944543921f202d47afc481";
const CLIENT_SECRET = "0d1288fa707d46589b0c0758705dd404";



function App() {
  //API Access Tokem
  const [ searchInput, setSearchInput] = useState("");
  const [ accessToken, setAccessToken] = useState("");
  const [ albums, setAlbums] = useState([]);


  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('http://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, []) 

  //Search
  async function search(){
    console.log("Searching For " + searchInput);
    
    //Get request using  search to get the artist id
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'applications/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistIDResponse = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters);
    var artistIDData = await artistIDResponse.json();
    var artistID = artistIDData.artists.items[0].id;

    console.log("artist id is: " + artistID);

    //Get request with artist id grab all the albums from that artist
    var returnedAlbums = fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAlbums(data.items);
      }); 

    //Display those albums to the user
  }
  console.log(albums);
  
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
        <Row className='mx-2 row row-cols-4'>
          {albums.map( (album, i) => {
            console.log(album);
            return(
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;