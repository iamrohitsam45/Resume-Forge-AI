import Hero from '../components/home/Hero.jsx';
import FeatureGrid from '../components/home/FeatureGrid.jsx';
import HowItWorks from '../components/home/HowItWorks.jsx';
import CTASection from '../components/home/CTASection.jsx';

export function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <CTASection />
    </>
  );
}

export default Home;
