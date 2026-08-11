import React, { useState } from 'react'
import './qualification.css'

function Qualification() {
  const [toggleTab, setToggleTab] = useState(1)

  const toggleHandler = (index: number) => {
    setToggleTab(index)
  }

  return (
    <section className="qualification section" id="qualification">
      <h2 className="section__title">Qualification</h2>
      <span className="section__subtitle">My personal journey</span>

      <div className="qualification__container container">
        <div className="qualification__tabs">
          <div
            className={
              toggleTab === 1
                ? 'qualification__button qualification__active button--flex qualification__button-active'
                : 'qualification__button button--flex'
            }
            onClick={() => toggleHandler(1)}
          >
            <i className="uil uil-graduation-cap qualification__icon"></i>
            Education
          </div>

          <div
            className={
              toggleTab === 2
                ? 'qualification__button qualification__active button--flex qualification__button-active'
                : 'qualification__button button--flex'
            }
            onClick={() => toggleHandler(2)}
          >
            <i className="uil uil-briefcase-alt qualification__icon"></i>
            Experience
          </div>
        </div>

        <div className="qualification__sections">
          <div
            className={
              toggleTab === 1
                ? 'qualification__content qualification__content-active'
                : 'qualification__content '
            }
          >
            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">
                  Master of Computer Science
                </h3>
                <span className="qualification__subtitle">
                  Texas College of Management and IT
                </span>

                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i> 2026 - Ongoing
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>
              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
              <div>
                <h3 className="qualification__title">
                  Bachelor In Information Technology
                </h3>
                <span className="qualification__subtitle">
                  Kantipur City College - Kathmandu
                </span>

                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i> 2016 - 2020
                </div>
              </div>
            </div>

            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">+2 Computer Science</h3>
                <span className="qualification__subtitle">
                  Sukuna Multiple Campus - Morang
                </span>

                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i> 2014 - 2016
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>
              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
              <div>
                <h3 className="qualification__title">SLC</h3>
                <span className="qualification__subtitle">
                  Jupiter English School - Morang
                </span>

                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i> 2014
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              toggleTab === 2
                ? 'qualification__content qualification__content-active'
                : 'qualification__content '
            }
          >
            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">
                  Senior Software Engineer
                </h3>
                <span className="qualification__subtitle">
                  Novelty Technology - Kathmandu
                </span>

                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i> Aug 2024 - Present
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>
              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
              <div>
                <h3 className="qualification__title">Software Engineer</h3>
                <span className="qualification__subtitle">
                  Novelty Technology - Kathmandu
                </span>

                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i> Aug 2023 - Aug 2024
                </div>
              </div>
            </div>

            <div className="qualification__data">
              <div>
                <h3 className="qualification__title">Back End Developer</h3>
                <span className="qualification__subtitle">
                  InfoDevelopers Pvt. Ltd. - Kathmandu
                </span>

                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i> Aug 2021 - Aug 2023
                </div>
              </div>

              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
            </div>

            <div className="qualification__data">
              <div></div>
              <div>
                <span className="qualification__rounder"></span>
                <span className="qualification__line"></span>
              </div>
              <div>
                <h3 className="qualification__title">Back End Developer</h3>
                <span className="qualification__subtitle">
                  Hobes Tech - Remote · Part-time
                </span>

                <div className="qualification__calendar">
                  <i className="uil uil-calendar-alt"></i> Mar 2021 - Present
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Qualification
