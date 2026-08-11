import React from "react";

function Info() {
  return (
    <div className="about__info">
      <div className="about__box">
        <i className="bx bx-award about__icon"></i>
        <h3 className="about__title">Experience</h3>
        <span className="about__subtitle">5 years Working</span>
      </div>

      <div className="about__box">
        <i className="bx bx-briefcase-alt about__icon"></i>
        <h3 className="about__title">Completed</h3>
        <span className="about__subtitle">7+ Projects</span>
      </div>

      <div className="about__box">
        <i className="bx bx-book-open about__icon"></i>
        <h3 className="about__title">Education</h3>
        <span className="about__subtitle">MCS · Ongoing</span>
      </div>
    </div>
  );
}

export default Info;
