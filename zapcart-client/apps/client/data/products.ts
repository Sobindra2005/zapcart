import { Product } from "@/types/product";

// export const sampleProducts: Product[] = [
//     {
//         id: "1",
//         name: "Loose Fit Hoodie",
//         description: "Organic Cotton, fairtrade certified",
//         detailedDescription: "Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside.",
//         basePrice: 24.99,
//         image: "/products/hoodie-1.jpg",
//         images: [
//             "/products/hoodie-1.jpg",
//             "/products/hoodie-2.jpg",
//             "/products/hoodie-3.jpg",
//             "/products/hoodie-4.jpg"
//         ],
//         averageRating: 4.5,
//         reviewCount: 60,
//         category: "Men Fashion",
//         sizes: ["S", "M", "L", "XL", "XXL"],
//         shippingInfo: {
//             discount: "Dec 50%",
//             packageType: "Regular Postage",
//             deliveryTime: "3-4 Working Days",
//             estimatedDelivery: "10 - 12 October 2024"
//         },
//         reviews: [
//             {
//                 id: "r1",
//                 userId: "u1",
//                 userName: "Alex Mathio",
//                 rating: 5,
//                 title: "Excellent quality and ethical processes",
//                 comment: "Sustainability and ethical processes resonate strongly with today's consumers, positioning the brand as a responsible choice in the fashion world.",
//                 date: "13 Oct 2024"
//             },
//             {
//                 id: "r2",
//                 userId: "u2",
//                 userName: "Sarah Johnson",
//                 rating: 4,
//                 title: "Great fit and comfortable",
//                 comment: "The hoodie fits perfectly and is very comfortable. Slightly overbasePriced but good quality overall. Would recommend to friends.",
//                 date: "12 Oct 2024"
//             },
//             {
//                 id: "r3",
//                 userId: "u3",
//                 userName: "Mike Chen",
//                 rating: 5,
//                 title: "Love the loose fit",
//                 comment: "Love the loose fit and the material is so soft. Highly recommend!",
//                 date: "08 Oct 2024"
//             }
//         ]
//     },
//     {
//         id: "2",
//         name: "AirPods Max",
//         description: "A perfect balance of high-fidelity audio",
//         detailedDescription: "AirPods Max combine high-fidelity audio with industry-leading Active Noise Cancellation to deliver an unparalleled listening experience. Each part of their custom-built driver works to produce sound with ultra-low distortion across the audible range.",
//         basePrice: 559.00,
//         image: "/products/airpods-max.jpg",
//         images: [
//             "/products/airpods-max.jpg",
//             "/products/airpods-max-2.jpg",
//             "/products/airpods-max-3.jpg",
//             "/products/airpods-max-4.jpg"
//         ],
//         averageRating: 4.8,
//         reviewCount: 245,
//         category: "Over-Ear Headphones",
//         shippingInfo: {
//             discount: "Free Shipping",
//             packageType: "Express Delivery",
//             deliveryTime: "1-2 Working Days",
//             estimatedDelivery: "08 - 09 October 2024"
//         },
//         reviews: [
//             {
//                 id: "r4",
//                 userId: "u4",
//                 userName: "Emily Davis",
//                 rating: 5,
//                 comment: "Best headphones I've ever owned. The sound quality is incredible!",
//                 date: "05 Oct 2024"
//             },
//             {
//                 id: "r5",
//                 userId: "u5",
//                 userName: "James Wilson",
//                 rating: 4,
//                 comment: "Great sound and noise cancellation, but a bit basePricey.",
//                 date: "03 Oct 2024"
//             }
//         ]
//     },
//     {
//         id: "3",
//         name: "Bose BT Earphones",
//         description: "Premium wireless earphones with superior sound",
//         detailedDescription: "Experience premium sound quality with Bose Bluetooth Earphones. Featuring advanced noise cancellation technology and comfortable fit for all-day wear.",
//         basePrice: 289.00,
//         image: "/products/bose-bt.jpg",
//         images: [
//             "/products/bose-bt.jpg",
//             "/products/bose-bt-2.jpg",
//             "/products/bose-bt-3.jpg",
//             "/products/bose-bt-4.jpg"
//         ],
//         averageRating: 4.3,
//         reviewCount: 128,
//         category: "Wireless Earphones",
//         shippingInfo: {
//             discount: "Dec 30%",
//             packageType: "Regular Postage",
//             deliveryTime: "2-3 Working Days",
//             estimatedDelivery: "09 - 11 October 2024"
//         },
//         reviews: [
//             {
//                 id: "r6",
//                 userId: "u6",
//                 userName: "Lisa Anderson",
//                 rating: 4,
//                 comment: "Good sound quality and comfortable to wear for long periods.",
//                 date: "01 Oct 2024"
//             }
//         ]
//     },
//     {
//         id: "4",
//         name: "VIVEFOX Headphones",
//         description: "Wired Stereo Headsets With Mic",
//         detailedDescription: "Professional wired headphones with crystal clear audio and built-in microphone. Perfect for gaming, music, and calls.",
//         basePrice: 39.00,
//         image: "/products/vivefox.jpg",
//         images: [
//             "/products/vivefox.jpg",
//             "/products/vivefox-2.jpg",
//             "/products/vivefox-3.jpg",
//             "/products/vivefox-4.jpg"
//         ],
//         averageRating: 4.1,
//         reviewCount: 89,
//         category: "Wired Headphones",
//         shippingInfo: {
//             discount: "Dec 20%",
//             packageType: "Regular Postage",
//             deliveryTime: "3-5 Working Days",
//             estimatedDelivery: "10 - 14 October 2024"
//         },
//         reviews: [
//             {
//                 id: "r7",
//                 userId: "u7",
//                 userName: "Tom Brown",
//                 rating: 4,
//                 comment: "Great value for money. Sound quality is decent for the basePrice.",
//                 date: "28 Sep 2024"
//             }
//         ]
//     }
// ];

// export const flashSaleProducts: Product[] = [
//     {
//         id: "fs-1",
//         name: "Premium Wireless Earbuds",
//         description: "Active noise cancellation and transparency mode.",
//         detailedDescription: "Experience immersive sound with our premium wireless earbuds...",
//         basePrice: 129.99,
//         image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
//         averageRating: 4.8,
//         reviewCount: 342,
//         category: "Electronics",
//         shippingInfo: {
//             discount: "50% OFF",
//             packageType: "Box",
//             deliveryTime: "Quick delivery",
//             estimatedDelivery: "Tomorrow"
//         }
//     },
//     {
//         id: "fs-2",
//         name: "Smart Watch Series X",
//         description: "Advanced health tracking and always-on display.",
//         basePrice: 299.99,
//         image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
//         averageRating: 4.9,
//         reviewCount: 156,
//         category: "Electronics",
//         shippingInfo: {
//             discount: "20% OFF",
//             packageType: "Box",
//             deliveryTime: "1 week",
//             estimatedDelivery: "Next Monday"
//         }

//     },
//     {
//         id: "fs-3",
//         name: "Ultraboost Running Shoes",
//         description: "Responsive cushioning for an energized run.",
//         basePrice: 89.99,
//         image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
//         averageRating: 4.7,
//         reviewCount: 89,
//         category: "Footwear",
//     },
//     {
//         id: "fs-4",
//         name: "Designer Sunglasses",
//         description: "UV protection with a classic style.",
//         basePrice: 159.50,
//         image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
//         averageRating: 4.6,
//         reviewCount: 120,
//         category: "Accessories",
//     },
//     {
//         id: "fs-5",
//         name: "Gaming Console",
//         description: "Next-gen gaming performance.",
//         basePrice: 499.99,
//         image: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80",
//         averageRating: 4.9,
//         reviewCount: 1200,
//         category: "Electronics",
//     },
//     {
//         id: "fs-6",
//         name: "4K Action Camera",
//         description: "Capture your adventures in stunning detail.",
//         basePrice: 249.99,
//         image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
//         averageRating: 4.5,
//         reviewCount: 67,
//         category: "Electronics",
//     }
// ];

export const sampleProducts: Product[] = [
            {
                "dimensions": {
                    "length": 62.7,
                    "width": 94.6,
                    "height": 39.1,
                    "unit": "inch"
                },
                "_id": "695a107ee8db2f55a021abf4",
                "name": "Tasty Aluminum Bike",
                "slug": "tasty-aluminum-bike-ihwh68",
                "description": "The Streamlined transitional neural-net Shoes offers reliable performance and dearest design",
                "shortDescription": "Casus tredecim assumenda considero calamitas argumentum absconditus timidus iusto tutamen.",
                "basePrice": 140.79,
                "compareAtPrice": 534.59,
                "category": {
                    "_id": "695a1075e8db2f55a021ab25",
                    "name": "Tools xJtd",
                    "slug": "tools-xjtd",
                    "description": "Versus ciminatio copiose cunabula amplitudo argentum. Stabilis aeternus tener tricesimus undique vix acerbitas. Aurum crebro balbus cilicium aufero velut.",
                    "parent": null,
                    "ancestors": [],
                    "level": 0,
                    "image": "https://picsum.photos/seed/XpgZvZUiIl/category/400/300",
                    "icon": "🏠",
                    "color": "#ad67df",
                    "metaTitle": "Vis thesis casus stabilis aestivus quidem.",
                    "metaDescription": "Cibo consuasor autem magnam solus audax copia defaeco cauda.",
                    "metaKeywords": [
                        "summisse",
                        "video",
                        "clibanus",
                        "accedo",
                        "crudelis"
                    ],
                    "isActive": true,
                    "displayOrder": 9,
                    "productCount": 0,
                    "createdAt": "2026-01-04T07:02:13.130Z",
                    "updatedAt": "2026-01-04T07:02:13.130Z",
                    "__v": 0,
                    "isRoot": true,
                    "id": "695a1075e8db2f55a021ab25"
                },
                "subcategories": [],
                "brand": "Yost Group",
                "tags": [
                    "adiuvo",
                    "depopulo",
                    "cupressus"
                ],
                "hasVariants": false,
                "variants": [],
                "totalStock": 313,
                "lowStockThreshold": 19,
                "trackInventory": true,
                "allowBackorder": false,
                "images": [
                    "https://picsum.photos/seed/G7GfZqCiNi/800/800",
                    "https://picsum.photos/seed/alJZgBmQ0N/800/800",
                    "https://picsum.photos/seed/wz46QC9MCd/800/800",
                    "https://picsum.photos/seed/Bley3hP11v/800/800",
                    "https://picsum.photos/seed/7cEc462WF6/800/800",
                    "https://picsum.photos/seed/3zMdWYnAXL/800/800"
                ],
                "thumbnail": "https://picsum.photos/seed/juG9MnL77v/400/400",
                "metaTitle": "Chirographum pariatur adficio usque depromo defungo.",
                "metaDescription": "Decretum adhaero cerno tametsi expedita timidus.",
                "metaKeywords": [
                    "somnus",
                    "desidero",
                    "bellum",
                    "tempus",
                    "acerbitas"
                ],
                "specifications": {
                    "Material": "Bamboo",
                    "Weight": "6.25 kg",
                    "Dimensions": "99x86 cm"
                },
                "features": [
                    "Paens cultellus victoria advoco bonus aedificium solium.",
                    "Asperiores aeneus sopor caelestis depereo studio dolore maxime talus.",
                    "Corroboro tepidus tabella provident turbo creber venio.",
                    "Clam sub crur sequi temperantia.",
                    "Cohaero sub tempore combibo adnuo eos asper."
                ],
                "weight": 1.18,
                "status": "active",
                "visibility": "featured",
                "publishedAt": "2025-03-06T10:11:54.807Z",
                "viewCount": 324,
                "salesCount": 930,
                "averageRating": 4.9,
                "reviewCount": 440,
                "createdAt": "2026-01-04T07:02:22.071Z",
                "updatedAt": "2026-01-04T07:02:22.071Z",
                "inStock": true,
                "isLowStock": false,
                "discountPercentage": 74,
                "id": "695a107ee8db2f55a021abf4"
            },
            {
                "dimensions": {
                    "length": 93.7,
                    "width": 80.4,
                    "height": 41.5,
                    "unit": "inch"
                },
                "_id": "695a1080e8db2f55a021ac4c",
                "name": "Fresh Bronze Chicken",
                "slug": "fresh-bronze-chicken-t6lfv1",
                "description": "Innovative Table featuring empty technology and Plastic construction",
                "shortDescription": "Libero cerno caveo arca pecto cogito decipio soleo advoco aurum.",
                "basePrice": 394.45,
                "category": {
                    "_id": "695a107ce8db2f55a021abd7",
                    "name": "Oriental Table X7in",
                    "slug": "oriental-table-x7in",
                    "description": "Stultus apparatus sursum. Tener possimus suasoria tantum adopto vinculum conservo cernuus. Vilicus corporis admitto rerum aestus bos vinco.",
                    "parent": "695a1074e8db2f55a021ab1c",
                    "ancestors": [
                        "695a1074e8db2f55a021ab1c"
                    ],
                    "level": 1,
                    "image": "https://picsum.photos/seed/MBdGOyeHQI/category/400/300",
                    "icon": "🎧",
                    "color": "#4e4eda",
                    "metaTitle": "Quae viridis compello vix socius sophismata.",
                    "metaDescription": "Cumque voluptates dicta studio ver dolores adulatio dens.",
                    "metaKeywords": [
                        "celer",
                        "summa",
                        "comparo",
                        "veniam",
                        "dedecor"
                    ],
                    "isActive": true,
                    "displayOrder": 35,
                    "productCount": 0,
                    "createdAt": "2026-01-04T07:02:20.841Z",
                    "updatedAt": "2026-01-04T07:02:20.841Z",
                    "__v": 0,
                    "isRoot": false,
                    "id": "695a107ce8db2f55a021abd7"
                },
                "subcategories": [],
                "brand": "Oberbrunner - Kuhn",
                "tags": [
                    "cauda",
                    "tabula"
                ],
                "hasVariants": false,
                "variants": [],
                "totalStock": 155,
                "lowStockThreshold": 12,
                "trackInventory": true,
                "allowBackorder": false,
                "images": [
                    "https://picsum.photos/seed/shTpSP46ft/800/800",
                    "https://picsum.photos/seed/q59n6iOszt/800/800",
                    "https://picsum.photos/seed/Thp1c9i1uA/800/800"
                ],
                "thumbnail": "https://picsum.photos/seed/bQtio8rDoq/400/400",
                "metaTitle": "Ubi complectus comes infit dignissimos defluo.",
                "metaDescription": "Vitae concedo certe synagoga civis adipisci somnus sint supellex uberrime.",
                "metaKeywords": [
                    "fugit",
                    "causa",
                    "terminatio",
                    "cognatus",
                    "videlicet"
                ],
                "specifications": {
                    "Material": "Silk",
                    "Weight": "8.06 kg",
                    "Dimensions": "74x40 cm"
                },
                "features": [
                    "Traho tardus voluptates velum.",
                    "Possimus sonitus decerno.",
                    "Eum tamquam recusandae coma thema brevis cicuta.",
                    "Tam vesper decor suppono subiungo."
                ],
                "weight": 4.08,
                "status": "active",
                "visibility": "featured",
                "publishedAt": "2025-09-05T18:41:57.221Z",
                "viewCount": 5232,
                "salesCount": 575,
                "averageRating": 1.9,
                "reviewCount": 318,
                "createdAt": "2026-01-04T07:02:24.709Z",
                "updatedAt": "2026-01-04T07:02:24.709Z",
                "inStock": true,
                "isLowStock": false,
                "discountPercentage": 0,
                "id": "695a1080e8db2f55a021ac4c"
            },
            {
                "dimensions": {
                    "length": 72.7,
                    "width": 88.6,
                    "height": 48,
                    "unit": "cm"
                },
                "_id": "695a107fe8db2f55a021ac14",
                "name": "Modern Bamboo Car",
                "slug": "modern-bamboo-car-njry3g",
                "description": "Innovative Mouse featuring flowery technology and Granite construction",
                "shortDescription": "Curiositas subiungo harum sperno spoliatio tego alii circumvenio aliquam abundans conicio civis cernuus ocer degusto deserunt cura timidus acsi aetas.",
                "basePrice": 140.05,
                "category": {
                    "_id": "695a1078e8db2f55a021ab69",
                    "name": "Gorgeous Chips s9hW",
                    "slug": "gorgeous-chips-s9hw",
                    "description": "Cogo error perspiciatis bellum. Deripio dicta tergeo cursus. Defetiscor occaecati surculus colligo ea canis suus sodalitas tunc suffragium.",
                    "parent": "695a1074e8db2f55a021ab0d",
                    "ancestors": [
                        "695a1074e8db2f55a021ab0d"
                    ],
                    "level": 1,
                    "image": "https://picsum.photos/seed/s9IWWfvI5L/category/400/300",
                    "icon": "🎮",
                    "color": "#e6c7b5",
                    "metaTitle": "Arguo placeat concedo tendo sonitus.",
                    "metaDescription": "Nam testimonium conqueror arto exercitationem comprehendo abstergo crapula.",
                    "metaKeywords": [
                        "bestia",
                        "apparatus",
                        "brevis",
                        "ambitus",
                        "conculco"
                    ],
                    "isActive": true,
                    "displayOrder": 13,
                    "productCount": 0,
                    "createdAt": "2026-01-04T07:02:16.064Z",
                    "updatedAt": "2026-01-04T07:02:16.064Z",
                    "__v": 0,
                    "isRoot": false,
                    "id": "695a1078e8db2f55a021ab69"
                },
                "subcategories": [],
                "brand": "Runolfsson - Wiegand",
                "tags": [
                    "amplexus",
                    "vulgaris",
                    "cresco",
                    "thalassinus",
                    "compello"
                ],
                "hasVariants": true,
                "variants": [
                    {
                        "dimensions": {
                            "length": 27.9,
                            "width": 21.6,
                            "height": 79.4,
                            "unit": "inch"
                        },
                        "sku": "PROD-JL8IXN83-1767510143029-0",
                        "size": "L",
                        "color": "orchid",
                        "material": "Cotton",
                        "price": 472.45,
                        "compareAtPrice": 568.29,
                        "stock": 523,
                        "images": [
                            "https://picsum.photos/seed/HneC9jVE4F/800/600"
                        ],
                        "weight": 3.73
                    },
                    {
                        "dimensions": {
                            "length": 97.8,
                            "width": 43.1,
                            "height": 98.2,
                            "unit": "inch"
                        },
                        "sku": "PROD-IRJ6R5SF-1767510143029-1",
                        "size": "XL",
                        "color": "turquoise",
                        "material": "Aluminum",
                        "price": 324.99,
                        "compareAtPrice": 686.15,
                        "stock": 492,
                        "images": [
                            "https://picsum.photos/seed/qFeiC1Jk2I/800/600"
                        ],
                        "weight": 5.47
                    }
                ],
                "totalStock": 1015,
                "lowStockThreshold": 17,
                "trackInventory": true,
                "allowBackorder": false,
                "images": [
                    "https://picsum.photos/seed/uDp3d4VS4K/800/800",
                    "https://picsum.photos/seed/xzqxrqoeIb/800/800",
                    "https://picsum.photos/seed/pczLUGVcmc/800/800",
                    "https://picsum.photos/seed/AOgwDCNKRg/800/800",
                    "https://picsum.photos/seed/62dy05Fqj3/800/800"
                ],
                "thumbnail": "https://picsum.photos/seed/WHtIIrtrHa/400/400",
                "videoUrl": "https://www.youtube.com/watch?v=Ha1hsEf6gOC",
                "metaTitle": "Astrum dedecor aperiam defleo ulterius charisma.",
                "metaDescription": "Maxime vespillo quaerat succedo anser id tabernus trans optio civis.",
                "metaKeywords": [
                    "cunae",
                    "speciosus",
                    "culpo",
                    "bibo",
                    "sono"
                ],
                "specifications": {
                    "Material": "Marble",
                    "Weight": "2.13 kg",
                    "Dimensions": "11x92 cm"
                },
                "features": [
                    "Calamitas surculus condico thermae.",
                    "Explicabo asperiores quisquam tendo terra assentator cogo.",
                    "Odio incidunt cetera arma similique.",
                    "Credo aequitas summa libero abduco.",
                    "Audio texo provident commemoro quasi culpa cohibeo ipsum tunc tabesco.",
                    "Sequi adeptio tredecim demum urbs vesper adiuvo usque."
                ],
                "weight": 1.47,
                "status": "active",
                "visibility": "featured",
                "publishedAt": "2025-10-19T09:06:12.420Z",
                "viewCount": 3914,
                "salesCount": 380,
                "averageRating": 4.4,
                "reviewCount": 429,
                "createdAt": "2026-01-04T07:02:23.031Z",
                "updatedAt": "2026-01-04T07:02:23.031Z",
                "inStock": true,
                "isLowStock": false,
                "discountPercentage": 0,
                "id": "695a107fe8db2f55a021ac14"
            },
            
            {
                "dimensions": {
                    "length": 31.6,
                    "width": 92.2,
                    "height": 46.2,
                    "unit": "cm"
                },
                "_id": "695a107fe8db2f55a021ac1e",
                "name": "Sleek Concrete Table",
                "slug": "sleek-concrete-table-onhfhy",
                "description": "New grey Towels with ergonomic design for frightened comfort",
                "shortDescription": "Necessitatibus absconditus cohaero tametsi denique aegre curo desolo temptatio totus cervus caput blanditiis ambulo unde tonsor quasi truculenter tenetur.",
                "basePrice": 380.25,
                "category": {
                    "_id": "695a1074e8db2f55a021ab1c",
                    "name": "Industrial HBFU",
                    "slug": "industrial-hbfu",
                    "description": "Vester alii aranea ustilo. Adimpleo tabgo anser bene amitto ipsum tot vulticulus. Quia nam ciminatio pectus benevolentia eum.",
                    "parent": null,
                    "ancestors": [],
                    "level": 0,
                    "image": "https://picsum.photos/seed/vxXRhdatl0/category/400/300",
                    "icon": "🎧",
                    "color": "#211d57",
                    "metaTitle": "Adeptio capio triduana accendo sumptus cauda.",
                    "metaDescription": "Demum vulariter debitis super spiculum vere aptus eaque depopulo.",
                    "metaKeywords": [
                        "aegrus",
                        "vomica",
                        "uter",
                        "caste",
                        "tumultus"
                    ],
                    "isActive": true,
                    "displayOrder": 6,
                    "productCount": 0,
                    "createdAt": "2026-01-04T07:02:12.796Z",
                    "updatedAt": "2026-01-04T07:02:12.796Z",
                    "__v": 0,
                    "isRoot": true,
                    "id": "695a1074e8db2f55a021ab1c"
                },
                "subcategories": [
                    "695a107be8db2f55a021abb4"
                ],
                "brand": "Shields, Gutkowski and Pagac",
                "tags": [
                    "sono",
                    "vergo",
                    "comparo",
                    "sunt"
                ],
                "hasVariants": true,
                "variants": [
                    {
                        "dimensions": {
                            "length": 42.9,
                            "width": 49.8,
                            "height": 52.8,
                            "unit": "inch"
                        },
                        "sku": "PROD-UBGYS8XK-1767510143323-0",
                        "size": "XXL",
                        "color": "plum",
                        "material": "Wooden",
                        "price": 297.95,
                        "stock": 778,
                        "images": [
                            "https://picsum.photos/seed/uxjyAmunB0/800/600",
                            "https://picsum.photos/seed/tiZFdfQugI/800/600"
                        ],
                        "weight": 9.55
                    },
                    {
                        "dimensions": {
                            "length": 54.6,
                            "width": 43.6,
                            "height": 18.5,
                            "unit": "inch"
                        },
                        "sku": "PROD-WKKVCVHF-1767510143323-1",
                        "size": "L",
                        "color": "magenta",
                        "material": "Aluminum",
                        "price": 324.95,
                        "compareAtPrice": 654.45,
                        "stock": 496,
                        "images": [
                            "https://picsum.photos/seed/PuPyhReQAN/800/600",
                            "https://picsum.photos/seed/D7LcWs5e93/800/600",
                            "https://picsum.photos/seed/toBlJwL0vT/800/600"
                        ],
                        "weight": 0.29
                    }
                ],
                "totalStock": 1274,
                "lowStockThreshold": 5,
                "trackInventory": true,
                "allowBackorder": false,
                "images": [
                    "https://picsum.photos/seed/v7qRT52TTQ/800/800",
                    "https://picsum.photos/seed/HXSMaUFDQL/800/800",
                    "https://picsum.photos/seed/1MXQIcJMF8/800/800",
                    "https://picsum.photos/seed/JgoedyzIjh/800/800"
                ],
                "thumbnail": "https://picsum.photos/seed/bmNwjzisz0/400/400",
                "metaTitle": "Ustulo absum appositus perspiciatis mollitia demergo.",
                "metaDescription": "Caste consuasor aeger suppellex curto vilis demo tepesco voluptatem alo.",
                "metaKeywords": [
                    "argumentum",
                    "vox",
                    "demo",
                    "cervus",
                    "vita"
                ],
                "specifications": {
                    "Material": "Ceramic",
                    "Weight": "4.89 kg",
                    "Dimensions": "95x31 cm"
                },
                "features": [
                    "Adfero cenaculum suadeo quod.",
                    "Culpo despecto aedificium aetas.",
                    "Altus ullus certe calculus summopere vitae.",
                    "Tolero cura defleo tertius spes crudelis aegrotatio.",
                    "Antepono strenuus depopulo ea cibo vergo cunctatio suffragium.",
                    "Modi arto talis appositus doloribus tenax aetas adopto umerus.",
                    "Tametsi iusto aiunt antiquus officiis decumbo acceptus desidero."
                ],
                "weight": 4.9,
                "status": "active",
                "visibility": "featured",
                "publishedAt": "2026-01-01T02:31:09.206Z",
                "viewCount": 9185,
                "salesCount": 161,
                "averageRating": 2,
                "reviewCount": 1,
                "createdAt": "2026-01-04T07:02:23.326Z",
                "updatedAt": "2026-01-04T07:02:26.976Z",
                "inStock": true,
                "isLowStock": false,
                "discountPercentage": 0,
                "id": "695a107fe8db2f55a021ac1e"
            }
        ]