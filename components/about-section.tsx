import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, CheckCircle, Search } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-12 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-950 mb-4">About Logical Fallacy Checker</h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            A tool designed to help identify and understand logical fallacies in arguments and reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-neutral-300 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-neutral-950">
                <Brain className="w-5 h-5 mr-2 text-neutral-700" />
                What are Logical Fallacies?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-neutral-700 space-y-4">
              <p>
                Logical fallacies are errors in reasoning that undermine the logic of an argument. These can be either
                formal fallacies (errors in the argument's form) or informal fallacies (errors in the content of the
                argument).
              </p>
              <p>
                Fallacies are common in everyday conversations, political discourse, advertising, and even academic
                writing. Recognizing them is an essential critical thinking skill that helps evaluate arguments more
                effectively.
              </p>
            </CardContent>
          </Card>

          <Card className="border-neutral-300 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-neutral-950">
                <BookOpen className="w-5 h-5 mr-2 text-neutral-700" />
                Why Study Fallacies?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-neutral-700 space-y-4">
              <p>Understanding logical fallacies helps you:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Construct stronger, more persuasive arguments</li>
                <li>Identify weaknesses in others' reasoning</li>
                <li>Make better decisions based on sound reasoning</li>
                <li>Avoid being misled by faulty logic</li>
                <li>Engage in more productive discussions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border-neutral-300 shadow-md mb-12">
          <CardHeader>
            <CardTitle className="text-xl text-neutral-950">How to Use This Tool</CardTitle>
            <CardDescription>Our AI-powered tool analyzes text to identify common logical fallacies.</CardDescription>
          </CardHeader>
          <CardContent className="text-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-neutral-100 p-3 rounded-full mb-4">
                  <Search className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="font-medium text-neutral-950 mb-2">1. Enter Text</h3>
                <p className="text-sm">
                  Paste any argument, statement, or reasoning you want to analyze into the text area.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-neutral-100 p-3 rounded-full mb-4">
                  <Brain className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="font-medium text-neutral-950 mb-2">2. Analyze</h3>
                <p className="text-sm">
                  Our AI will examine the text for logical fallacies using advanced language processing.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-neutral-100 p-3 rounded-full mb-4">
                  <CheckCircle className="w-6 h-6 text-neutral-700" />
                </div>
                <h3 className="font-medium text-neutral-950 mb-2">3. Review Results</h3>
                <p className="text-sm">
                  Get detailed explanations of any detected fallacies, including examples and logical forms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-neutral-100 rounded-lg p-6 border border-neutral-300">
          <h3 className="text-xl font-semibold text-neutral-950 mb-4">About the Technology</h3>
          <p className="text-neutral-700 mb-4">
            This tool uses advanced AI language models to analyze text for logical fallacies. While it's highly
            effective, it's important to note that:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-700">
            <li>The tool is designed to assist critical thinking, not replace it</li>
            <li>Context matters in determining whether reasoning contains fallacies</li>
            <li>Some arguments may contain subtle fallacies that require human judgment</li>
            <li>The tool is continuously improving through machine learning</li>
          </ul>
        </div>
      </div>
    </section>
  )
}