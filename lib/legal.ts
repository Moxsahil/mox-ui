import { SITE_NAME, SITE_REPO, SITE_URL } from "@/lib/site";

export type LegalSection = {
  heading: string;
  body?: string[];
  list?: string[];
};

export const SUPPORT_EMAIL = "sahilmk01@gmail.com";

export const BUSINESS_OWNER = "MOX";

export const BUSINESS_COUNTRY = "India";

export const GOVERNING_LAW = `the laws of ${BUSINESS_COUNTRY}`;

export const JURISDICTION = `the courts of ${BUSINESS_COUNTRY}`;

export const DISPUTE_WINDOW = "30 days";

export const LEGAL_UPDATED = "October 8, 2026";

export const SUPPORT_RESPONSE = "within 2 business days";

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      `${SITE_NAME} is a free, open-source React component registry operated by ${BUSINESS_OWNER}, an independent developer based in ${BUSINESS_COUNTRY}. This policy covers ${SITE_URL} and the component registry served from it.`,
    ],
  },
  {
    heading: "The short version",
    body: [
      "You do not need an account to browse the site or to install a component. We do not run ads, we do not use tracking cookies, and we do not sell or share your data with anyone for their own marketing.",
      "When you contact us directly, we receive whatever information you include in your message.",
    ],
  },
  {
    heading: "What we collect",
    list: [
      "Anonymous usage analytics: page views, referrer, country, browser and device type, collected through Databuddy. The data is aggregated and is not used to identify you.",
      "Messages you send: anything you include when you email us or message us on X.",
      "Public repository activity: if you open an issue or a pull request, that is handled by GitHub under their terms and is public by design. We do not import it into any other system.",
    ],
  },
  {
    heading: "What we do not collect",
    body: [
      "We do not run advertising, cross-site tracking or fingerprinting, and we do not build profiles.",
      "Installing a component with the shadcn CLI fetches a static JSON file from the registry. Nothing about your project, your code or your machine is sent to us.",
      "Your theme preference is kept in your browser's local storage on your own device. It is never sent to us.",
    ],
  },
  {
    heading: "Service providers",
    body: [
      "We rely on a small number of third parties to run the site. Each processes only the data needed for its function.",
    ],
    list: [
      "Databuddy: privacy-focused, aggregated website analytics.",
      "GitHub: hosts the open-source repository, serves the registry files, and provides the public star count shown on the site.",
      "Our hosting provider: serves the site and keeps short-lived server logs, including IP addresses, for security and reliability.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "We use contact details to reply to you. We use aggregated analytics to understand which components people find useful and to decide what to build next. We do not use any of it for automated decision making or profiling.",
    ],
  },
  {
    heading: "Where your data is processed",
    body: [
      `We operate from ${BUSINESS_COUNTRY} and our providers process data in the United States and the European Union. Where personal data is transferred out of your country, it is covered by the safeguards those providers put in place, such as standard contractual clauses.`,
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "Email correspondence is kept while it is useful for support, then deleted. Aggregated analytics holds no personal data and is retained indefinitely.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      `You can ask for a copy of the personal data we hold about you, ask us to correct it, ask us to delete it, or object to a particular use, subject to records we are legally required to keep. Email ${SUPPORT_EMAIL} and we will respond ${SUPPORT_RESPONSE}, and in any case within 30 days.`,
      "If you are in the EU or the UK and you are not satisfied with our response, you can complain to your local data protection authority.",
    ],
  },
  {
    heading: "Security",
    body: [
      "The site is served over HTTPS. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "Children",
    body: [
      "The site is not directed at children under 16, and we do not knowingly collect their personal data. If you believe a child has given us personal data, email us and we will delete it.",
    ],
  },
  {
    heading: "If we add paid products or accounts",
    body: [
      `${SITE_NAME} is free today. If we later add paid components, licenses, downloads or anything that needs an account, that will introduce new categories of data, such as login credentials, license keys and purchase history.`,
      "We will update this policy, and the date on it, before we start collecting anything new, and we will describe what is collected and why. We will not quietly apply this version of the policy to data it never covered.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy as the site changes. The date at the top always reflects the current version.",
    ],
  },
  {
    heading: "Contact",
    body: [`Questions about this policy or your data: ${SUPPORT_EMAIL}.`],
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: "Agreement",
    body: [
      `These terms govern your use of ${SITE_NAME} at ${SITE_URL} and the components published in its registry. The site is operated by ${BUSINESS_OWNER}, an independent developer based in ${BUSINESS_COUNTRY}. By using the site or installing a component, you accept these terms.`,
      `In these terms, "the registry" means the free open-source components published at ${SITE_REPO}.`,
    ],
  },
  {
    heading: "The registry is free and open source",
    body: [
      "Every component in the registry is free, published under the MIT License, and installable with the shadcn CLI. You may use, modify and ship the components in personal and commercial projects, closed source included, with no attribution required beyond what the MIT License states. You own the code once it is in your project.",
      "What you may not do is repackage the registry as a competing component library or resell it as your own product. Individual components in your own applications are exactly what they are for.",
      `The components are covered by the MIT License. The name ${SITE_NAME}, the logo and the site design are not: those stay ours, and the license does not grant you rights to them.`,
    ],
  },
  {
    heading: "Contributions",
    body: [
      "If you contribute code to the public repository, you confirm you have the right to do so, and you license your contribution under the same MIT License as the rest of the registry. You keep the copyright to what you wrote. We may edit, refactor or remove a contribution after it is merged.",
    ],
  },
  {
    heading: "If we add paid offerings later",
    body: [
      "The registry is free today and we intend to keep the components that are already published free. We may add paid offerings in the future, for example premium components, templates, licenses or hosted services.",
      "Anything published under the MIT License stays under it. Releasing a paid product later does not retroactively change the license of a component you already installed, and does not give us a claim over a project you built with it.",
      "Any paid offering will show its price and any additional product-specific terms at the point of purchase before you pay. These terms apply to it in addition to those.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Do not attempt to disrupt the site, scrape it in a way that degrades service for others, or use it to distribute malware. We may block access that does.",
    ],
  },
  {
    heading: "No warranty",
    body: [
      `The site and every component are provided "as is", without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose and non-infringement. Components are animated interface code, not safety critical software. You are responsible for reviewing and testing anything you install before shipping it.`,
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the extent permitted by law, our total liability for any claim relating to the site or the registry is limited to the amount you paid us in the 12 months before the claim, and is zero where you paid us nothing. We are not liable for indirect or consequential loss, including lost profits or lost data.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms as the project changes. The date at the top reflects the current version. Continuing to use the site after an update means you accept it.",
    ],
  },
  {
    heading: "Resolving a problem",
    body: [
      `If you have a problem with the site or the registry, write to ${SUPPORT_EMAIL} with the details before taking any other step. We will work with you in good faith to sort it out.`,
      `Both sides agree to try to resolve a dispute this way for at least ${DISPUTE_WINDOW} from the day it is raised in writing, before starting any formal proceedings. Nothing here stops either side from going to court sooner where the law gives you that right.`,
    ],
  },
  {
    heading: "Governing law",
    body: [
      `These terms are governed by ${GOVERNING_LAW}, and ${JURISDICTION} have exclusive jurisdiction over any dispute. If you are a consumer, this does not remove protections you have under the law of your own country.`,
    ],
  },
  {
    heading: "Contact",
    body: [
      `For support, email ${SUPPORT_EMAIL}. We reply ${SUPPORT_RESPONSE}.`,
    ],
  },
];
