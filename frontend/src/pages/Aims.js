import React from "react";
import "./Aims.css"; // Import the CSS file for styling

const Aims = () => {
  return (
    <div className="text-page">
      <header className="header">
        <h1>What our Aims are</h1>
      </header>
      <main className="content">
        <section className="text-section">
          <h2>The Måste Objective</h2>
          <p>
            The overall objective of the MÅSTE project is to ensure safe, secure
            and sustainable operation of nuclear power in the foreseeable
            future. To reach the objective, not only a potential technology
            shift to the so-called Gen IV systems is needed but also to secure
            competence within all disciplines concerned.
            <br></br>
            <br></br>
            That is why MÅSTE applies the holistic approach to nuclear power
            operation with a focus on Gen IV technology which has a large
            attraction of students and younger researchers and, thus, enhance
            the competence base in Sweden.
            <br></br>
            <br></br>
            The project delivers particular basis to perform an assessment of
            setting up a Gen IV recycling pilot in Sweden using all the areas
            needed including, in addition to the classical technical subjects,
            also radiation protection and safeguards. Another ambition of the
            project is to gather scattered effort in the field and join forces
            with other national but also international players.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Aims;
