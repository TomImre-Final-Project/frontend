import React, { useState } from "react";

import useAuthContext from "../contexts/AuthContext";

import { useNavigate } from "react-router-dom";

import  {myAxios}  from "../api/axios";

export default function Regisztracio() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("customer");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const { loginReg, errors } = useAuthContext();


  const handleSubmit = async (e) => {
    e.preventDefault();       
    const adat = {
      username: username,
      email: email,
      password: password,
      password_confirmation: password_confirmation,
      role: role,
      phone: phone
    };       
    loginReg(adat, "/register");
};

  return (
    <div className=" m-auto" style={{ maxWidth: "400px" }}>
      <h1 className="text-center">Regisztráció</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mt-3">
          <label htmlFor="username" className="form-label">
            Felhasználónév:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="form-control"
            id="username"
            placeholder="Felhasználónév"
            name="username"
          />
          <div>
            {errors.username && (
              <span className="text-danger">{errors.username[0]}</span>
            )}
          </div>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="form-control"
            id="email"
            placeholder="email"
            name="email"
          />
          <div>
            {errors.email && (
              <span className="text-danger">{errors.email[0]}</span>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Telefonszám:
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            className="form-control"
            id="phone"
            placeholder="Telefonszám"
            name="phone"
          />
          <div>
            {errors.phone && (
              <span className="text-danger">{errors.phone[0]}</span>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="pwd" className="form-label">
            Jelszó:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="form-control"
            id="pwd"
            placeholder="jelszó"
            name="pwd"
          />
          <div>
            {errors.password && (
              <span className="text-danger">{errors.password[0]}</span>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="pwd2" className="form-label">
            Jelszó újra:
          </label>
          <input
            type="password"
            value={password_confirmation}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
            }}
            className="form-control"
            id="pwd2"
            placeholder="jelszó újra"
            name="pwd2"
          />
          <div>
            {errors.password_confirmation && (
              <span className="text-danger">
                {errors.password_confirmation[0]}
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Szerepkör:
          </label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="customer">Vásárló</option>
            <option value="courier">Futár</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Regisztrálok
        </button>
      </form>
    </div>
  );
}
