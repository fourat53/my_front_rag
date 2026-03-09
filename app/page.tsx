"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function HomePage() {
  return (
    <div>
      <Button variant="default" onClick={() => redirect("/example")}>
        Navigate To example
      </Button>
    </div>
  );
}
