import React from "react";
import "./Footer.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

const Footer = () => {
  return (
    <MDBFooter
      id="Footer"
      bgColor="light"
      className="text-center text-lg-start text-muted"
    >
      <section className="Footer">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <img
                className="footer-logo"
                src="https://res.cloudinary.com/djunroohl/image/upload/v1724065539/Chalmers_University_of_Technology_bdskot.svg"
                alt="Chalmers logo"
              />
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <MDBIcon color="secondary" icon="home" className="me-2" />
                Chalmers tekniska högskola<br></br> 412 96 Göteborg
              </p>
              <p>
                <MDBIcon color="secondary" icon="envelope" className="me-3" />
                che@chalmers.se
              </p>
              <p>
                <MDBIcon color="secondary" icon="phone" className="me-3" />{" "}
                031-772 1000
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a
            href="https://www.facebook.com/chalmersuniversityoftechnology/"
            className="me-4 text-reset"
          >
            <MDBIcon color="secondary" fab icon="facebook-f" />
          </a>
          <a
            href="https://www.youtube.com/chalmersuniversity"
            className="me-4 text-reset"
          >
            <MDBIcon color="secondary" fab icon="youtube" />
          </a>
          <a
            href="https://www.instagram.com/chalmers.university/"
            className="me-4 text-reset"
          >
            <MDBIcon color="secondary" fab icon="instagram" />
          </a>
          <a
            href="https://www.linkedin.com/school/chalmers-university-of-technology/?originalSubdomain=se"
            className="me-4 text-reset"
          >
            <MDBIcon color="secondary" fab icon="linkedin" />
          </a>
        </div>
      </section>

      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © 2024 Copyright:
        <a className="text-reset fw-bold" href="/">
          MÅSTE
        </a>
      </div>
    </MDBFooter>
  );
};

export default Footer;
