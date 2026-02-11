'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function HeroCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          
          {/* Left Side - Text Content (2 columns) */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {currentSlideData.title}
              </h1>
              
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {currentSlideData.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {currentSlideData.primaryButtonText && (
                <Button 
                  variant="accent" 
                  href={currentSlideData.primaryButtonLink || '/offers'}
                  size="large"
                >
                  {currentSlideData.primaryButtonText}
                </Button>
              )}
              
              {currentSlideData.secondaryButtonText && (
                <Button 
                  variant="outline" 
                  href={currentSlideData.secondaryButtonLink || '/companies'}
                  size="large"
                >
                  {currentSlideData.secondaryButtonText}
                </Button>
              )}
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-2 pt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-8 bg-primary-500' 
                      : 'w-1.5 bg-gray-300 hover:bg-primary-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Image Carousel (3 columns - larger!) */}
          <div className="lg:col-span-3 relative order-1 lg:order-2">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-white border border-gray-200">
              {/* Carousel Images */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-gray-800">{slide.title}</h3>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Navigation Arrows */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg"
                    aria-label="Next slide"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}