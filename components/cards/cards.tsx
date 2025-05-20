import React from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import { Button } from "../ui/button";

interface RecommendationCardProps {
  header: string;
  buttonText: string;
}

export default function RecommendationCard(props: RecommendationCardProps) {
  return (
    <>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-green-800">{props.header}</h2>
            <Button className="bg-green-700 text-white hover:bg-green-800">{props.buttonText}</Button>
        </div>
    </>
  );
}
