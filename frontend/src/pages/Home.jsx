import React from "react";
// import { pushRotate as Menu } from "react-burger-menu";
import "clarity-ui/clarity-ui.min.css"; // Import Clarity UI CSS
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@clr/icons/shapes/technology-shapes.js";
import "@cds/core/button/register.js";

import { MDBFooter, MDBIcon, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';



function Home() {
  return (
    <div className="App">
      <div id="outer-container">
        <main id="page-wrap">
          <main className="text">
            <section className="columns">
              <div className="column">
                <img className="home_image1" src="https://res.cloudinary.com/djunroohl/image/upload/c_crop,h_1701,w_600/v1720396474/greenfields_jcajzf.jpg" alt="Image 1" />
              </div>
              <div className="column">
                <div>
                  <h2>Nuclear Recycling</h2>
                  <p>
                    Nuclear recycling, also known as nuclear fuel reprocessing,
                    is a process that involves extracting usable materials from
                    spent nuclear fuel. This process helps to reduce the amount
                    of nuclear waste and maximize the energy potential of
                    nuclear fuel.
                  </p>
                  <p>
                    One of the main goals of nuclear recycling is to recover
                    valuable materials such as uranium and plutonium from spent
                    fuel. These materials can be reused in new fuel assemblies,
                    reducing the need for fresh uranium and decreasing the
                    demand for natural resources.
                  </p>
                  <p>
                    In addition to reducing waste and conserving resources,
                    nuclear recycling can also help to improve the overall
                    safety of nuclear power. By removing certain radioactive
                    isotopes from the spent fuel, the risk of long-term storage
                    and potential leakage is minimized.
                  </p>
                  <p>
                    Furthermore, nuclear recycling can contribute to the
                    development of advanced nuclear technologies. The recovered
                    materials can be used in next-generation reactors, such as
                    fast neutron reactors, which have the potential to generate
                    more energy and produce less waste compared to traditional
                    reactors.
                  </p>
                  <p>
                    However, it is important to note that nuclear recycling is a
                    complex and highly regulated process. It requires advanced
                    technologies and strict adherence to safety protocols to
                    ensure the proper handling and disposal of radioactive
                    materials.
                  </p>
                  <p>
                    Overall, nuclear recycling offers a promising solution for
                    managing nuclear waste and maximizing the energy potential
                    of nuclear fuel. Continued research and development in this
                    field can lead to more sustainable and efficient use of
                    nuclear power.
                  </p>
                </div>
              </div>
              <div className="column">
                <img className="home_image2"src="https://res.cloudinary.com/djunroohl/image/upload/c_crop,e_improve,g_auto,h_1707,w_600,x_0/v1720396474/greenfields_jcajzf.jpg" alt="Image 2" />
              </div>
            </section>
          </main>
        </main>
      </div>
    </div>
  );
}

export default Home;
