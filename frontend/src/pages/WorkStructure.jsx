import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WorkStructure.css"; // Import the CSS file for styling

const WS = () => {
  const [svgContent, setSvgContent] = useState("");
  const [selectedElement, setSelectedElement] = useState(null);

  const elementTexts = {
    WP1: (
      <>
        <strong>Work package 1: Separation and fuel</strong>
        <br />
        <br />
        Gen IV nuclear power systems are based on the principle of closing the fuel
        cycle. This means that recycling of fissile and fertile material is a requirement
        to truly qualify as a Gen IV system. Fuel recycling consists of two main parts,
        separation of actinides from the used fuel and fuel refabrication.
        Harmonizing the separation and production processes will be key for any
        successful Gen IV implementation and creates core of the work package.
      </>
    ),
    WP2: (
      <>
        <strong>Work package 2: Core monitoring</strong>
        <br />
        <br />
        Gen IV reactors, especially when run in (nearly) autonomous conditions,
        require improved monitoring techniques. Using the fluctuations in neutron
        flux (neutron noise) measured by neutron detectors represents an attractive
        option, as neutrons can "sense" any perturbation even far away from the
        actual perturbation. The WP2 develops a neutron noise-based core
        monitoring method for Gen IV systems.
      </>
    ),
    WP3: (
      <>
        <strong>Work package 3: 3S for Gen IV systems</strong>
        <br />
        <br />
        Gen IV systems require the development of nuclear Safety, Security and
        Safeguards (3S) measures. These features aim to increase the inherent
        properties reducing the risks and consequences of accidents,
        unauthorised access to, or theft of, nuclear materials, and ensuring system
        resilience against nuclear proliferation. The WP3 addresses 3S-challenges in
        Gen IV systems such as fast reactors and facilities for separation, fuel
        manufacturing and storage.
      </>
    ),
    WP4: (
      <>
        <strong>Work package 4: Structural materials</strong>
        <br />
        <br />
        The harsh environment in Gen IV reactors, with high temperatures,
        aggressive media and high neutron dose rates, puts tough demands on the
        materials. Therefore, the understanding of irradiation damage needs to be
        improved, both from a theoretical and a practical perspective. This will be
        realized by developing new modelling methods, as well as performing
        characterization of ion irradiated materials relevant for the most promising
        Gen IV concepts.
      </>
    ),
    WP5: (
      <>
        <strong>Work package 5: Radiation protection</strong>
        <br />
        <br />
        The nuclide inventory in Gen IV systems have different chemical form and
        contain more plutonium than LWRs. Thus, new accident source terms and
        countermeasure strategies will be considered for planning of emergency
        preparedness, including possible adaptations of radiation safety
        regulations.
      </>
    ),
    WP6: (
      <>
        <strong>Work package 6: Nuclear data and uncertainty analysis</strong>
        <br />
        <br />
        Nuclear data are essential for nuclear engineering. Uncertainty
        quantification in modelling combines scientific modelling and statistical
        methods. Novel methodologies will be used to determine the UQ of
        macroscopic parameters from nuclear data uncertainties. This is valuable for
        fast reactors and other Gen IV components, as the relevant nuclear data are
        less well-known than for present-day reactors.
      </>
    ),
  };

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await axios.get("https://res.cloudinary.com/djunroohl/image/upload/v1726912612/Graf_with_Id_goli5h.svg");
        setSvgContent(response.data);
        console.log("SVG content fetched:", response.data); // Log SVG content
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };

    fetchSvg();
  }, []);

  useEffect(() => {
    if (svgContent) {
      // Add a slight delay to ensure the SVG content is fully loaded
      setTimeout(() => {
        const svgElement = document.querySelector(".WP-img svg");
        if (svgElement) {
          const clickableIds = ["WP1", "WP2", "WP3", "WP4", "WP5", "WP6"];
          const clickableElements = Array.from(svgElement.querySelectorAll("[id]")).filter(element => clickableIds.includes(element.id));
          console.log("Clickable elements:", clickableElements); // Log clickable elements
          clickableElements.forEach((element) => {
            const handleClick = () => {
              setSelectedElement(element.id);
            };
            element.addEventListener("click", handleClick);

            // Clean up event listener on component unmount
            return () => {
              element.removeEventListener("click", handleClick);
            };
          });
        }
      }, 100); // Adjust the delay as needed
    }
  }, [svgContent]);

  return (
    <div className="ws-text-page">
      <header className="ws-header">
        <h1>Måste Workstructure</h1>
      </header>
      <main className="ws-content">
        <section className="ws-text-section">
          <div className="ws-img-container">
            <div
              className="WP-img"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            <div className="ws-text-box">
              {selectedElement && <p>{elementTexts[selectedElement]}</p>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WS;