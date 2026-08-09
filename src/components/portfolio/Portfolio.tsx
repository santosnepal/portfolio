import React from "react";
import "./portfolio.css";
import { Data } from "./data";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";

function Portfolio() {
  return (
    <div className="portfolio container section" id="portfolio">
      <h2 className="section__title">Portfolio</h2>
      <span className="section__subtitle">Featured work</span>

      <Swiper
        className="portfolio__container"
        loop={true}
        grabCursor={true}
        spaceBetween={24}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          576: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 48,
          },
        }}
        modules={[Pagination]}
      >
        {Data.map(({ id, description, image, title, stack, tagline, summary, href }) => {
          return (
            <SwiperSlide className="portfolio__card" key={id}>
              <img src={image} alt={title} className="portfolio__img" />
              <h3 className="portfolio__name">{title}</h3>
              {tagline && <p className="portfolio__tagline">{tagline}</p>}
              <p className="portfolio__stack">{stack}</p>
              {summary && <p className="portfolio__summary">{summary}</p>}

              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="portfolio__description"
                >
                  {description}
                  <i className="uil uil-arrow-right portfolio__button-icon"></i>
                </a>
              ) : (
                <span className="portfolio__description portfolio__description--static">
                  Featured project
                </span>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default Portfolio;
