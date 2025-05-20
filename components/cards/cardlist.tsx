"use client";

import React from "react";
import { Pencil, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";

type Milestone = { title: string; date: string; status: string };
type Achievement = { title: string; date: string };
type CareRecommendation = { category: string; items: string[] };

type CardListProps =
  | {
      type: "milestone" | "achievement";
      title: string;
      data: Milestone[] | Achievement[];
      onEdit?: (index: number) => void;
      onDelete?: (index: number) => void;
    }
  | {
      type: "care";
      title?: string;
      data: CareRecommendation[];
      onEdit?: (sectionIndex: number, itemIndex: number) => void;
      onDelete?: (sectionIndex: number, itemIndex: number) => void;
    };

export default function CardList(props: CardListProps) {
  if (props.type === "care") {
    return (
      <>
        {props.data.map((section, index) => (
          <Card key={index} className="p-4">
            <h3 className="text-md font-semibold text-green-700 mb-2">{section.category}</h3>
            <div className="space-y-2">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-1">
                  <span>{item}</span>
                  <div className="space-x-2">
                    <button onClick={() => props.onEdit?.(index, idx)}><Pencil size={16} /></button>
                    <button onClick={() => props.onDelete?.(index, idx)}><Trash size={16} className="text-red-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-green-700 mb-4">{props.title}</h3>
      <div className="space-y-4">
        {(props.data as Milestone[] | Achievement[]).map((item, index) => (
          <div key={index} className="border-b pb-2 flex justify-between items-start">
            <div>
              <p className="font-medium">{item.title}</p>
              {"date" in item && <p className="text-sm text-gray-500">{item.date}</p>}
              {props.type === "milestone" && "status" in item && (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{item.status}</span>
              )}
              {props.type === "achievement" && (
                <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded">Completed</span>
              )}
            </div>
            <div className="space-x-2">
              <button onClick={() => props.onEdit?.(index)}><Pencil size={16} /></button>
              <button onClick={() => props.onDelete?.(index)}><Trash size={16} className="text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
