import React, { useState } from "react";
import "@cds/core/dropdown/register.js";
import "@cds/core/icon/register.js";
import "@cds/core/button/register.js";
import "@cds/core/divider/register.js";

function ModalAuth() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);

  const openLoginModal = () => {
    setLoginOpen(true);
    setRegistrationOpen(false);
  };

  const openRegistrationModal = () => {
    setLoginOpen(false);
    setRegistrationOpen(true);
  };

  const closeModal = () => {
    setLoginOpen(false);
    setRegistrationOpen(false);
  };

  return (
    <React.Fragment>
      <clr-modal
        clrModalOpen={isLoginOpen || isRegistrationOpen ? "opened" : undefined}
        clrModalSize="sm"
      >
        {isLoginOpen && (
          <div>
            {/* Login form */}
            <h2>Login</h2>
            {/* Add your login form components here */}
          </div>
        )}
        {isRegistrationOpen && (
          <div>
            {/* Registration form */}
            <h2>Registration</h2>
            {/* Add your registration form components here */}
          </div>
        )}
        <clr-modal-footer>
          <button className="btn btn-link" onClick={openLoginModal}>
            Login
          </button>
          <button className="btn btn-link" onClick={openRegistrationModal}>
            Register
          </button>
          <button className="btn btn-link" onClick={closeModal}>
            Close
          </button>
        </clr-modal-footer>
      </clr-modal>
    </React.Fragment>
  );
}

export default ModalAuth;
