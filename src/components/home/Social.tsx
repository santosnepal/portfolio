import React from 'react'

function Social() {
  return (
    <div className="home__social">
      <a
        href="https://www.instagram.com/santosnepal/"
        className="home__social-icon"
        target="_blank"
        rel="noreferrer"
      >
        <i className="uil uil-instagram"></i>
      </a>

      <a
        href="+ttps://www.linkedin.com/in/santosh-nepal-3ab7b3156/"
        className="home__social-icon"
        target="_blank"
        rel="noreferrer"
      >
        <i className="uil uil-linkedin"></i>
      </a>

      <a
        href="https://github.com/santosnepal"
        className="home__social-icon"
        target="_blank"
        rel="noreferrer"
      >
        <i className="uil uil-github-alt"></i>
      </a>
    </div>
  )
}

export default Social
