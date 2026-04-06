import LandingHeader from "@/components/landing/landingHeader";
import HeroSection from "@/components/landing/heroSection";
import FeaturesSection from "@/components/landing/featuresSection";
import CommunitySection from "@/components/landing/communitySection";
import Footer from "@/components/landing/footer";
import SubscriptionPage from "@/components/pages/subscription/subscriptionPage";

const LandingPage = () => {
  return (
    <div>
      <LandingHeader />
      <main className="bg-bg-page min-h-dvh overflow-x-hidden font-poppins text-text-primary">
        <HeroSection />
        <FeaturesSection />
        <CommunitySection />
        <SubscriptionPage hideHeader={true} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
