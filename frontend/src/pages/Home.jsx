import React from "react";
// import { pushRotate as Menu } from "react-burger-menu";
import "clarity-ui/clarity-ui.min.css"; // Import Clarity UI CSS
import "clarity-icons/clarity-icons.min.css"; // Import Clarity Icons CSS
import "clarity-icons/shapes/technology-shapes.js"; // Import Clarity Icons shapes
import "@cds/core/button/register.js"; // Import Clarity Button component
import "@cds/core/icon/register.js"; // Import Clarity Icon component
import "@cds/core/dropdown/register.js"; // Import Clarity Dropdown component
import "@cds/core/divider/register.js"; // Import Clarity Divider component
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@clr/icons/clr-icons.min.css";
import "@clr/icons/shapes/technology-shapes.js";
import "../App.css";


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
                  <p>
                  The project Multidisciplinära Åtaganden för Sveriges gen-IV Teknologi och Expertis
                  (Multidisciplinary Commitments for Sweden&#39;s Gene IV Technology and Expertise),
                  MÅSTE, lays the foundation for real understanding of the knowledge and
                  challenges for the implementation of a Gen IV electricity production system. It also
                  works as a ground for increasing the base line of younger scientist and professionals
                  in the radiation science sector bringing a huge benefit for Sweden. MÅSTE not only
                  brings the ability to continue the existing nuclear fleet but it is also the corner stone
                  for any new build power system and replies to other needs such as radiological
                  awareness, protection and hospital capabilities.
                  MÅSTE promotes the younger research leaders and, in this way, contributes to
                  sustainability of the high academic level at the Swedish universities where many
                  senior researchers will retire in the next 1-2 decades.
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
