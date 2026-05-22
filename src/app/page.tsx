import Hero from "@/components/Hero";
import DirectorMessage from "@/components/DirectorMessage";
import LearningPhilosophy from "@/components/LearningPhilosophy";
import SchoolUpdates from "@/components/SchoolUpdates";
import Campuses from "@/components/Campuses";
import SchoolManagement from "@/components/SchoolManagement";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DirectorMessage />
      <LearningPhilosophy />
      <SchoolUpdates />
      <SchoolManagement />
      <Campuses />
    </>
  );
}
