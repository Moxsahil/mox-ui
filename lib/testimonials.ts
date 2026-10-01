export type Testimonial = {
  handle: string;
  quote: string;
  name?: string;
  href?: string;
  role?: string;
};

export function avatarUrl(handle: string) {
  return `https://unavatar.io/x/${handle.replace("@", "")}`;
}

export const TESTIMONIALS: Testimonial[] = [];
