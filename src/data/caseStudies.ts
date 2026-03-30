export interface CaseStudy {
  id: string
  client: string
  title: string
  subtitle: string
  thumbnailUrl: string
  heroImageUrl: string
  heroHeading: string
  heroBody: string
  stats: { label: string }[]
  images: {
    wide: string   // spans 2 cols
    tall: string   // single col
    square: string // single col
    wide2: string  // spans 2 cols
  }
  bodyHeading: string
  bodyText: string
}

// Images sourced from Figma export (valid for 7 days from 2026-03-29)
export const caseStudies: CaseStudy[] = [
  {
    id: 'riot-esports-network',
    client: 'RIOT GAMES',
    title: 'Riot Esports Network',
    subtitle: "Riot Esports Network was an initiative to align all of Riot's esports services under one home.",
    thumbnailUrl: 'https://www.figma.com/api/mcp/asset/4625884e-a9d3-4e19-b6a3-79fb3eb43b8d',
    heroImageUrl: 'https://www.figma.com/api/mcp/asset/ac1ae5a6-83cc-42ab-9ddc-8d2aff9b6d27',
    heroHeading: 'Creating the future of esports',
    heroBody: "Riot Esports Network was an initiative to align all of Riot's esports services under one home.",
    stats: [
      { label: 'A/B Testing' },
      { label: '6 yr' },
      { label: '10cm' },
    ],
    images: {
      wide: 'https://www.figma.com/api/mcp/asset/3c178bfd-a224-4364-afae-56ed2830318e',
      tall: 'https://www.figma.com/api/mcp/asset/df93bf59-5ca1-409b-b362-fcf540ddc6f1',
      square: 'https://www.figma.com/api/mcp/asset/1b6ee789-a490-4dc8-914c-4dd83193fc2c',
      wide2: 'https://www.figma.com/api/mcp/asset/b3007f16-f4cb-4013-a958-8be7db9674a3',
    },
    bodyHeading: 'I design brands & products that attract attention & multiply user value.',
    bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium nulla eget condimentum efficitur. Etiam lacinia sem vel felis auctor aliquam eu vitae elit.',
  },
  {
    id: 'ios-concept',
    client: 'PERSONAL',
    title: 'iOS Concept',
    subtitle: 'An experimental redesign exploring new directions for mobile interface density and expressiveness.',
    thumbnailUrl: 'https://www.figma.com/api/mcp/asset/b8903d89-ff95-415f-b123-11eba346b291',
    heroImageUrl: 'https://www.figma.com/api/mcp/asset/b8903d89-ff95-415f-b123-11eba346b291',
    heroHeading: 'Rethinking the home screen',
    heroBody: 'An experimental redesign exploring new directions for mobile interface density and expressiveness.',
    stats: [
      { label: 'Motion' },
      { label: '3 wk' },
      { label: 'Figma' },
    ],
    images: {
      wide: 'https://www.figma.com/api/mcp/asset/b8903d89-ff95-415f-b123-11eba346b291',
      tall: 'https://www.figma.com/api/mcp/asset/b8903d89-ff95-415f-b123-11eba346b291',
      square: 'https://www.figma.com/api/mcp/asset/b8903d89-ff95-415f-b123-11eba346b291',
      wide2: 'https://www.figma.com/api/mcp/asset/b8903d89-ff95-415f-b123-11eba346b291',
    },
    bodyHeading: 'Designing for the next billion users.',
    bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium nulla eget condimentum efficitur.',
  },
  {
    id: 'automotive-ui',
    client: 'AUTOMOTIVE',
    title: 'Automotive UI',
    subtitle: 'In-vehicle interface system designed for safety-first interaction at speed.',
    thumbnailUrl: 'https://www.figma.com/api/mcp/asset/dbdb9cc3-078c-4994-bdbe-941b47331990',
    heroImageUrl: 'https://www.figma.com/api/mcp/asset/dbdb9cc3-078c-4994-bdbe-941b47331990',
    heroHeading: 'Safety-first design at speed',
    heroBody: 'In-vehicle interface system designed for safety-first interaction at speed.',
    stats: [
      { label: 'Research' },
      { label: '8 mo' },
      { label: 'HMI' },
    ],
    images: {
      wide: 'https://www.figma.com/api/mcp/asset/dbdb9cc3-078c-4994-bdbe-941b47331990',
      tall: 'https://www.figma.com/api/mcp/asset/dbdb9cc3-078c-4994-bdbe-941b47331990',
      square: 'https://www.figma.com/api/mcp/asset/dbdb9cc3-078c-4994-bdbe-941b47331990',
      wide2: 'https://www.figma.com/api/mcp/asset/dbdb9cc3-078c-4994-bdbe-941b47331990',
    },
    bodyHeading: 'Designing for critical moments.',
    bodyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean pretium nulla eget condimentum efficitur.',
  },
]
