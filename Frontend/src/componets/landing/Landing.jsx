import React from 'react'
import Hero from '../hero/Hero'
import Programs from '../programs/Programs'
import Pricing from '../pricing/Pricing'
import About from '../about/About'
import Testimonials from '../testimonials/Testimonials'
import Schedule from '../schedule/Schedule'
function Landing() {
  return (
    <>
      <Hero />
      <About />
      <Programs />
<Schedule/>
      <Pricing />
      <Testimonials/>
      
    </>
  );
}

export default Landing
