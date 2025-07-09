import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, FileText, Building, CheckCircle, Users } from "lucide-react";

const placementContent = {
  "2nd-year": [
    {
      title: "Build Your Foundation",
      icon: <Code className="h-5 w-5 text-primary"/>,
      content: "Focus on mastering a programming language (like C++, Java, or Python). Start learning Data Structures and Algorithms (DSA). Solve easy problems on platforms like LeetCode or HackerRank."
    },
    {
      title: "Explore and Learn",
      icon: <FileText className="h-5 w-5 text-primary"/>,
      content: "Explore different fields like Web Development, App Development, or Machine Learning. Work on small projects to apply what you've learned."
    }
  ],
  "3rd-year": [
    {
      title: "Deep Dive into DSA",
      icon: <Code className="h-5 w-5 text-primary"/>,
      content: "This is the most crucial year for DSA. Cover all important topics and practice medium to hard problems. Participate in coding contests to improve your speed and accuracy."
    },
    {
      title: "Core Subjects & Projects",
      icon: <FileText className="h-5 w-5 text-primary"/>,
      content: "Strengthen your knowledge of core CS subjects like OS, DBMS, and Computer Networks. Build at least one major project to showcase on your resume."
    },
    {
        title: "Internship Preparation",
        icon: <Building className="h-5 w-5 text-primary"/>,
        content: "Start applying for internships. Prepare your resume and practice common HR and technical interview questions."
    }
  ],
  "4th-year": [
    {
      title: "Company-Specific Preparation",
      icon: <Building className="h-5 w-5 text-primary"/>,
      content: "Research companies you're targeting. Practice their previously asked questions and understand their interview process. Tailor your resume for each application."
    },
    {
        title: "Aptitude & HR Rounds",
        icon: <CheckCircle className="h-5 w-5 text-primary"/>,
        content: "Don't neglect aptitude tests (quantitative, logical reasoning). Prepare for HR rounds by thinking about your strengths, weaknesses, and career goals."
    },
    {
        title: "Mock Interviews",
        icon: <Users className="h-5 w-5 text-primary"/>,
        content: "Give mock interviews with friends or on platforms like Pramp. This helps reduce anxiety and provides valuable feedback."
    }
  ],
};

export default function PlacementPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Placement Prep Guide</h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
          Year-wise guidance to help you land your dream job.
        </p>
      </div>

      <Tabs defaultValue="3rd-year" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="2nd-year">2nd Year</TabsTrigger>
          <TabsTrigger value="3rd-year">3rd Year</TabsTrigger>
          <TabsTrigger value="4th-year">4th Year</TabsTrigger>
        </TabsList>
        <div className="mt-8 max-w-3xl mx-auto">
            <TabsContent value="2nd-year">
                <ContentAccordion items={placementContent['2nd-year']} />
            </TabsContent>
            <TabsContent value="3rd-year">
                <ContentAccordion items={placementContent['3rd-year']} />
            </TabsContent>
            <TabsContent value="4th-year">
                <ContentAccordion items={placementContent['4th-year']} />
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function ContentAccordion({ items }: { items: {title: string; icon: React.ReactNode; content: string}[] }) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-headline hover:no-underline">
                        <div className="flex items-center gap-4">
                            {item.icon}
                            {item.title}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground pl-14">
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}
