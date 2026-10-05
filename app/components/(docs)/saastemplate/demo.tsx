import SaasTemplate from "@/components/ui/saas-template";

export default function SaasTemplateDemo() {
  return (
    <div className="h-full overflow-y-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <SaasTemplate className="min-h-full" />
    </div>
  );
}
