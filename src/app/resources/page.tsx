"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Mock Data
const branches = ["CSE", "ECE", "MECH", "CIVIL"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

const resources = [
  { id: 1, branch: "CSE", semester: "3", subject: "Data Structures", type: "Notes", title: "Complete DSA Notes", url: "#" },
  { id: 2, branch: "CSE", semester: "4", subject: "Algorithms", type: "PYQ", title: "2022 Algorithms Paper", url: "#" },
  { id: 3, branch: "ECE", semester: "3", subject: "Digital Electronics", type: "Notes", title: "Logic Gates & Boolean Algebra", url: "#" },
  { id: 4, branch: "MECH", semester: "5", subject: "Thermodynamics", type: "PYQ", title: "2021 Thermo End-sem", url: "#" },
  { id: 5, branch: "CSE", semester: "3", subject: "Data Structures", type: "PYQ", title: "2021 DSA Paper", url: "#" },
];

export default function ResourcesPage() {
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [selectedSemester, setSelectedSemester] = useState("3");

  const filteredResources = resources.filter(
    (r) => r.branch === selectedBranch && r.semester === selectedSemester
  );

  return (
    <div className="container py-12 md:py-16">
      <div className="space-y-4 mb-12 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Academic Resource Hub</h1>
        <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
          Access academic notes and previous year's question papers.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((sem) => (
              <SelectItem key={sem} value={sem}>{`Semester ${sem}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.title}</TableCell>
                  <TableCell>{resource.subject}</TableCell>
                  <TableCell>{resource.type === 'PYQ' ? "Question Paper" : "Notes"}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <a href={resource.url} download>
                        <Download className="mr-2 h-4 w-4" /> Download
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No resources found for this selection.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
