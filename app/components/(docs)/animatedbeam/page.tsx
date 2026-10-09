import JsonLd from "@/components/JsonLd";
import { componentJsonLd, componentPageMetadata } from "@/lib/seo";
import Demo from "./demo";

const HREF = "/components/animatedbeam";

export const metadata = componentPageMetadata(HREF);

export default function Page() {
  return (
    <>
      <JsonLd data={componentJsonLd(HREF)} />
      <div className="flex min-h-full w-full items-center justify-center p-4 sm:p-8">
        <Demo />
      </div>
    </>
  );
}
