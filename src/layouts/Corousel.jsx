import React, { useState, useEffect, useRef } from 'react';

const gifs = [
  { src: '/gif5.mp4', duration: 4000 },
  { src: '/gif4.mp4', duration: 4000 },
  { src: '/gif3.mp4', duration: 4000 },
  { src: '/gif2.mp4', duration: 4000 },
  { src: '/gif1.mp4', duration: 4000 },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  useEffect(() => {
    const currentGifDuration = gifs[currentIndex].duration + 1000;
    const timer = setTimeout(() => {
      if (!isDragging) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % gifs.length);
      }
    }, currentGifDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, isDragging]);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartPosition(e.touches[0].clientX);
    setCurrentTranslate(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    setCurrentTranslate(currentPosition - startPosition);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 100; // Minimum swipe distance to change the slide
    if (currentTranslate > threshold) {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? gifs.length - 1 : prevIndex - 1));
    } else if (currentTranslate < -threshold) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % gifs.length);
    }
    setCurrentTranslate(0);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden">
      {/* Media Section */}
      <div
        ref={carouselRef}
        className="flex transition-transform duration-300"
        style={{
          transform: `translateX(${-currentIndex * 100 + currentTranslate / carouselRef.current?.offsetWidth * 100}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {gifs.map((gif, index) => (
          <video
            key={index}
            src={gif.src}
            autoPlay
            muted
            loop
            className="w-full h-[400px] object-cover"
          />
        ))}
      </div>

      {/* Dots for Navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {gifs.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full cursor-pointer transition-all ${
              index === currentIndex ? 'bg-blue-500 scale-110' : 'bg-gray-300'
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
