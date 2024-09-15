import React from "react";
import "./Partners.css"; // Import the CSS file for styling
import "../App.css"; // Import the CSS file for styling
import "@clr/icons/clr-icons.min.css";
import { ClarityIcons, atomIcon } from "@cds/core/icon";
import '@cds/core/select/register.js';

// Define the Partners component
ClarityIcons.addIcons(atomIcon);

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
        <img id="chalmers" height={230} width={200} src="https://res.cloudinary.com/djunroohl/image/upload/c_crop,h_185,w_152/v1724065539/Chalmers_University_of_Technology_bdskot.svg" alt="Chalmers Tekniska Högskola Aktiebolag logo" />
            <select id="first_select">
                    <option place value="1">Coordinator: Chalmers Tekniska Högskola Aktiebolag</option>
                    <option value="2">Prof. Astrophysics</option>
                    <option value="3">Dr. Molecular Biology</option>
                    <option value="4">Prof. Environmental Science</option>
                    <option value="5">Dr. Computational Chemistry</option>
                    <option value="6">Prof. Theoretical Physics</option>
            </select>
                <img id="lund" height={200} width={200} src="https://res.cloudinary.com/djunroohl/image/upload/c_crop,g_west,h_152,w_114,x_27/v1726434289/lund_logo_dpnac2.svg" alt="Lunds Universitet logo" />
            <select id="first_select" cds-select>
                    <option value="1">Lunds universitet</option>
                    <option value="2">Prof. Astrophysics</option>
                    <option value="3">Dr. Molecular Biology</option>
                    <option value="4">Prof. Environmental Science</option>
                    <option value="5">Dr. Computational Chemistry</option>
                    <option value="6">Prof. Theoretical Physics</option>
            </select>
                <img id="kth" height={200} width={200} src="https://res.cloudinary.com/djunroohl/image/upload/v1726435166/kth_jqmkiz.svg" alt="Kungliga Tekniska Högskolan logo" />
            <select id="first_select" cds-select>
                    <option value="1">Kungliga Tekniska Högskolan</option>
                    <option value="2">Prof. Astrophysics</option>
                    <option value="3">Dr. Molecular Biology</option>
                    <option value="4">Prof. Environmental Science</option>
                    <option value="5">Dr. Computational Chemistry</option>
                    <option value="6">Prof. Theoretical Physics</option>
            </select>
                <img height={200} src="https://res.cloudinary.com/djunroohl/image/upload/v1726435232/g%C3%B6teborgs_universitet_bffrtf.png" alt="Göteborgs Universitet logo" />
            <select id="first_select" cds-select>
                    <option value="1">Göteborgs Universitet</option>
                    <option value="2">Prof. Astrophysics</option>
                    <option value="3">Dr. Molecular Biology</option>
                    <option value="4">Prof. Environmental Science</option>
                    <option value="5">Dr. Computational Chemistry</option>
                    <option value="6">Prof. Theoretical Physics</option>
            </select>
                <img id="uppsala" height={200} src="https://res.cloudinary.com/djunroohl/image/upload/v1726435636/uppsala_nigszw.png" alt="Uppsala Universitet logo" />
            <select id="first_select" cds-select>
                    <option value="1">Uppsala universitet</option>
                    <option value="2">Prof. Astrophysics</option>
                    <option value="3">Dr. Molecular Biology</option>
                    <option value="4">Prof. Environmental Science</option>
                    <option value="5">Dr. Computational Chemistry</option>
                    <option value="6">Prof. Theoretical Physics</option>
            </select>
                <img className="kärnfull" id="last_select" height={40} src="https://res.cloudinary.com/djunroohl/image/upload/v1726435769/k%C3%A4rnfull_mgzwzu.png" alt="Kärnfull Next logo" />
            <select id="last_select" cds-select>
                    <option value="1">Kärnfull Next AB</option>
                    <option value="2">Prof. Astrophysics</option>
                    <option value="3">Dr. Molecular Biology</option>
                    <option value="4">Prof. Environmental Science</option>
                    <option value="5">Dr. Computational Chemistry</option>
                    <option value="6">Prof. Theoretical Physics</option>
            </select>
            </div>
        </main>
    </div>
);
};

export default Partners;
