import Hero from "@/components/Hero";
import DirectorMessage from "@/components/DirectorMessage";
import LearningPhilosophy from "@/components/LearningPhilosophy";
import AdmissionsBanner from "@/components/AdmissionsBanner";
import UpcomingAtOyster from "@/components/UpcomingAtOyster";
import SchoolManagement from "@/components/SchoolManagement";
import Campuses from "@/components/Campuses";
import AnnouncementPopup from "@/components/AnnouncementPopup";

export default function HomePage() {
  return (
    <>
      <AnnouncementPopup />
      <Hero />
      <DirectorMessage />
      <LearningPhilosophy />
      <AdmissionsBanner />
      <UpcomingAtOyster />
      <SchoolManagement />
      <Campuses />
    </>
  );
}
