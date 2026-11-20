import type { CharacterThemeConfig, CharacterThemeId } from "../types/report";

const SPONGEBOB_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 175" fill="none">
  <!-- Left waving arm -->
  <path d="M52 108 C32 95, 22 76, 17 58" stroke="#2D1B00" stroke-width="14" stroke-linecap="round"/>
  <path d="M52 108 C32 95, 22 76, 17 58" stroke="#FFE135" stroke-width="8.5" stroke-linecap="round"/>
  <!-- Left hand fingers -->
  <ellipse cx="16" cy="54" rx="11" ry="9" fill="#FFE135" stroke="#2D1B00" stroke-width="2.6"/>
  <path d="M8 50 L4 41 M14 46 L13 36 M21 47 L23 38 M26 52 L31 46" stroke="#2D1B00" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Left sleeve -->
  <path d="M47 99 L60 95 L63 114 L49 116 Z" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.6" stroke-linejoin="round"/>

  <!-- Right waving arm -->
  <path d="M188 104 C206 90, 214 70, 220 52" stroke="#2D1B00" stroke-width="14" stroke-linecap="round"/>
  <path d="M188 104 C206 90, 214 70, 220 52" stroke="#FFE135" stroke-width="8.5" stroke-linecap="round"/>
  <!-- Right hand fingers -->
  <ellipse cx="222" cy="48" rx="11" ry="9" fill="#FFE135" stroke="#2D1B00" stroke-width="2.6"/>
  <path d="M214 45 L210 36 M221 41 L222 31 M228 43 L232 34 M232 49 L238 44" stroke="#2D1B00" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Right sleeve -->
  <path d="M178 93 L192 97 L189 114 L175 111 Z" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.6" stroke-linejoin="round"/>

  <!-- Sponge body 3D side -->
  <path d="M62 24 C74 17, 152 14, 174 22 C180 24, 185 30, 184 40 L177 148 L56 148 L54 40 C54 31, 56 27, 62 24 Z" fill="#E3B800" stroke="#2D1B00" stroke-width="3"/>
  <!-- Sponge main wavy body -->
  <path d="M60 27 Q74 20 88 26 Q103 20 118 26 Q133 19 148 25 Q163 20 174 27 Q180 42 175 56 Q181 71 175 86 Q180 101 174 116 L174 148 L60 148 L58 115 Q52 100 58 85 Q52 70 58 55 Q53 40 60 27 Z" fill="#FFE63B" stroke="#2D1B00" stroke-width="3" stroke-linejoin="round"/>

  <!-- Sponge pores -->
  <ellipse cx="70" cy="42" rx="6" ry="7" fill="#C9A000" opacity="0.72"/>
  <circle cx="77" cy="60" r="3.5" fill="#C9A000" opacity="0.72"/>
  <ellipse cx="163" cy="45" rx="5.5" ry="6.5" fill="#C9A000" opacity="0.72"/>
  <circle cx="158" cy="106" r="4" fill="#C9A000" opacity="0.72"/>
  <circle cx="72" cy="108" r="4.5" fill="#C9A000" opacity="0.72"/>
  <circle cx="148" cy="34" r="3" fill="#C9A000" opacity="0.72"/>

  <!-- Eyelashes -->
  <path d="M84 48 L80 39 M94 45 L94 36 M104 48 L108 39" stroke="#2D1B00" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M126 48 L122 39 M136 45 L136 36 M146 48 L150 39" stroke="#2D1B00" stroke-width="2.6" stroke-linecap="round"/>

  <!-- Big Eyes -->
  <circle cx="94" cy="66" r="18" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.8"/>
  <circle cx="136" cy="66" r="18" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.8"/>
  <!-- Blue Irises -->
  <circle cx="97" cy="67" r="9.5" fill="#32A8E8" stroke="#2D1B00" stroke-width="2"/>
  <circle cx="133" cy="67" r="9.5" fill="#32A8E8" stroke="#2D1B00" stroke-width="2"/>
  <!-- Pupils -->
  <circle cx="97" cy="67" r="5" fill="#1A1A1A"/>
  <circle cx="133" cy="67" r="5" fill="#1A1A1A"/>
  <!-- Eye shines -->
  <circle cx="94" cy="63" r="2.6" fill="#FFFFFF"/>
  <circle cx="130" cy="63" r="2.6" fill="#FFFFFF"/>

  <!-- Cheeks & freckles -->
  <ellipse cx="74" cy="88" rx="9" ry="7" fill="#FFE63B" stroke="#E06324" stroke-width="2"/>
  <circle cx="71" cy="87" r="1.4" fill="#E06324"/>
  <circle cx="77" cy="86" r="1.4" fill="#E06324"/>
  <circle cx="74" cy="91" r="1.4" fill="#E06324"/>

  <ellipse cx="156" cy="88" rx="9" ry="7" fill="#FFE63B" stroke="#E06324" stroke-width="2"/>
  <circle cx="153" cy="87" r="1.4" fill="#E06324"/>
  <circle cx="159" cy="86" r="1.4" fill="#E06324"/>
  <circle cx="156" cy="91" r="1.4" fill="#E06324"/>

  <!-- Nose -->
  <path d="M113 70 C118 65, 128 73, 122 81 C118 85, 110 83, 111 76" fill="#FFE63B" stroke="#2D1B00" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Big happy mouth -->
  <path d="M77 92 Q115 104 153 92 C152 117, 134 127, 115 127 C96 127, 78 117, 77 92 Z" fill="#7D1418" stroke="#2D1B00" stroke-width="2.8" stroke-linejoin="round"/>
  <!-- Tongue -->
  <path d="M97 119 Q115 109 133 119 Q124 126 115 126 Q106 126 97 119 Z" fill="#F2889B" stroke="#2D1B00" stroke-width="1.8"/>
  <!-- Buck teeth -->
  <rect x="99" y="96" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.2"/>
  <rect x="119" y="96" width="12" height="12" rx="2" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.2"/>

  <!-- White Shirt & Collar -->
  <rect x="59" y="132" width="115" height="22" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.8"/>
  <polygon points="88,132 104,132 95,146" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.2" stroke-linejoin="round"/>
  <polygon points="126,132 142,132 135,146" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.2" stroke-linejoin="round"/>
  <!-- Red Tie -->
  <polygon points="109,132 121,132 119,142 111,142" fill="#E32626" stroke="#2D1B00" stroke-width="2.2"/>
  <polygon points="111,142 119,142 124,158 115,166 106,158" fill="#E32626" stroke="#2D1B00" stroke-width="2.2" stroke-linejoin="round"/>

  <!-- Brown SquarePants -->
  <rect x="59" y="152" width="115" height="23" fill="#945C24" stroke="#2D1B00" stroke-width="2.8"/>
  <!-- Belt dashes -->
  <rect x="66" y="156" width="14" height="5" rx="1.5" fill="#1C1C1C"/>
  <rect x="88" y="156" width="14" height="5" rx="1.5" fill="#1C1C1C"/>
  <rect x="128" y="156" width="14" height="5" rx="1.5" fill="#1C1C1C"/>
  <rect x="150" y="156" width="14" height="5" rx="1.5" fill="#1C1C1C"/>
</svg>`;

const WOODY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 175" fill="none">
  <!-- Cowboy Hat Back Brim -->
  <path d="M40 50 C34 32, 68 18, 118 18 C168 18, 200 32, 192 52 C184 68, 146 72, 116 70 C82 68, 46 66, 40 50 Z" fill="#8E4820" stroke="#2D1B00" stroke-width="3"/>
  <!-- Hat Crown -->
  <path d="M74 44 C76 14, 96 8, 117 14 C138 8, 158 14, 160 44 Z" fill="#A85928" stroke="#2D1B00" stroke-width="3" stroke-linejoin="round"/>
  <!-- Hat Center Crease -->
  <path d="M107 15 Q117 24 127 15" stroke="#5E2B10" stroke-width="2.8" stroke-linecap="round"/>
  <!-- Hat Band -->
  <path d="M74 40 Q117 48 160 40 L161 48 Q117 56 73 48 Z" fill="#5A280E" stroke="#2D1B00" stroke-width="2.2"/>
  <!-- Hat Front Brim Highlight -->
  <path d="M44 48 Q116 68 188 49" stroke="#C4743E" stroke-width="3" stroke-linecap="round"/>

  <!-- Hair tufts -->
  <path d="M77 52 C68 62, 68 78, 74 86 C75 74, 80 62, 84 54 Z" fill="#5C3216" stroke="#2D1B00" stroke-width="2.4"/>
  <path d="M156 54 C162 63, 163 76, 157 86 C156 74, 152 63, 149 55 Z" fill="#5C3216" stroke="#2D1B00" stroke-width="2.4"/>

  <!-- Ears -->
  <ellipse cx="73" cy="89" rx="7" ry="11" fill="#FAD2AC" stroke="#2D1B00" stroke-width="2.6"/>
  <ellipse cx="160" cy="89" rx="7" ry="11" fill="#FAD2AC" stroke="#2D1B00" stroke-width="2.6"/>

  <!-- Face -->
  <path d="M78 55 C76 80, 77 104, 89 119 C100 132, 132 132, 144 119 C155 104, 156 80, 154 55 Q116 61 78 55 Z" fill="#FCE0C1" stroke="#2D1B00" stroke-width="3" stroke-linejoin="round"/>

  <!-- Cheek Rosiness -->
  <ellipse cx="90" cy="96" rx="8" ry="5" fill="#F29B7E" opacity="0.45"/>
  <ellipse cx="143" cy="96" rx="8" ry="5" fill="#F29B7E" opacity="0.45"/>

  <!-- Eyebrows -->
  <path d="M87 67 Q98 61 108 67" stroke="#4D2810" stroke-width="3.8" stroke-linecap="round"/>
  <path d="M124 67 Q134 61 145 67" stroke="#4D2810" stroke-width="3.8" stroke-linecap="round"/>

  <!-- Eyes -->
  <ellipse cx="98" cy="80" rx="10" ry="11.5" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.4"/>
  <ellipse cx="134" cy="80" rx="10" ry="11.5" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.4"/>
  <circle cx="99" cy="81" r="5.5" fill="#6E3B18"/>
  <circle cx="133" cy="81" r="5.5" fill="#6E3B18"/>
  <circle cx="99" cy="81" r="3" fill="#18120E"/>
  <circle cx="133" cy="81" r="3" fill="#18120E"/>
  <circle cx="97" cy="78" r="2" fill="#FFFFFF"/>
  <circle cx="131" cy="78" r="2" fill="#FFFFFF"/>

  <!-- Nose -->
  <path d="M115 79 C112 91, 108 97, 114 99 C121 100, 123 95, 120 89" fill="#F5C396" stroke="#2D1B00" stroke-width="2.3" stroke-linecap="round"/>

  <!-- Big Friendly Smile -->
  <path d="M95 104 Q116 112 137 104 C136 119, 126 125, 116 125 C106 125, 96 119, 95 104 Z" fill="#7D181A" stroke="#2D1B00" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M97 105 Q116 111 135 105 L133 112 Q116 116 99 112 Z" fill="#FFFFFF"/>
  <path d="M105 120 Q116 114 127 120 Q121 124 116 124 Q111 124 105 120 Z" fill="#F07D8B"/>

  <!-- Neck -->
  <rect x="103" y="124" width="26" height="16" fill="#F2C89E" stroke="#2D1B00" stroke-width="2.5"/>

  <!-- Yellow Plaid Shirt Base -->
  <path d="M64 146 C76 135, 98 132, 116 132 C134 132, 156 135, 168 146 L176 175 L56 175 Z" fill="#FFD22B" stroke="#2D1B00" stroke-width="3"/>
  <!-- Plaid Stripes -->
  <path d="M72 142 L160 142 M64 156 L168 156 M58 168 L174 168" stroke="#D97B1E" stroke-width="2" opacity="0.75"/>
  <path d="M78 139 L74 175 M154 139 L158 175" stroke="#D97B1E" stroke-width="2" opacity="0.75"/>

  <!-- Cow-print Vest -->
  <path d="M84 134 L106 136 L104 175 L73 175 Z" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.6"/>
  <path d="M148 134 L126 136 L128 175 L159 175 Z" fill="#FFFFFF" stroke="#2D1B00" stroke-width="2.6"/>
  <!-- Cow spots -->
  <ellipse cx="89" cy="154" rx="7" ry="6" fill="#222222"/>
  <ellipse cx="97" cy="168" rx="6" ry="5" fill="#222222"/>
  <ellipse cx="143" cy="152" rx="7" ry="6" fill="#222222"/>
  <ellipse cx="136" cy="167" rx="6" ry="5" fill="#222222"/>

  <!-- Sheriff Badge Star on left vest -->
  <polygon points="91,142 93.5,147.5 99.5,148 95,152 96.5,158 91,155 85.5,158 87,152 82.5,148 88.5,147.5" fill="#FFC812" stroke="#2D1B00" stroke-width="1.6"/>

  <!-- Red Bandana Scarf -->
  <path d="M96 130 Q116 142 136 130 L141 142 Q116 155 91 142 Z" fill="#DC2626" stroke="#2D1B00" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M116 144 L126 159 L115 162 L109 148 Z" fill="#DC2626" stroke="#2D1B00" stroke-width="2.3" stroke-linejoin="round"/>
  <circle cx="115" cy="144" r="5" fill="#B91C1C" stroke="#2D1B00" stroke-width="2.2"/>

  <!-- Right Arm & Hand Tipping Hat Brim -->
  <path d="M162 146 C188 130, 198 92, 188 60" stroke="#2D1B00" stroke-width="21" stroke-linecap="round" fill="none"/>
  <path d="M162 146 C188 130, 198 92, 188 60" stroke="#FFD22B" stroke-width="15" stroke-linecap="round"/>
  <!-- Hand on hat brim -->
  <ellipse cx="187" cy="54" rx="12" ry="9" fill="#FCE0C1" stroke="#2D1B00" stroke-width="2.6"/>
  <path d="M178 51 Q184 44 191 49" stroke="#2D1B00" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

const PIKACHU_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 175" fill="none">
  <!-- Left Ear -->
  <path d="M84 56 C62 28, 42 14, 28 12 C34 28, 52 52, 74 70 Z" fill="#FFD924" stroke="#2D1B00" stroke-width="3" stroke-linejoin="round"/>
  <path d="M46 28 C37 18, 31 13, 28 12 C31 19, 36 28, 44 37 Z" fill="#231F20" stroke="#2D1B00" stroke-width="2"/>
  <!-- Right Ear -->
  <path d="M156 56 C178 28, 198 14, 212 12 C206 28, 188 52, 166 70 Z" fill="#FFD924" stroke="#2D1B00" stroke-width="3" stroke-linejoin="round"/>
  <path d="M194 28 C203 18, 209 13, 212 12 C209 19, 204 28, 196 37 Z" fill="#231F20" stroke="#2D1B00" stroke-width="2"/>

  <!-- Lightning Tail peeking right -->
  <polygon points="168,148 192,126 184,116 212,86 226,102 200,126 208,136 176,162" fill="#FFD924" stroke="#2D1B00" stroke-width="3" stroke-linejoin="round"/>

  <!-- Body & Head -->
  <path d="M62 175 C58 142, 64 114, 72 96 C66 78, 78 46, 120 46 C162 46, 174 78, 168 96 C176 114, 182 142, 178 175 Z" fill="#FFD924" stroke="#2D1B00" stroke-width="3.2" stroke-linejoin="round"/>

  <!-- Eyes -->
  <circle cx="96" cy="84" r="10.5" fill="#1C1917"/>
  <circle cx="144" cy="84" r="10.5" fill="#1C1917"/>
  <circle cx="93" cy="80" r="3.6" fill="#FFFFFF"/>
  <circle cx="141" cy="80" r="3.6" fill="#FFFFFF"/>

  <!-- Red Electric Cheeks -->
  <circle cx="80" cy="102" r="12" fill="#EF3B2D" stroke="#2D1B00" stroke-width="2"/>
  <circle cx="160" cy="102" r="12" fill="#EF3B2D" stroke="#2D1B00" stroke-width="2"/>

  <!-- Nose -->
  <polygon points="117,92 123,92 120,96" fill="#2D1B00"/>

  <!-- Happy Mouth -->
  <path d="M106 101 Q113 108 120 101 Q127 108 134 101" stroke="#2D1B00" stroke-width="2.6" stroke-linecap="round" fill="none"/>
  <path d="M111 103 C112 117, 128 117, 129 103 Q120 108 111 103 Z" fill="#E84F5E" stroke="#2D1B00" stroke-width="2.2"/>

  <!-- Waving Left Paw -->
  <path d="M72 134 C50 124, 38 106, 46 96 C54 88, 72 104, 82 124" fill="#FFD924" stroke="#2D1B00" stroke-width="3" stroke-linecap="round"/>
  <!-- Right Paw -->
  <path d="M158 136 C174 134, 182 146, 174 156 C166 164, 148 156, 144 146" fill="#FFD924" stroke="#2D1B00" stroke-width="2.8" stroke-linecap="round"/>
</svg>`;

const DORAEMON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 175" fill="none">
  <!-- Left waving arm -->
  <path d="M62 132 C38 116, 28 94, 34 78" stroke="#103159" stroke-width="21" stroke-linecap="round" fill="none"/>
  <path d="M62 132 C38 116, 28 94, 34 78" stroke="#1890DC" stroke-width="15" stroke-linecap="round"/>
  <circle cx="34" cy="74" r="14" fill="#FFFFFF" stroke="#103159" stroke-width="2.8"/>

  <!-- Right arm -->
  <path d="M178 134 C196 144, 206 158, 198 168" stroke="#103159" stroke-width="21" stroke-linecap="round" fill="none"/>
  <path d="M178 134 C196 144, 206 158, 198 168" stroke="#1890DC" stroke-width="15" stroke-linecap="round"/>
  <circle cx="198" cy="164" r="13" fill="#FFFFFF" stroke="#103159" stroke-width="2.8"/>

  <!-- Blue Body -->
  <path d="M66 124 L174 124 L180 175 L60 175 Z" fill="#1890DC" stroke="#103159" stroke-width="3"/>
  <!-- White Belly -->
  <ellipse cx="120" cy="156" rx="44" ry="34" fill="#FFFFFF" stroke="#103159" stroke-width="2.6"/>
  <!-- 4D Pocket -->
  <path d="M88 152 L152 152 C152 170, 138 175, 120 175 C102 175, 88 170, 88 152 Z" fill="#FFFFFF" stroke="#103159" stroke-width="2.6"/>

  <!-- Blue Head -->
  <ellipse cx="120" cy="76" rx="64" ry="58" fill="#1890DC" stroke="#103159" stroke-width="3.2"/>
  <!-- White Face Mask -->
  <ellipse cx="120" cy="86" rx="52" ry="44" fill="#FFFFFF" stroke="#103159" stroke-width="2.6"/>

  <!-- Eyes -->
  <ellipse cx="105" cy="54" rx="13" ry="16" fill="#FFFFFF" stroke="#103159" stroke-width="2.5"/>
  <ellipse cx="135" cy="54" rx="13" ry="16" fill="#FFFFFF" stroke="#103159" stroke-width="2.5"/>
  <!-- Happy Eye Arcs / Pupils -->
  <circle cx="108" cy="56" r="5" fill="#103159"/>
  <circle cx="132" cy="56" r="5" fill="#103159"/>
  <circle cx="106" cy="54" r="1.8" fill="#FFFFFF"/>
  <circle cx="130" cy="54" r="1.8" fill="#FFFFFF"/>

  <!-- Red Nose -->
  <circle cx="120" cy="72" r="9.5" fill="#E32626" stroke="#103159" stroke-width="2.4"/>
  <circle cx="117" cy="69" r="3" fill="#FFFFFF" opacity="0.85"/>
  <line x1="120" y1="81" x2="120" y2="95" stroke="#103159" stroke-width="2.5"/>

  <!-- Big Smile -->
  <path d="M82 90 Q120 105 158 90 C156 115, 138 123, 120 123 C102 123, 84 115, 82 90 Z" fill="#D93848" stroke="#103159" stroke-width="2.5"/>
  <path d="M100 116 Q120 106 140 116 Q130 123 120 123 Q110 123 100 116 Z" fill="#F28B96"/>

  <!-- Whiskers -->
  <path d="M74 72 L96 77 M70 82 L94 83 M74 92 L96 89" stroke="#103159" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M166 72 L144 77 M170 82 L146 83 M166 92 L144 89" stroke="#103159" stroke-width="2.2" stroke-linecap="round"/>

  <!-- Red Collar & Golden Bell -->
  <rect x="74" y="122" width="92" height="10" rx="5" fill="#E32626" stroke="#103159" stroke-width="2.5"/>
  <circle cx="120" cy="134" r="10.5" fill="#FFD224" stroke="#103159" stroke-width="2.5"/>
  <line x1="111" y1="132" x2="129" y2="132" stroke="#103159" stroke-width="2"/>
  <circle cx="120" cy="137" r="2.6" fill="#103159"/>
</svg>`;

function svgToAvatar(svg: string): string {
  return svg;
}

export const CHARACTER_THEMES: Record<CharacterThemeId, CharacterThemeConfig> = {
  spongebob: {
    id: "spongebob",
    name: "SpongeBob",
    subtitle: "Bikini Bottom",
    frameBorder: "#F6C30E",
    bannerBgStart: "#FFFDF3",
    bannerBgEnd: "#FFF4BE",
    bannerDotColor: "rgba(246, 195, 14, 0.16)",
    titleFillTop: "#FFD11A",
    titleFillBottom: "#EE9F00",
    titleStroke: "#FFFFFF",
    titleShadow: "rgba(170, 112, 0, 0.30)",
    dateBorder: "#F2BE0C",
    dateText: "#5C3D00",
    tableHeadStart: "#FAD019",
    tableHeadEnd: "#F3BA0A",
    tableHeadText: "#2D1D00",
    tableLine: "#ECD273",
    rowAltBg: "#FFFDF2",
    badgeBgStart: "#FAD019",
    badgeBgEnd: "#EDA900",
    inkPrimary: "#241800",
    inkMuted: "#A16D00",
    footBgStart: "#FFFDF4",
    footBgEnd: "#FFF7D6",
    footAccent: "#F0A800",
    characterPngUrl: "/themes/spongebob/character.png",
    backgroundPngUrl: "/themes/spongebob/background.png",
    characterSvg: SPONGEBOB_SVG,
    avatarSvg: svgToAvatar(SPONGEBOB_SVG),
  },
  woody: {
    id: "woody",
    name: "Woody",
    subtitle: "Sheriff Toy Story",
    frameBorder: "#F5BC0C",
    bannerBgStart: "#FFFDF4",
    bannerBgEnd: "#FFF2B2",
    bannerDotColor: "rgba(238, 165, 15, 0.16)",
    titleFillTop: "#FFC812",
    titleFillBottom: "#E69200",
    titleStroke: "#FFFFFF",
    titleShadow: "rgba(165, 98, 0, 0.30)",
    dateBorder: "#EEB30C",
    dateText: "#5C3800",
    tableHeadStart: "#F9CA16",
    tableHeadEnd: "#F0B207",
    tableHeadText: "#2D1B00",
    tableLine: "#E8CA68",
    rowAltBg: "#FFFDF0",
    badgeBgStart: "#F9CA16",
    badgeBgEnd: "#E69E00",
    inkPrimary: "#261700",
    inkMuted: "#9C6200",
    footBgStart: "#FFFDF3",
    footBgEnd: "#FFF5CE",
    footAccent: "#EB9C00",
    characterPngUrl: "/themes/woody/character.png",
    backgroundPngUrl: "/themes/woody/background.png",
    characterSvg: WOODY_SVG,
    avatarSvg: svgToAvatar(WOODY_SVG),
  },
  pikachu: {
    id: "pikachu",
    name: "Pikachu",
    subtitle: "Electric Spark",
    frameBorder: "#F5C00A",
    bannerBgStart: "#FFFDF4",
    bannerBgEnd: "#FFF1AE",
    bannerDotColor: "rgba(240, 175, 10, 0.16)",
    titleFillTop: "#FFD016",
    titleFillBottom: "#EB9800",
    titleStroke: "#FFFFFF",
    titleShadow: "rgba(170, 100, 0, 0.28)",
    dateBorder: "#F0B80C",
    dateText: "#5A3800",
    tableHeadStart: "#FAD018",
    tableHeadEnd: "#F1B408",
    tableHeadText: "#2B1900",
    tableLine: "#E9CD6A",
    rowAltBg: "#FFFDF1",
    badgeBgStart: "#FAD018",
    badgeBgEnd: "#EA9F00",
    inkPrimary: "#241600",
    inkMuted: "#A06400",
    footBgStart: "#FFFDF4",
    footBgEnd: "#FFF6D0",
    footAccent: "#EC9E00",
    characterPngUrl: "/themes/pikachu/character.png",
    backgroundPngUrl: "/themes/pikachu/background.png",
    characterSvg: PIKACHU_SVG,
    avatarSvg: svgToAvatar(PIKACHU_SVG),
  },
  doraemon: {
    id: "doraemon",
    name: "Doraemon",
    subtitle: "Future Cat",
    frameBorder: "#2699E6",
    bannerBgStart: "#F8FCFF",
    bannerBgEnd: "#DDF1FF",
    bannerDotColor: "rgba(38, 153, 230, 0.14)",
    titleFillTop: "#2BA2F0",
    titleFillBottom: "#0E74C2",
    titleStroke: "#FFFFFF",
    titleShadow: "rgba(14, 116, 194, 0.28)",
    dateBorder: "#2699E6",
    dateText: "#0C4275",
    tableHeadStart: "#2699E6",
    tableHeadEnd: "#137DCA",
    tableHeadText: "#FFFFFF",
    tableLine: "#A9D5F5",
    rowAltBg: "#F4FAFF",
    badgeBgStart: "#2699E6",
    badgeBgEnd: "#1077C2",
    inkPrimary: "#0D2B4D",
    inkMuted: "#286CA3",
    footBgStart: "#F7FBFF",
    footBgEnd: "#E6F4FF",
    footAccent: "#1480CC",
    characterPngUrl: "/themes/doraemon/character.png",
    backgroundPngUrl: "/themes/doraemon/background.png",
    characterSvg: DORAEMON_SVG,
    avatarSvg: svgToAvatar(DORAEMON_SVG),
  },
};

export const CHARACTER_THEME_LIST: CharacterThemeConfig[] = [
  CHARACTER_THEMES.spongebob,
  CHARACTER_THEMES.woody,
  CHARACTER_THEMES.pikachu,
  CHARACTER_THEMES.doraemon,
];

export function resolveCharacterTheme(rawKey: string | null | undefined): CharacterThemeConfig {
  if (rawKey && rawKey in CHARACTER_THEMES) {
    return CHARACTER_THEMES[rawKey as CharacterThemeId];
  }
  return CHARACTER_THEMES.spongebob;
}
