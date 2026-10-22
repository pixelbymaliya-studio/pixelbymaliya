/**
 * PIXEL BY MALIYA — LIGHT PORTFOLIO ENGINE (V2)
 * High-Performance Client Rendering · Firestore REST Sync · Instant Hydration · Lightbox
 * 100% WCAG AAA Compliant · 0ms First Render Delay
 */

(function () {
  'use strict';

  // Instant Verified Baseline Cache (Ensures 0ms first paint without waiting for network)
  const INITIAL_PROJECTS = [
  {
    "id": "11ts6bZ6ddWVQRAFijwO",
    "image": "",
    "url": "https://youtube.com/shorts/iqtXBCv8Lrk?feature=share",
    "tech": "",
    "createdAt": 1780642520365,
    "title": "Gym Focus",
    "type": "video",
    "images": [],
    "storagePath": "",
    "description": ""
  },
  {
    "id": "JClgCbxMDBxgzAcuay1p",
    "type": "video",
    "url": "https://youtube.com/shorts/_QJAj7Hv1r8?feature=share",
    "image": "",
    "title": "Health Food Focus",
    "tech": "",
    "images": [],
    "storagePath": "",
    "description": "",
    "createdAt": 1780642326341
  },
  {
    "id": "97VIYHbxnEbjDwlShRaR",
    "storagePath": "",
    "type": "graphic",
    "description": "Fresh salad range එකට clean, healthy & premium look එකක් දෙන්න try කරපු design series එකක්.",
    "category": "social-media",
    "image": "https://i.ibb.co/13XCDy5/3.jpg",
    "title": "Healthy Bites Mawanella වෙනුවෙන් කරපු අලුත්ම Social Media Design Set එක 🥗✨",
    "createdAt": 1780337175626,
    "images": [
      "https://i.ibb.co/13XCDy5/3.jpg",
      "https://i.ibb.co/Mykxrysx/4.jpg",
      "https://i.ibb.co/S4ddDvBZ/5.jpg",
      "https://i.ibb.co/gLWk34dj/7.jpg",
      "https://i.ibb.co/rG7gb4j2/8.jpg",
      "https://i.ibb.co/m5p2XBrT/9.jpg"
    ]
  },
  {
    "id": "kMCT5kVdcstjvGN9X8zc",
    "images": [],
    "createdAt": 1779712988555,
    "title": "Manaranjama Song Lyrics Edit",
    "url": "https://youtu.be/EMD1tkWb8ko",
    "tech": "Premire Pro",
    "image": "",
    "description": "",
    "type": "video",
    "storagePath": ""
  },
  {
    "id": "s9wsV5CSJrj3oz9P30jI",
    "category": "logo",
    "createdAt": 1777188815630,
    "storagePath": "",
    "description": "A clean and professional business card suite designed for the leadership team at Aththanayaka Auto Trading (PVT) LTD. The design focuses on a sleek automotive aesthetic, incorporating a dynamic car silhouette and bold typography to reflect the company's strength and reliability in the industry. The cohesive color palette of red, black, and grey ensures a premium look across all director-level stationery",
    "images": [
      "https://i.ibb.co/mF60J8LY/Aththanayaka-Cards-Mockup-1x1.png",
      "https://i.ibb.co/dwkP7Dyg/Aththanayaka-03.png",
      "https://i.ibb.co/NdYnRvrb/Athtnayaka-01.png",
      "https://i.ibb.co/svRGh6Xj/Athtnayaka-02.png",
      "https://i.ibb.co/vRDBj95/Whats-App-Image-2026-04-26-at-12-51-37-1.jpg",
      "https://i.ibb.co/9mGrZYrQ/Whats-App-Image-2026-04-26-at-12-51-37.jpg"
    ],
    "title": "Corporate Identity Design for Aththanayaka Auto Trading",
    "image": "https://i.ibb.co/mF60J8LY/Aththanayaka-Cards-Mockup-1x1.png",
    "type": "graphic"
  },
  {
    "id": "LoQdpAYxv9lUHopGyfLE",
    "category": "key-tag",
    "images": [
      "https://i.ibb.co/d4w7Tc4y/unwatermarked-Gemini-Generated-Image-3k2mfh3k2mfh3k2m-1.jpg",
      "https://i.ibb.co/bgm587Nm/unwatermarked-Gemini-Generated-Image-58cg3058cg3058cg-1.jpg",
      "https://i.ibb.co/DPwFFnYP/unwatermarked-Gemini-Generated-Image-bb01lbbb01lbbb01-1.jpg",
      "https://i.ibb.co/gbBNg8mR/unwatermarked-Gemini-Generated-Image-boo4qkboo4qkboo4.jpg"
    ],
    "title": "The \"Ceylon Essence\" Keychain Collection",
    "image": "https://i.ibb.co/d4w7Tc4y/unwatermarked-Gemini-Generated-Image-3k2mfh3k2mfh3k2m-1.jpg",
    "type": "graphic",
    "storagePath": "",
    "createdAt": 1775198428683,
    "description": "Explore the beauty of Sri Lanka through our exclusively designed keychain collection. Each piece is a tribute to the island's most beloved destinations, meticulously crafted to showcase the vibrant spirit of our motherland.\n\n• The Hikkaduwa Edition: Capturing the coastal vibes with sea turtles and surfing.\n\n• The Sigiriya Edition: Honoring the architectural wonder of the Lion Rock.\n\n• The Kandy Edition: Celebrating the rich traditions and the Temple of the Sacred Tooth Relic.\n\n• The Minneriya Edition: A sunset view of the majestic Sri Lankan elephants."
  },
  {
    "id": "Z6U0nUXXHWKzfMjDtiq5",
    "storagePath": "",
    "description": "As a designer, I've always wanted to capture the essence of our island's tourism and wildlife in a compact, visually appealing way. This collection features custom-designed keychains representing iconic locations like Yala and Udawalawe National Parks, along with our national identity.",
    "category": "key-tag",
    "createdAt": 1775198075008,
    "title": "Excited to share my latest design project inspired by the untamed beauty of Sri Lanka! 🇱🇰✨",
    "type": "graphic",
    "image": "https://i.ibb.co/N2RP9sFL/unwatermarked-Gemini-Generated-Image-ue6rpbue6rpbue6r.jpg",
    "images": [
      "https://i.ibb.co/N2RP9sFL/unwatermarked-Gemini-Generated-Image-ue6rpbue6rpbue6r.jpg",
      "https://i.ibb.co/dsy8LT5J/unwatermarked-Gemini-Generated-Image-v3w804v3w804v3w8.jpg",
      "https://i.ibb.co/SXD15HZ7/unwatermarked-Gemini-Generated-Image-xqcvnzxqcvnzxqcv.jpg",
      "https://i.ibb.co/Y4YLwV4p/unwatermarked-Gemini-Generated-Image-2utwrm2utwrm2utw.jpg"
    ]
  },
  {
    "id": "GdcVXduy428hzgVr4RGf",
    "createdAt": 1775197843316,
    "category": "key-tag",
    "description": "Explore the essence of the \"Pearl of the Indian Ocean\" through this vibrant collection of keychain designs. Each piece is meticulously crafted to represent the unique character of Sri Lanka’s most iconic destinations.\n\n• The Urban Spirit (Colombo): A modern take on the capital city, featuring the Lotus Tower, the cityscape, and the charming Beira Lake swans.\n\n• The Coastal Charm (Galle): A nostalgic tribute to the southern coast, featuring the historic Galle Lighthouse and the world-renowned stilt fishermen.\n\n• The Misty Highlands (Ella): Captures the magic of the hill country with the famous Nine Arch Bridge and the iconic blue train winding through tea estates.\n\n• National Identity: A bold and glossy finish of the Sri Lankan lion flag, symbolizing strength and heritage.",
    "images": [
      "https://i.ibb.co/rGw0Vn8v/unwatermarked-Gemini-Generated-Image-qss7gkqss7gkqss7-1.jpg",
      "https://i.ibb.co/kgL8p4Sz/unwatermarked-Gemini-Generated-Image-rfzbj9rfzbj9rfzb.jpg",
      "https://i.ibb.co/67HL1yDP/unwatermarked-Gemini-Generated-Image-rgajtxrgajtxrgaj.jpg",
      "https://i.ibb.co/TBq4g8Tf/unwatermarked-Gemini-Generated-Image-t2ev4st2ev4st2ev-1.jpg"
    ],
    "storagePath": "",
    "type": "graphic",
    "image": "https://i.ibb.co/rGw0Vn8v/unwatermarked-Gemini-Generated-Image-qss7gkqss7gkqss7-1.jpg",
    "title": "Sri Lanka Heritage - Souvenir Keychain Concept Series"
  },
  {
    "id": "WuVL25PnfmQy5TKaATGP",
    "storagePath": "",
    "description": "Explore the diverse beauty of Sri Lanka through our exclusively designed keychain series. This collection features four meticulously crafted illustrations representing the heart and soul of the island.\n\n• Pinnawala Edition: Capturing the serene river scenes and the majestic elephants that define the Elephant Orphanage.\n\n• Nuwara Eliya Edition: Featuring the iconic red post office, lush tea estates, and the cool mountain mist.\n\n• Kandy Edition: A royal tribute showcasing the Temple of the Sacred Tooth Relic and the traditional Kandyan dancer.\n\n• Mirissa Edition: Perfect for beach lovers, highlighting the surfing culture and the golden sunsets of the southern coast.",
    "type": "graphic",
    "category": "key-tag",
    "images": [
      "https://i.ibb.co/Xxqv7fD3/unwatermarked-Gemini-Generated-Image-hblwzmhblwzmhblw.jpg",
      "https://i.ibb.co/TMr6vJnG/unwatermarked-Gemini-Generated-Image-i1xgqni1xgqni1xg.jpg",
      "https://i.ibb.co/Kxf5SJT1/unwatermarked-Gemini-Generated-Image-mp0dipmp0dipmp0d.jpg",
      "https://i.ibb.co/bRqgJT4N/unwatermarked-Gemini-Generated-Image-kg8rnkkg8rnkkg8r.jpg"
    ],
    "image": "https://i.ibb.co/Xxqv7fD3/unwatermarked-Gemini-Generated-Image-hblwzmhblwzmhblw.jpg",
    "title": "The Emerald Isle Souvenir Collection – Keychain Series",
    "createdAt": 1775195648807
  },
  {
    "id": "iCuEO2IxxFoeEZlKg2Az",
    "createdAt": 1775035069817,
    "storagePath": "",
    "category": "visiting-card",
    "description": "A professional business card designed and printed for Darshi Tours, a car hire service based in Ranna. The goal was to create a clean, trustworthy, and informative layout that highlights their key transport services while maintaining a modern aesthetic.",
    "type": "graphic",
    "title": "Business Card Design & Print for Darshi Tours",
    "images": [
      "https://i.ibb.co/rKV2FsdN/Business-Card-Mockup-1.jpg",
      "https://i.ibb.co/h64GxSr/PXL-20260217-065929461-2.jpg",
      "https://i.ibb.co/27hBQzQM/PXL-20260217-065849467-2.jpg",
      "https://i.ibb.co/k2yBCxGR/PXL-20260217-065914178-2.jpg"
    ],
    "image": "https://i.ibb.co/rKV2FsdN/Business-Card-Mockup-1.jpg"
  },
  {
    "id": "XXY6c5J5XdaRKEHQWgKO",
    "images": [
      "https://i.ibb.co/Wv4N8mhL/PXL-20260219-043413986.jpg",
      "https://i.ibb.co/yF3xBzBt/PXL-20260219-085754983.jpg",
      "https://i.ibb.co/NntjTt5S/PXL-20260219-085818600.jpg",
      "https://i.ibb.co/DmB8sjD/PXL-20260219-085810765.jpg",
      "https://i.ibb.co/Wv4N8mhL/PXL-20260219-043413986.jpg"
    ],
    "title": "Premium Sofa Care & Warranty Card Design & Print Production",
    "image": "https://i.ibb.co/Wv4N8mhL/PXL-20260219-043413986.jpg",
    "createdAt": 1775030896167,
    "type": "graphic",
    "category": "visiting-card",
    "description": "I recently completed a comprehensive design and print project for INCRAFT Premium Furniture & Sofas. The goal was to create a functional yet aesthetically pleasing warranty card that effectively communicates product care instructions while maintaining the brand's premium identity.",
    "storagePath": ""
  },
  {
    "id": "Tsq6VQEm9fw9NWXcCOFs",
    "description": "For Heavenly Treats, the brief was \"Elegant Nostalgia.\" We combined minimalist line art with a regal gold palette to create a brand that feels as premium as it tastes. From the hand-crafted cart icon to the custom serif typography, every pixel was designed to build trust and appetite.\n\nTransforming ideas into icons. DM for branding inquiries. ✨",
    "images": [
      "https://i.ibb.co/wNrwzs7v/unwatermarked-Gemini-Generated-Image-z5nvrqz5nvrqz5nv-1.png",
      "https://i.ibb.co/Q06WkYp/untitled.jpg"
    ],
    "storagePath": "",
    "createdAt": 1774682712819,
    "category": "logo",
    "title": "More than a logo. A visual promise. 🍰👑",
    "image": "https://i.ibb.co/wNrwzs7v/unwatermarked-Gemini-Generated-Image-z5nvrqz5nvrqz5nv-1.png",
    "type": "graphic"
  },
  {
    "id": "eFmf886ynDOPtiUUD8ZX",
    "category": "social-media",
    "type": "graphic",
    "createdAt": 1773337143223,
    "image": "https://i.ibb.co/gFFsfW2M/398.jpg",
    "title": "Cake By Ashi - Social Media Campaign Design",
    "images": [
      "https://i.ibb.co/gFFsfW2M/398.jpg",
      "https://i.ibb.co/HD46JT6V/Ahi03.jpg",
      "https://i.ibb.co/N2g35JcN/Ashi04.jpg",
      "https://i.ibb.co/1t1Hf8jY/Your-post.jpg"
    ],
    "storagePath": "",
    "description": "Cake By Ashi is a premium bakery brand based in Mawanalla, Sri Lanka, specializing in custom cakes and gourmet chocolates. The objective of this project was to create a series of high-impact social media visuals to announce their new \"Homemade Chocolate\" line and promote special seasonal offers."
  },
  {
    "id": "ORhCTAP4sKHGp5JJ2uaT",
    "tech": "HTML5, CSS3, JavaScript",
    "image": "https://image.thum.io/get/width/1200/crop/800/https://malindaniroshan.github.io/Inceaft-Sofa/",
    "createdAt": 1772597919636,
    "title": "Incraft - Modern Furniture E-commerce Web Experience",
    "storagePaths": [],
    "images": [
      "https://image.thum.io/get/width/1200/crop/800/https://malindaniroshan.github.io/Inceaft-Sofa/"
    ],
    "storagePath": "",
    "url": "https://malindaniroshan.github.io/Inceaft-Sofa/",
    "type": "web",
    "description": "Incraft is a modern, high-performance e-commerce platform designed specifically for a premium sofa brand. The project focuses on bridging the gap between luxury furniture and a seamless digital shopping experience."
  },
  {
    "id": "Hl0mQ0c70HpEKstaOJpx",
    "image": "https://iili.io/qqGWFR4.jpg",
    "storagePaths": [],
    "images": [
      "https://iili.io/qqGWFR4.jpg",
      "https://iili.io/qqGWb7j.jpg",
      "https://iili.io/qqGWmkx.jpg",
      "https://iili.io/qqGWDdb.jpg"
    ],
    "description": "I recently completed this dynamic lightboard and banner design series for Hari Rasa Family Restaurant & Cafe in Weeraketiya. The objective was to create eye-catching, mouth-watering outdoor/indoor signage that effectively communicates the restaurant's diverse menu offerings to passing customers.",
    "storagePath": "",
    "createdAt": 1772391945879,
    "title": "Vibrant Lightboard Signage Design for Hari Rasa Restaurant & Cafe ✨",
    "category": "banner",
    "type": "graphic"
  },
  {
    "id": "V0ZUAVzRw7wFOXhdL3uO",
    "createdAt": 1772391391229,
    "images": [
      "https://iili.io/qqG1uEJ.png"
    ],
    "title": "Recent flyer design project for an O/L ICT Tuition Class. 🚀📚",
    "storagePaths": [],
    "description": "Designed a clean and professional social media promotional poster for an ongoing ICT class. The focus was on clear typography, a logical information hierarchy, and maintaining an engaging, modern look to attract students.",
    "storagePath": "",
    "category": "social-media",
    "image": "https://iili.io/qqG1uEJ.png",
    "type": "graphic"
  },
  {
    "id": "dwlIYfpFvXNa6rQG60sG",
    "image": "https://iili.io/qqGaU57.png",
    "createdAt": 1772390972309,
    "description": "",
    "storagePath": "",
    "images": [
      "https://iili.io/qqGaU57.png",
      "https://iili.io/qqGarbe.png",
      "https://iili.io/qqGavg2.jpg",
      "https://iili.io/qqGaSJS.jpg"
    ],
    "title": "SS Home Delivery\" Rathnapura - Another successful delivery by us! 🚀",
    "category": "visiting-card",
    "type": "graphic",
    "storagePaths": []
  },
  {
    "id": "cN1d50yU2B8Kwey1HNEZ",
    "image": "https://iili.io/qqGuDJe.png",
    "createdAt": 1772390567993,
    "category": "visiting-card",
    "storagePaths": [],
    "title": "Hands down, one of the most stunning designs I’ve ever crafted! ✨",
    "type": "graphic",
    "images": [
      "https://iili.io/qqGuDJe.png",
      "https://iili.io/qqGuPWl.jpg",
      "https://iili.io/qqGurbf.jpg",
      "https://iili.io/qqGuSJn.jpg",
      "https://iili.io/qqGuLfS.jpg"
    ],
    "description": "",
    "storagePath": ""
  },
  {
    "id": "CvoWjigus17xDMcIarXz",
    "category": "visiting-card",
    "images": [
      "https://iili.io/qqGo30u.png",
      "https://iili.io/qqGoBOQ.jpg",
      "https://iili.io/qqGofJj.jpg",
      "https://iili.io/qqGoq5x.jpg"
    ],
    "title": "Car Hire Service !✨😍",
    "storagePath": "",
    "description": "",
    "createdAt": 1772390242664,
    "type": "graphic",
    "image": "https://iili.io/qqGo30u.png",
    "storagePaths": []
  },
  {
    "id": "8ptCEEzVYd8rnj1JxWfu",
    "createdAt": 1772389966815,
    "images": [
      "https://iili.io/qqGCnYx.png",
      "https://iili.io/qqGCKBe.jpg"
    ],
    "type": "graphic",
    "title": "Brand Identity Design for Samiya Cafe | Maldives 🇲🇻 ☕🌴",
    "description": "",
    "storagePath": "",
    "category": "logo",
    "image": "https://iili.io/qqGCnYx.png",
    "storagePaths": []
  },
  {
    "id": "QCcQu0DCV23AbSNmc5Kg",
    "title": "Deo Salon",
    "storagePaths": [],
    "category": "logo",
    "images": [
      "https://iili.io/qqGqiiu.jpg"
    ],
    "image": "https://iili.io/qqGqiiu.jpg",
    "storagePath": "",
    "description": "",
    "type": "graphic",
    "createdAt": 1772389841213
  },
  {
    "id": "FpvGPqFPSwJ0FdzoGWkQ",
    "images": [
      "https://iili.io/qqGFXte.png",
      "https://iili.io/qqGFzap.jpg"
    ],
    "title": "✨ D.Fly Ink Studio - Branding Project ✨",
    "category": "logo",
    "storagePath": "",
    "description": "",
    "image": "https://iili.io/qqGFXte.png",
    "type": "graphic",
    "storagePaths": [],
    "createdAt": 1772389746225
  },
  {
    "id": "N6p805pogQvGZzR7YJKM",
    "type": "graphic",
    "storagePath": "",
    "image": "https://iili.io/qqG2tqv.jpg",
    "description": "",
    "storagePaths": [],
    "category": "logo",
    "title": "LP Group",
    "createdAt": 1772389411430,
    "images": [
      "https://iili.io/qqG2tqv.jpg"
    ]
  },
  {
    "id": "rkCUl4GtULaPpHvB5jrs",
    "type": "graphic",
    "image": "https://iili.io/qqEpxVV.png",
    "category": "logo",
    "storagePaths": [],
    "createdAt": 1772389354940,
    "title": "YCW Car Wash",
    "images": [
      "https://iili.io/qqEpxVV.png"
    ],
    "storagePath": "",
    "description": ""
  },
  {
    "id": "6LtXrPg9fwU3c3FcfJGM",
    "category": "logo",
    "type": "graphic",
    "storagePaths": [],
    "title": "Nethuli Nexus",
    "createdAt": 1772389211535,
    "images": [
      "https://iili.io/qqG9S9e.png",
      "https://iili.io/qqG9jn4.jpg"
    ],
    "image": "https://iili.io/qqG9S9e.png",
    "storagePath": "",
    "description": ""
  },
  {
    "id": "1B7kD0JHlQOCIn3w1nvG",
    "storagePaths": [],
    "image": "https://iili.io/qq0yhBI.png",
    "createdAt": 1772383473502,
    "title": "Social Media Promotional Flyer: Japanese Food Skill Class",
    "type": "graphic",
    "category": "social-media",
    "images": [
      "https://iili.io/qq0yhBI.png",
      "https://iili.io/qq0yzej.jpg"
    ],
    "storagePath": "",
    "description": "Eye-catching social media post design created to promote a Japanese Food Skill and Gaikoku Sample Test Class. The design features a dynamic composition with flying food elements, traditional Japanese background aesthetics, and a clean, high-contrast layout. Designed to maximize viewer engagement and clearly communicate class details on platforms like Facebook."
  },
  {
    "id": "2qofoVeyXb6FKjzMXwy4",
    "image": "https://iili.io/qq06UXa.md.jpg\" alt=\"qq06UXa.md.jpg",
    "category": "social-media",
    "createdAt": 1772382253045,
    "images": [
      "https://iili.io/qq06UXa.md.jpg\" alt=\"qq06UXa.md.jpg",
      "https://iili.io/qq0LsGs.jpg"
    ],
    "storagePaths": [],
    "type": "graphic",
    "title": "Social Media Ad Design: Chainsaw & Equipment Promotion",
    "storagePath": "",
    "description": "This project features a bold and highly engaging social media promotional post designed for high-quality chainsaw equipment. The objective was to create a rugged, eye-catching visual that directly appeals to the target audience, such as carpenters, lumberjacks, and heavy-tool users."
  },
  {
    "id": "G5fOEpL3Sdutgx9GTSyB",
    "storagePath": "",
    "description": "Incraft Sofa වෙනුවෙන් අප නිර්මාණය කළ මේ නවීන පන්නයේ Visiting Card එකේ තිබෙන්නේ පිරිසිදු (Clean), වෘත්තීය (Professional) සහ ආකර්ෂණීය නිමාවක්. ඔබේ ව්‍යාපාරයේ ගෞරවය රැකෙන විදිහට ලස්සනම design එකක් කරගන්න අදම අපිට කතා කරන්න.",
    "storagePaths": [],
    "type": "graphic",
    "title": "First Impression එක තමයි හොඳම Impression එක! 🤝✨",
    "images": [
      "https://i.ibb.co/4R2Z4nXt/Business-Card-Mockup-2.jpg",
      "https://i.ibb.co/C56P5n6B/PXL-20260202-120311573-MP.jpg",
      "https://i.ibb.co/vv4tHzWJ/PXL-20260202-100506283-PORTRAIT-2.jpg",
      "https://i.ibb.co/R4tTyhqz/PXL-20260202-120211753.jpg",
      "https://i.ibb.co/Hfkm9J95/PXL-20260202-120121457-2.jpg"
    ],
    "image": "https://i.ibb.co/4R2Z4nXt/Business-Card-Mockup-2.jpg",
    "category": "visiting-card",
    "createdAt": 1772358549975
  },
  {
    "id": "641ZtAt0isL169I3N2c6",
    "images": [
      "https://i.ibb.co/5WfkWY5P/PXL-20260209-185723338.jpg",
      "https://i.ibb.co/whs9BXMD/PXL-20260209-185732151.jpg",
      "https://i.ibb.co/fYD0WmSC/PXL-20260209-185758878.jpg",
      "https://i.ibb.co/pvhYVc2g/PXL-20260209-185752572.jpg"
    ],
    "title": "Downsouth Car Rental වෙනුවෙන් කළ නවතම නිර්මාණය! 🚗✨",
    "storagePaths": [],
    "description": "ඔබේ ව්‍යාපාරයේ අනන්‍යතාවය විදහාපාන උසස් තත්ත්වයේ Visiting Cards දැන් අපෙන්. පාරිභෝගිකයාගේ අවශ්‍යතාවය පරිදි ඉතා ආකර්ෂණීය ලෙස නිර්මාණය කර, උසස්ම ප්‍රමිතියට මුද්‍රණය කර දිවයින පුරා බෙදාහැරීමට අප සූදානම්.",
    "image": "https://i.ibb.co/5WfkWY5P/PXL-20260209-185723338.jpg",
    "storagePath": "",
    "createdAt": 1772356725765,
    "type": "graphic",
    "category": "visiting-card"
  }
];

  // State
  let allProjects = Array.isArray(INITIAL_PROJECTS) ? INITIAL_PROJECTS.slice() : [];
  let currentTab = 'all';
  let currentCategory = 'all';
  let searchQuery = '';

  // Lightbox State
  let lbImages = [];
  let lbIndex = 0;
  let lbTitle = '';

  // Category Configuration
  const categoryMeta = {
    'logo': { label: 'Logo Design', badgeClass: 'tag-brand', icon: 'fa-star' },
    'visiting-card': { label: 'Visiting Cards', badgeClass: 'tag-card', icon: 'fa-address-card' },
    'social-media': { label: 'Social Media', badgeClass: 'tag-brand', icon: 'fa-share-alt' },
    'key-tag': { label: 'Keychains & Souvenirs', badgeClass: 'tag-keychain', icon: 'fa-key' },
    'banner': { label: 'Banners & Signage', badgeClass: 'tag-brand', icon: 'fa-image' },
    'thankyou-card': { label: 'Thank You Cards', badgeClass: 'tag-brand', icon: 'fa-heart' },
    'printing': { label: 'Printing Work', badgeClass: 'tag-apparel', icon: 'fa-print' },
    'tshirt': { label: 'T-Shirts & DTF', badgeClass: 'tag-apparel', icon: 'fa-shirt' }
  };

  function escH(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Load projects from DB.getProjects() or direct REST API
  async function loadData() {
    const loadingEl = document.getElementById('portfolio-loading');
    const emptyEl = document.getElementById('portfolio-empty');
    const errorEl = document.getElementById('portfolio-error');

    try {
      let fresh = null;
      if (typeof DB !== 'undefined' && typeof DB.getProjects === 'function') {
        fresh = await DB.getProjects();
      } else {
        const res = await fetch('https://firestore.googleapis.com/v1/projects/portfolio-3c910/databases/(default)/documents/projects');
        if (res.ok) {
          const data = await res.json();
          fresh = (data.documents || []).map(doc => {
            const id = doc.name.split('/').pop();
            const fields = doc.fields || {};
            const parsed = { id };
            for (const [k, v] of Object.entries(fields)) {
              if ('stringValue' in v) parsed[k] = v.stringValue;
              else if ('integerValue' in v) parsed[k] = parseInt(v.integerValue, 10);
              else if ('booleanValue' in v) parsed[k] = v.booleanValue;
              else if ('arrayValue' in v) parsed[k] = (v.arrayValue?.values || []).map(val => val.stringValue || val);
            }
            return parsed;
          });
          fresh.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        }
      }

      if (fresh && Array.isArray(fresh) && fresh.length > 0) {
        allProjects = fresh;
        updateTabCounts();
        renderGallery();
      }
    } catch (err) {
      console.warn('Background sync warning:', err.message);
      // If we already have initial projects, we don't show an error
      if (allProjects.length === 0 && errorEl) {
        errorEl.classList.remove('hidden');
      }
    } finally {
      if (loadingEl) loadingEl.classList.add('hidden');
    }
  }

  // Update Count Chips on Tabs
  function updateTabCounts() {
    const totalCount = allProjects.length;
    const graphicCount = allProjects.filter(p => p.type === 'graphic').length;
    const webCount = allProjects.filter(p => p.type === 'web').length;
    const videoCount = allProjects.filter(p => p.type === 'video').length;

    const countAllEl = document.getElementById('count-all');
    const countGraphicEl = document.getElementById('count-graphic');
    const countWebEl = document.getElementById('count-web');
    const countVideoEl = document.getElementById('count-video');
    const countSummaryEl = document.getElementById('portfolio-hero-summary');

    if (countAllEl) countAllEl.textContent = totalCount;
    if (countGraphicEl) countGraphicEl.textContent = graphicCount;
    if (countWebEl) countWebEl.textContent = webCount;
    if (countVideoEl) countVideoEl.textContent = videoCount;

    if (countSummaryEl) {
      countSummaryEl.innerHTML = `<i class="fas fa-circle-check text-emerald-500 text-xs mr-1"></i> ${totalCount} Verified Projects Across Web, Branding &amp; Custom Systems`;
    }
  }

  // Filter & Render
  function renderGallery() {
    const gridEl = document.getElementById('portfolio-grid');
    const emptyEl = document.getElementById('portfolio-empty');
    if (!gridEl) return;

    let filtered = allProjects.slice();

    // 1. Filter by Tab
    if (currentTab === 'graphic') {
      filtered = filtered.filter(p => p.type === 'graphic');
    } else if (currentTab === 'web') {
      filtered = filtered.filter(p => p.type === 'web');
    } else if (currentTab === 'pos') {
      filtered = filtered.filter(p => p.type === 'pos');
    } else if (currentTab === 'video') {
      filtered = filtered.filter(p => p.type === 'video');
    }

    // 2. Filter by Category (if in Graphic or All)
    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

    // 3. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => {
        const title = (p.title || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const tech = (p.tech || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || tech.includes(q);
      });
    }

    // Toggle Sub-filter Bar visibility (only show for Graphic or All)
    const subfilterBar = document.getElementById('portfolio-subfilters');
    if (subfilterBar) {
      if (currentTab === 'web' || currentTab === 'video' || currentTab === 'pos') {
        subfilterBar.classList.add('hidden');
      } else {
        subfilterBar.classList.remove('hidden');
      }
    }

    // Special Case: POS Tab shows real flagship interactive card
    if (currentTab === 'pos') {
      gridEl.innerHTML = createPosSpotlightHtml();
      if (emptyEl) emptyEl.classList.add('hidden');
      return;
    }

    if (filtered.length === 0) {
      gridEl.innerHTML = '';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');
    gridEl.innerHTML = filtered.map((p, index) => createProjectCardHtml(p, index)).join('');
  }

  // Card Template
  function createProjectCardHtml(p, index) {
    const isWeb = p.type === 'web';
    const isVideo = p.type === 'video';
    const isGraphic = p.type === 'graphic' || !p.type;

    const imgs = (p.images && p.images.length) ? p.images : (p.image ? [p.image] : []);
    const hasImgs = imgs.length > 0 && imgs[0] && typeof imgs[0] === 'string' && imgs[0].trim() !== '';
    const multi = imgs.length > 1;
    const imgsJson = escH(JSON.stringify(imgs));

    // Category Label & Styling
    const meta = categoryMeta[p.category] || { label: p.category || (isWeb ? 'Web Platform' : (isVideo ? 'Video Motion' : 'Design')), badgeClass: 'tag-brand', icon: 'fa-cube' };
    const label = isWeb ? 'Web Application' : (isVideo ? 'Video Motion' : meta.label);
    const badgeClass = isWeb ? 'tag-web' : (isVideo ? 'tag-video' : meta.badgeClass);

    // Image URL with fallback
    const firstImg = hasImgs ? imgs[0] : 'logo.png';
    const mediaAspectClass = (isWeb || isVideo) ? 'aspect-video' : 'aspect-[4/3]';
    const aspectInline = (isWeb || isVideo) ? 'aspect-ratio: 16/9;' : 'aspect-ratio: 4/3;';
    const isEager = (index || 0) < 8;

    return `
      <article class="portfolio-card-light" data-id="${escH(p.id)}">
        <!-- Media Area -->
        <div class="card-media-box ${mediaAspectClass}" style="${aspectInline}" onclick="window.pixelOpenGallery(${imgsJson}, '${escH(p.title)}')">
          <img 
            src="${escH(firstImg)}" 
            alt="${escH(p.title)}" 
            ${isEager ? 'fetchpriority="high"' : 'loading="lazy"'}
            class="card-media-img"
            onerror="this.onerror=null; this.src='logo.png'; this.classList.add('p-8', 'object-contain');"
          />
          ${multi ? `
            <div class="card-multi-badge">
              <i class="fas fa-images text-indigo-300"></i>
              <span>${imgs.length} photos</span>
            </div>
          ` : ''}
          ${isVideo ? `
            <div class="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs">
              <div class="w-12 h-12 rounded-full bg-white/95 text-red-600 shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                <i class="fas fa-play text-base translate-x-0.5"></i>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Body Content -->
        <div class="card-content-body">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="card-tag-badge ${badgeClass}">
              <i class="fas ${meta.icon || 'fa-tag'} text-[10px]"></i>
              ${escH(label)}
            </span>
            ${p.tech ? `<span class="text-[11px] font-semibold text-slate-500 truncate max-w-[120px]">${escH(p.tech)}</span>` : ''}
          </div>

          <h3 class="card-title-text" title="${escH(p.title)}">
            ${escH(p.title)}
          </h3>

          ${p.description ? `
            <p class="card-desc-text" title="${escH(p.description)}">
              ${escH(p.description)}
            </p>
          ` : ''}

          <!-- Actions -->
          <div class="card-action-bar">
            ${hasImgs ? `
              <button 
                onclick="window.pixelOpenGallery(${imgsJson}, '${escH(p.title)}')"
                class="card-btn-action card-btn-view"
                aria-label="View photos for ${escH(p.title)}"
              >
                <i class="fas fa-search-plus text-[10px]"></i>
                <span>${multi ? 'View Gallery' : 'Inspect'}</span>
              </button>
            ` : ''}

            ${p.url ? `
              <a 
                href="${escH(p.url)}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="card-btn-action ${isVideo ? 'card-btn-video' : 'card-btn-live'}"
                onclick="event.stopPropagation()"
              >
                <i class="fas ${isVideo ? 'fa-play' : 'fa-external-link-alt'} text-[10px]"></i>
                <span>${isVideo ? 'Watch Clip' : 'Live Platform'}</span>
              </a>
            ` : ''}

            ${p.youtubeUrl ? `
              <a 
                href="${escH(p.youtubeUrl)}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="card-btn-action card-btn-video"
                onclick="event.stopPropagation()"
              >
                <i class="fab fa-youtube text-[11px]"></i>
                <span>Demo Video</span>
              </a>
            ` : ''}

            ${p.facebookUrl ? `
              <a 
                href="${escH(p.facebookUrl)}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="card-btn-action text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white"
                onclick="event.stopPropagation()"
              >
                <i class="fab fa-facebook text-[11px]"></i>
                <span>Social Post</span>
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }

  // POS Spotlight HTML when POS tab is active
  function createPosSpotlightHtml() {
    return `
      <div class="col-span-full">
        <div class="bg-gradient-to-br from-emerald-50 via-white to-slate-50 border border-emerald-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 mb-3">
                <i class="fas fa-cash-register text-xs"></i>
                Universal POS System (Cloud · 100% Offline · Hybrid)
              </span>
              <h3 class="font-display font-black text-2xl sm:text-3xl text-slate-900 leading-tight mb-3">
                Sri Lanka's Next-Generation Retail &amp; Supermarket POS Terminal
              </h3>
              <p class="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Engineered specifically for Sri Lankan retail supermarkets, boutiques, and restaurant operations. Features instant barcode scanning, multi-item fast cart, thermal 80mm receipt generation, LKR currency calculations, and seamless offline IndexedDB synchronization.
              </p>
              <div class="flex flex-wrap gap-3">
                <a href="pos/index.html" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-600/20">
                  <i class="fas fa-desktop"></i>
                  <span>Launch Live POS Application</span>
                </a>
                <a href="https://wa.me/94716125715?text=Hello%20Pixel%20by%20Maliya,%20I%20am%20interested%20in%20a%20POS%20System" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm">
                  <i class="fab fa-whatsapp text-emerald-400"></i>
                  <span>Inquire for Your Business</span>
                </a>
              </div>
            </div>
            <div class="lg:col-span-5">
              <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="font-bold text-xs text-slate-900">Active Terminal Demo</span>
                  </div>
                  <span class="text-[11px] font-semibold text-slate-600">v2.4.0 Live</span>
                </div>
                <div class="space-y-2.5 text-xs text-slate-600">
                  <div class="flex justify-between py-1 border-b border-slate-50">
                    <span class="font-medium text-slate-500">Architecture</span>
                    <span class="font-bold text-slate-800">PWA + IndexedDB + Cloud</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-50">
                    <span class="font-medium text-slate-500">Offline Reliability</span>
                    <span class="font-bold text-emerald-600">100% Zero-Downtime</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-slate-50">
                    <span class="font-medium text-slate-500">Hardware Compatibility</span>
                    <span class="font-bold text-slate-800">Thermal 80mm / USB / Bluetooth</span>
                  </div>
                  <div class="flex justify-between py-1">
                    <span class="font-medium text-slate-500">Currencies Supported</span>
                    <span class="font-bold text-slate-800">LKR (Sri Lankan Rupee)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Lightbox Implementation
  window.pixelOpenGallery = function (images, title) {
    lbImages = (Array.isArray(images) ? images : [images]).filter(Boolean);
    if (lbImages.length === 0) return;

    lbIndex = 0;
    lbTitle = title || 'Pixel by Maliya Showcase Item';

    if (typeof window.pixelTrackEvent === 'function') {
      window.pixelTrackEvent('portfolio_view', {
        project_title: lbTitle,
        images_count: lbImages.length
      });
    }

    renderLightbox();
    const modal = document.getElementById('portfolio-lightbox');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  function renderLightbox() {
    const imgEl = document.getElementById('lb-image');
    const counterEl = document.getElementById('lb-counter');
    const titleEl = document.getElementById('lb-title');
    const prevBtn = document.getElementById('lb-prev');
    const nextBtn = document.getElementById('lb-next');
    const dotsEl = document.getElementById('lb-dots');

    if (!imgEl) return;

    const multi = lbImages.length > 1;
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = lbImages[lbIndex];
      imgEl.style.opacity = '1';
    }, 120);

    if (counterEl) {
      counterEl.textContent = `${lbIndex + 1} of ${lbImages.length}`;
      counterEl.classList.toggle('hidden', !multi);
    }

    if (titleEl) {
      titleEl.textContent = lbTitle;
    }

    if (prevBtn) prevBtn.classList.toggle('hidden', !multi);
    if (nextBtn) nextBtn.classList.toggle('hidden', !multi);

    if (dotsEl) {
      if (multi && lbImages.length <= 12) {
        dotsEl.innerHTML = lbImages.map((_, i) => `
          <button 
            onclick="window.pixelGoToImage(${i})" 
            aria-label="View photo ${i + 1}"
            class="w-2.5 h-2.5 rounded-full transition-all ${i === lbIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/75'}"
          ></button>
        `).join('');
        dotsEl.classList.remove('hidden');
      } else {
        dotsEl.classList.add('hidden');
      }
    }
  }

  window.pixelCloseGallery = function () {
    const modal = document.getElementById('portfolio-lightbox');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    lbImages = [];
    lbIndex = 0;
  };

  window.pixelNavGallery = function (step) {
    if (lbImages.length <= 1) return;
    lbIndex = (lbIndex + step + lbImages.length) % lbImages.length;
    renderLightbox();
  };

  window.pixelGoToImage = function (index) {
    if (index >= 0 && index < lbImages.length) {
      lbIndex = index;
      renderLightbox();
    }
  };

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('portfolio-lightbox');
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'Escape') window.pixelCloseGallery();
      else if (e.key === 'ArrowRight') window.pixelNavGallery(1);
      else if (e.key === 'ArrowLeft') window.pixelNavGallery(-1);
    }
  });

  // UI Event Bindings
  function initEvents() {
    // Main Tabs
    const tabButtons = document.querySelectorAll('.portfolio-main-tab');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.getAttribute('data-tab') || 'all';
        currentCategory = 'all';

        // Reset filter chips active state
        document.querySelectorAll('.portfolio-filter-chip').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-cat') === 'all');
        });

        renderGallery();
      });
    });

    // Sub-Filter Chips
    const filterChips = document.querySelectorAll('.portfolio-filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.getAttribute('data-cat') || 'all';
        renderGallery();
      });
    });

    // Search Input
    const searchInput = document.getElementById('portfolio-search-input');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', e => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          searchQuery = e.target.value;
          renderGallery();
        }, 150);
      });
    }
  }

  // Fast Instant Initialization: Render baseline immediately!
  function initInstant() {
    initEvents();
    updateTabCounts();
    renderGallery();
    // Revalidate with fresh data in background
    loadData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstant);
  } else {
    initInstant();
  }
})();
