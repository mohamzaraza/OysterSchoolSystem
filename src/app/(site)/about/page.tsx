export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-navy py-20 text-center">
        <p className="font-body text-gold text-sm tracking-widest uppercase font-semibold mb-2">
          Who We Are
        </p>
        <h1 className="font-heading text-white text-5xl md:text-6xl font-semibold">About Us</h1>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="font-heading text-navy text-4xl font-semibold mb-6">
          A School Built on Purpose
        </h2>
        <p className="font-body text-gray-600 text-lg leading-relaxed mb-6">
          Oyster School System was founded with a clear and singular purpose: to prepare young
          Pakistanis not just for exams, but for life. We believe that education must evolve to
          meet the demands of a rapidly changing world.
        </p>
        <p className="font-body text-gray-600 text-lg leading-relaxed mb-6">
          With two campuses in the PWD area of Islamabad — one dedicated to Early Years education
          and one to High School — we provide a seamless, consistent learning journey from a child's
          first classroom experience to their final year of school.
        </p>
        <p className="font-body text-gray-600 text-lg leading-relaxed">
          Our approach combines academic rigour with practical, skills-based learning. We nurture
          curiosity, reward creativity, and hold every student to the belief that they are capable
          of extraordinary things.
        </p>
      </div>
    </div>
  );
}
