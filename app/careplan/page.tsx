"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/nav/nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Milestone = {
  title: string;
  date: string;
  status: string;
};

type RecommendationCategory = {
  category: string;
  items: string[];
};

export default function RecoveryJourney() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Milestone>({ title: "", date: "", status: "Upcoming" });
  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: "3-Month Follow-up Appointment", date: "2025-05-15", status: "Upcoming" },
    { title: "Complete 4-Week Exercise Program", date: "2025-05-15", status: "Upcoming" },
    { title: "Join Support Group Meeting", date: "2025-05-15", status: "Upcoming" },
    { title: "Nutrition Consultation", date: "2025-05-15", status: "Upcoming" },
  ]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const achievements = [
    { title: "Completed Initial Health Assessment", date: "May 15, 2025" },
    { title: "First Week of Daily Walking", date: "May 15, 2025" },
    { title: "Started Mindfulness Practice", date: "May 15, 2025" },
    { title: "Created Nutrition Plan", date: "May 15, 2025" },
  ];

  const careRecommendations: RecommendationCategory[] = [
    {
      category: "Follow-up Care",
      items: [
        "Schedule your 3-month follow-up appointment",
        "Prepare questions for your oncologist",
        "Update your symptom journal before appointments",
      ],
    },
    {
      category: "Physical Activity",
      items: [
        "Start with 10-minute walks, 3 times per week",
        "Try gentle yoga for flexibility and strength",
        "Consider aquatic exercises to reduce joint stress",
      ],
    },
    {
      category: "Mental Health",
      items: [
        "Practice 5-minute mindfulness meditation daily",
        "Join the online cancer survivor support group",
        "Schedule a consultation with a mental health specialist",
      ],
    },
    {
      category: "Physical Activity",
      items: [
        "Increase protein intake with lean meats and legumes",
        "Aim for 8 glasses of water daily",
        "Include more leafy greens and colorful vegetables",
      ],
    },
  ];

  const router = useRouter();

  useEffect(() => {
    const userData = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userData="))
      ?.split("=")[1];

    if (!userData) {
      router.push("/auth/login");
      return;
    }

    setUser(JSON.parse(decodeURIComponent(userData)));
  }, [router]);

  const handleAddClick = () => {
    setFormData({ title: "", date: "", status: "Upcoming" });
    setEditIndex(null);
    setShowModal(true);
  };

  const handleEditClick = (index: number) => {
    setFormData(milestones[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updated = [...milestones];
      updated[editIndex] = formData;
      setMilestones(updated);
    } else {
      setMilestones((prev) => [...prev, formData]);
    }
    setShowModal(false);
    setEditIndex(null);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-parchment relative">
      <Navigation user={user} />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-green-800">
                {editIndex !== null ? "Edit Milestone" : "Add New Milestone"}
              </h2>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Enter milestone title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="border rounded px-3 py-2" />
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="border rounded px-3 py-2" />
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="col-span-2 border rounded px-3 py-2">
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <Button className="bg-green-700 text-white hover:bg-green-800" onClick={handleSubmit}>
              {editIndex !== null ? "Update Milestone" : "Save Milestone"}
            </Button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4 text-center">
            <h2 className="text-xl font-semibold text-red-700">Are you sure?</h2>
            <p className="text-gray-600">This action cannot be undone.</p>
            <div className="flex justify-center gap-4 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => {
                if (deleteIndex !== null) {
                  setMilestones((prev) => prev.filter((_, i) => i !== deleteIndex));
                  setDeleteIndex(null);
                }
                setShowDeleteModal(false);
              }}>Confirm Delete</Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        <Tabs defaultValue="care-plan" className="space-y-8">
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="care-plan">Milestones & Achievements</TabsTrigger>
            <TabsTrigger value="progress">Care Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="care-plan" className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-green-800">Your Recovery Journey</h2>
                <Button className="bg-green-700 text-white hover:bg-green-800" onClick={handleAddClick}>
                        Add New Milestone +
                      </Button>
                    </div>
            
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-green-700 mb-4">Upcoming Milestones</h3>
                        <div className="space-y-4">
                          {milestones.map((item, index) => (
                            <div key={index} className="border-b pb-2 flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.date}</p>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{item.status}</span>
                              </div>
                              <div className="space-x-2">
                                <button onClick={() => handleEditClick(index)}>
                                  <Pencil size={16} />
                                </button>
                                <button onClick={() => {
                                setDeleteIndex(index);
                                setShowDeleteModal(true);
                                }}>
                                <Trash size={16} className="text-red-500" />
                                </button>
            
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
            
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold text-green-700 mb-4">Achievements</h3>
                        <div className="space-y-4">
                          {achievements.map((item, index) => (
                            <div key={index} className="border-b pb-2 flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.date}</p>
                                <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">Completed</span>
                              </div>
                              <div className="space-x-2">
                                <button>
                                  <Pencil size={16} />
                                </button>
                                <button>
                                  <Trash size={16} className="text-red-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-green-800">Care Recommendations</h2>
              <Button className="bg-green-700 text-white hover:bg-green-800">Add New Recommendation +</Button>
            </div>
            {careRecommendations.map((section, index) => (
              <Card key={index} className="p-4">
                <h3 className="text-md font-semibold text-green-700 mb-2">{section.category}</h3>
                <div className="space-y-2">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-1">
                      <span>{item}</span>
                      <div className="space-x-2">
                        <button><Pencil size={16} /></button>
                        <button><Trash size={16} className="text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
