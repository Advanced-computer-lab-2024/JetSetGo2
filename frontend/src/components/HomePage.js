import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Carousel, Card, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import img1 from './logoo4.JPG';
import img2 from './logoonly.JPG';


const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="page-background">
      {/* Navbar */}
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand href="#">
            <img src={img1} alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" className={`home-link ${location.pathname === '/' ? 'selected' : ''}`}>Home</Nav.Link>
              <Nav.Link href="#" className={`nothome-link ${location.pathname === '/about' ? 'selected' : ''}`}>About Us</Nav.Link>
              <Nav.Link className={`nothome-link ${location.pathname === '/tourist-signup' ? 'selected' : ''}`} onClick={() => navigate("/tourist-signup")}>Signup</Nav.Link>
              <Nav.Link className={`nothome-link ${location.pathname === '/login' ? 'selected' : ''}`} onClick={() => navigate("/login")}>Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Image Slideshow */}
      <Carousel >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhcmlzfGVufDB8fDB8fHww"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Your Getaway to Paris</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://i.pinimg.com/originals/cf/2f/ee/cf2fee8c032e6756f538040365ab38cc.jpg"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Vibrant Culture of Madrid</h3>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images7.alphacoders.com/895/thumb-1920-895884.jpg"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Magical Nights Of London</h3>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      

      {/* Amenities and Services Section */}
      <div className="section discover-section">
       
        <Row>
        <Col md={4}>
            <Card className="mb-4 card-hover">
              <Card.Img variant="top" src="https://png.pngtree.com/thumb_back/fh260/background/20230805/pngtree-the-flight-path-on-both-sides-of-the-runway-image_12972429.jpg" />
              <Card.Body>
                <Card.Title>Flights</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 card-hover">
              <Card.Img variant="top" src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D" />
              <Card.Body>
                <Card.Title >Hotels</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 card-hover">
              <Card.Img variant="top" src="https://heybus.com.ua/source/[downloader_59.png" />
              <Card.Body>
                <Card.Title>Transportations</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="mb-4 card-hover">
              <Card.Img variant="top" src="https://static.vecteezy.com/system/resources/thumbnails/026/294/687/small/hike-in-the-mountains-photo.jpg" />
              <Card.Body>
                <Card.Title>Itineraries</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 card-hover">
              <Card.Img variant="top" src="https://images.pexels.com/photos/135018/pexels-photo-135018.jpeg?cs=srgb&dl=pexels-joshkjack-135018.jpg&fm=jpg" />
              <Card.Body>
                <Card.Title>Museums</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4 card-hover">
              <Card.Img variant="top" src="https://www.desktopbackground.org/download/o/2014/01/03/695701_great-wall-of-china-wallpapers-hd-of-china-historical-places_1920x1200_h.jpg"/>
              <Card.Body>
                <Card.Title>Historical Places</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
      </div>

      {/* Welcome Section */}
<div className="section welcome-section">
  <h2>JETSETGO</h2>
  <p>Dreaming of your next adventure? Let us make it a reality! Our platform helps you plan every detail of your trip, from discovering hidden gems to organizing flights, accommodations, and activities.</p>
  <img src={img2} alt="Welcome Image" className="welcome-image" />
</div>
      {/* Activities and Itineraries Section */}
      <div className="section">

        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-img">
              <img src="https://images.unsplash.com/photo-1416273567255-8abe875affcd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNob3d8ZW58MHx8MHx8fDA%3D" alt="Activity 1" />
            </div>
            <div className="timeline-content">
              <h3>Feel the Rhythm of Live Music</h3>
              <p>Immerse yourself in the electrifying world of live concerts! From pulsating beats to soulful melodies, experience unforgettable performances that ignite your passion for music. Whether it's a cozy acoustic night or a grand festival, let us help you find the perfect concert to elevate your travel plans.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-img">
              <img src="https://cdn.pixabay.com/photo/2023/07/08/04/58/sunset-8113697_1280.jpg" alt="Activity 2" />
            </div>
            <div className="timeline-content">
              <h3>Escape to Paradise</h3>
              <p>Bask in the sun, feel the sand between your toes, and listen to the soothing waves. Whether you’re craving a serene seaside escape or an adventurous day of water sports, the perfect beach getaway awaits you. Let us guide you to breathtaking coastal destinations for a rejuvenating and unforgettable experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Section */}
<div className="section signup-section">
  <h2>Sign Up Now</h2>
  <p>Join us today and explore the world in a whole new way!</p>
  <div className="signup-options">
    <button className="signup-btn" onClick={() => navigate("/tourist-signup")}>Sign Up as a Tourist</button>
    <button className="signup-btn" onClick={() => navigate("/other-signup")}>Sign Up as a Tour Guide</button>
    <button className="signup-btn" onClick={() => navigate("/other-signup")}>Sign Up as an Advertiser</button>
    <button className="signup-btn" onClick={() => navigate("/other-signup")}>Sign Up as a Seller</button>
  </div>
</div>

      {/* Footer */}
<div className="footer">
  <Container>
    <Row>
      <Col md={4}>
        <h5>Contact Us</h5>
        <p>Email: contact@jetsetgo.com</p>
        <p>Phone: +123 456 7890</p>
      </Col>
      <Col md={4}>
        <h5>Address</h5>
        <p>123 Travel Road</p>
        <p>Adventure City, World 45678</p>
      </Col>
      <Col md={4}>
        <h5>Follow Us</h5>
        <p>Facebook | Twitter | Instagram</p>
      </Col>
    </Row>
  </Container>
</div>
    </div>
  );
};

export default HomePage;