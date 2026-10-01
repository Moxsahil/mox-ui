import { TESTIMONIALS } from "@/lib/testimonials";
import { cn } from "@/lib/utils";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialWall({ className }: { className?: string }) {
  if (TESTIMONIALS.length === 0) {
    return (
      <p className="text-center text-sm font-medium text-muted-foreground">
        No testimonials yet.
      </p>
    );
  }

  return (
    <div className={cn("columns-1 gap-4 sm:columns-2 lg:columns-3", className)}>
      {TESTIMONIALS.map((testimonial) => (
        <TestimonialCard key={testimonial.handle} testimonial={testimonial} />
      ))}
    </div>
  );
}
