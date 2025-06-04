import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FallacyChecker from "@/components/fallacy-checker"
import AboutSection from "@/components/about-section"
import ExamplesSection from "@/components/examples-section"
import FallacyListSection from "@/components/fallacy-list-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-950"></div>
            </div>
          }
        >
          <FallacyChecker />
          <AboutSection />
          <ExamplesSection />
          <FallacyListSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
