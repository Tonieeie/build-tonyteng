import { Contact, Faq, Footer, Hero, Industries, Nav, Pricing, Process, Services, SoundFamiliar, Work } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <SoundFamiliar />
        <Work />
        <Industries />
        <Process />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
