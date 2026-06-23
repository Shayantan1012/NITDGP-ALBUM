import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react"

function CustomCarousel({ items, renderItem, autoPlay = true, interval = 5000, label = "Gallery" }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef(null)

  const goTo = (index) => {
    if (!items.length) return
    setActiveIndex((index + items.length) % items.length)
  }

  useEffect(() => {
    if (!autoPlay || paused || items.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length)
    }, interval)
    return () => window.clearInterval(timer)
  }, [autoPlay, interval, items.length, paused])

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0)
  }, [activeIndex, items.length])

  if (!items.length) return null

  return (
    <section
      className="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goTo(activeIndex - 1)
        if (event.key === "ArrowRight") goTo(activeIndex + 1)
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return
        const distance = event.changedTouches[0].clientX - touchStart.current
        if (Math.abs(distance) > 45) goTo(activeIndex + (distance < 0 ? 1 : -1))
        touchStart.current = null
      }}
      tabIndex={0}
    >
      <div className="carousel__viewport">
        <div
          className="carousel__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div className="carousel__slide" key={item._id || index} aria-hidden={index !== activeIndex}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--left"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--right"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="carousel__dots" aria-label="Choose image">
          {items.map((item, index) => (
            <button
              type="button"
              key={item._id || index}
              className={`carousel__dot ${index === activeIndex ? "carousel__dot--active" : ""}`}
              onClick={() => goTo(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      )}
    </section>
  )
}

CustomCarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderItem: PropTypes.func.isRequired,
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  label: PropTypes.string,
}

export default CustomCarousel
