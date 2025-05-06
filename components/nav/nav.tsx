"use client"
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { UserNav } from "../user-nav";


export default function Navigation(props: any) {
  return (
    <header className="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          {/* <h1 className="text-2xl font-bold text-forest-green mb-4 sm:mb-0">Your Care Dashboard</h1> */}
          <img src="/logo.png" alt="logo" style={{ height: '60px', width: '60px' }} />

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10">
              Update Survey
            </Button>
            <UserNav user={props.user} />
          </div>
        </div>
      </header>
  );
}