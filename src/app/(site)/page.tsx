import Hero from "@/components/Hero";
import DirectorMessage from "@/components/DirectorMessage";
import LearningPhilosophy from "@/components/LearningPhilosophy";
import SchoolUpdates from "@/components/SchoolUpdates";
import SchoolManagement from "@/components/SchoolManagement";
import Campuses from "@/components/Campuses";

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
