import React from "react";
import "./Partners.css"; 
import "../App.css"; 
import "@clr/icons/clr-icons.min.css";
import '@cds/core/select/register.js';


const Partners = () => {
return (
    <div className="text-page">
        <header className="header">
            <h1>Involved Partners in Måste</h1>
        </header>
        <main className="content">
            <section className="text-section">
            </section>
        <div className="partners">
            <div className="partner-box">
            <img id="chalmers" height={230} width={200} src="https://res.cloudinary.com/djunroohl/image/upload/c_crop,h_185,w_152/v1724065539/Chalmers_University_of_Technology_bdskot.svg" alt="Chalmers Tekniska Högskola Aktiebolag logo" />
                <div className="partners-links">
                <a href="https://www.chalmers.se/en/departments/chem/research/energy-and-materials/nuclear-chemistry/">
                Department of Chemistry and Chemical Engineering, Energy and Materials –
                Nuclear Chemistry</a>
                </div >
             </div> 
             <div className="partner-box">  
            <img id="lund" height={200} width={200} src="https://res.cloudinary.com/djunroohl/image/upload/c_crop,g_west,h_152,w_114,x_27/v1726434289/lund_logo_dpnac2.svg" alt="Lunds Universitet logo" />
                <div className="partners-links">
                <a href="https://www.particle-nuclear.lu.se/experimental-particle-and-nuclear-physics/bar-biospheric-and-anthropogenic-radioactivity">
                Division of Particle and Nuclear Physics</a>
                <a href="https://portal.research.lu.se/sv/organisations/medical-radiation-physics-malm%C3%A3">
                Department of Translational Medicine - Medical Radiation Physics</a>
                </div>
            </div>
            <div className="partner-box">
            <img id="kth" height={200} width={200} src="https://res.cloudinary.com/djunroohl/image/upload/v1726435166/kth_jqmkiz.svg" alt="Kungliga Tekniska Högskolan logo" />
                <div className="partners-links">
                <a href="https://www.kth.se/en">
                Kungliga Tekniska Högskolan</a>
                </div>
            </div>
            <div className="partner-box">
            <img height={200} src="https://res.cloudinary.com/djunroohl/image/upload/v1726435232/g%C3%B6teborgs_universitet_bffrtf.png" alt="Göteborgs Universitet logo" />
                <div className="partners-links">
                <a href="https://www.gu.se/en/clinical-sciences/about-us/research-areas-within-the-institute-of-clinical-sciences/medical-radiation-sciences">
                The Institute of Clinical Sciences – Medical Radiation Sciences</a>
                </div>
            </div>
            <div className="partner-box">
            <img id="uppsala" height={200} src="https://res.cloudinary.com/djunroohl/image/upload/v1726435636/uppsala_nigszw.png" alt="Uppsala Universitet logo" />
                <div className="partners-links">
                <a href="https://www.uu.se/en/department/physics-and-astronomy/research/applied-nuclear-physics">
                Department of Physics and Astronomy – Applied Nuclear Physics</a>
                <a href="https://www.uu.se/en/department/physics-and-astronomy/research/materials-theory">
                Department of Physics and Astronomy – Materials Theory</a>
                </div>
            </div>
            <div className="partner-box">
                <img className="kärnfull" height={40} src="https://res.cloudinary.com/djunroohl/image/upload/v1726435769/k%C3%A4rnfull_mgzwzu.png" alt="Kärnfull Next logo" />
                <div className="partners-links">
                <a href="https://karnfull.se/">
                Kärnfull Next</a>
                </div>
            </div>
            </div>
        </main>
    </div>
);
};

export default Partners;
