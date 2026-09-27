import { Anything, Contact, Faq, Footer, Hero, Industries, Nav, Pricing, Process, SoundFamiliar, Work } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SoundFamiliar />
        <Work />
        <Industries />
        <Process />
        <Pricing />
        <Anything />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
