/**
 * Every photograph the site ships, and where its original comes from.
 *
 * The originals are the property's own photos on its Booking.com listing,
 * fetched at their largest size (3000 × 2000). They are not committed:
 * `npm run images` downloads them into .cache/originals/ on first use, then
 * writes public/img/<id>-<width>.webp for each width below plus
 * content/images.json, which the Picture component reads to build srcset.
 *
 * id      the name content uses for the photo (content/site.json → photos).
 *         It is also the file name, so it describes the picture.
 * src     the original. A URL is downloaded once; a path is read as is.
 * focus   [x, y] from 0 to 1 — the part of the photo that must survive when
 *         a frame crops it (hero on a phone, a portrait card, a share card).
 * hero    also cut at 2400px, for the full-width first screens.
 * og      also cut as a 1200 × 630 JPEG share card in public/og/.
 */

const BOOKING = 'https://cf.bstatic.com/xdata/images/hotel/max3000';

export const WIDTHS = [480, 800, 1200, 1600];
export const HERO_WIDTHS = [...WIDTHS, 2400];

export const PHOTOS = [
  { id: 'hydrangeas-headboard', src: `${BOOKING}/905855254.jpg?k=110558836d5d86b62a28cb909a8e57cd0da69ae0a876fb1139f134226e6c5cdc&o=`, focus: [0.4, 0.5] },
  { id: 'alcove-bedroom', src: `${BOOKING}/905856053.jpg?k=e5c8af78b15b976abfb30efe717a6b5ee322952575c80288ac2e5821f154bb76&o=`, focus: [0.35, 0.6], hero: true, og: true },
  { id: 'basin-tap', src: `${BOOKING}/905854661.jpg?k=a039a6464af0955de6252e0324235afce214fca1f1f1a669239f5d6154451298&o=`, focus: [0.5, 0.5] },
  { id: 'wine-bedside', src: `${BOOKING}/905855247.jpg?k=91ebd6b0b867b3fd891f5d2e33dad0c188e7b823be44a1cdf2524643aeaadd56&o=`, focus: [0.35, 0.55] },
  { id: 'suite-living', src: `${BOOKING}/905854973.jpg?k=60734cc71f2f308cf4744b845322f839ea8fc8540377c460744823cab3e1a5a2&o=`, focus: [0.55, 0.6], hero: true, og: true },
  { id: 'suite-sofa-bed', src: `${BOOKING}/905855259.jpg?k=79de825e8ddf5d7a35f255103bd5181576720e38c109f0136ca77bf7fa7c3f58&o=`, focus: [0.5, 0.55], hero: true, og: true },
  { id: 'bath-mixer-dark-tiles', src: `${BOOKING}/905854895.jpg?k=9628d963ef3a47d95dcd9180fbed6ab91921e65aa3fb25def6765783c77f72a8&o=`, focus: [0.45, 0.5] },
  { id: 'suite-dining-table', src: `${BOOKING}/905854978.jpg?k=af7ace41cbffeb7e1e171362e2fc0dca1a425322243b7596317de6a4a39c0dd5&o=`, focus: [0.45, 0.55], hero: true, og: true },
  { id: 'navy-wall-bedroom', src: `${BOOKING}/901141836.jpg?k=766659ae484c3e19a9cd2d477b093b707f93b2353f35052ff94b1aeb093f6911&o=`, focus: [0.45, 0.55] },
  { id: 'hydrangeas-bedside', src: `${BOOKING}/905854975.jpg?k=722723282e2b5a352d590e0370dd3cda713eae2fd7ea03b0e94d8159b84a09e2&o=`, focus: [0.35, 0.55] },
  { id: 'suite-open-plan', src: `${BOOKING}/905855235.jpg?k=286be80345ea8ac9e153afcee3dec478e17e78832500594e4cfc276cbeafdb45&o=`, focus: [0.55, 0.55], hero: true, og: true },
  { id: 'coffee-corner', src: `${BOOKING}/905855242.jpg?k=6067dc2eb545ae1bf27c57373a1ec6797f08d654e3a90cbe586f0624a4f79e9a&o=`, focus: [0.6, 0.55] },
  { id: 'hydrangeas-closeup', src: `${BOOKING}/905855255.jpg?k=811b051cd5a15de8756c4d9adfe2f62cbbcb36a3cc05aa574e9b81eda9405748&o=`, focus: [0.35, 0.5] },
  { id: 'bed-wine-closeup', src: `${BOOKING}/905856052.jpg?k=2d89251679bfa3499bdc063c31d1512238ca97994cb27d279f6d17a0a998e5d6&o=`, focus: [0.5, 0.55], hero: true, og: true },
  { id: 'bedroom-from-table', src: `${BOOKING}/905854971.jpg?k=d14f7eeb738a895ab72771a4d286283533eaa68969f571410b8cda549b122c08&o=`, focus: [0.55, 0.5] },
  { id: 'bedroom-wall-lights', src: `${BOOKING}/905856054.jpg?k=ea8bda016c898fff7c09fb429dcc85ea17b41c223efea7bd79777ddd47c229ac&o=`, focus: [0.5, 0.55], hero: true, og: true },
  { id: 'bedside-wine-cushions', src: `${BOOKING}/905856103.jpg?k=3609e141cb904d475a297d829884f9623551e62725ad6c28274f841c57724693&o=`, focus: [0.45, 0.5] },
  { id: 'towels-toiletries', src: `${BOOKING}/905854659.jpg?k=fbee8f15ecffee0da8959764692b91adba05620f5f2d3bb42d91a1dde5b97ea6&o=`, focus: [0.5, 0.5] },
  { id: 'walk-in-shower', src: `${BOOKING}/905854705.jpg?k=bb80ae6314d99c06fea190cfe1d25d865c4e59a17421ac05bf6108ba38b09133&o=`, focus: [0.3, 0.5] },
  { id: 'vanity-backlit-mirror', src: `${BOOKING}/905854703.jpg?k=6bc0d9907cf33464d6d8280234201f370391a191fa5ba9dd05a0d65b8c73d0a3&o=`, focus: [0.5, 0.55] },
  { id: 'basin-toiletries', src: `${BOOKING}/905854701.jpg?k=8eb4446946f03f04462d7a3b9649a02e3f06a51bea36e2c3b216a5c7f3a36f0a&o=`, focus: [0.5, 0.5] },
  { id: 'vanity-grey-tiles', src: `${BOOKING}/905854732.jpg?k=b3af04eae0285e3c96142da299daa52764d3188231c5ef0f74d3156c19f5ae41&o=`, focus: [0.5, 0.55] },
  { id: 'bathtub-headrest', src: `${BOOKING}/905854900.jpg?k=7e61f3c543388bf328b150166e7ab3da440d7167963304031830c9bd18d0d75d&o=`, focus: [0.5, 0.6] },
  { id: 'bath-hand-shower', src: `${BOOKING}/905854889.jpg?k=39bcd02de04f53d3fe6cae9bb3d805fada9e50ad77044498aa00911d3f042264&o=`, focus: [0.5, 0.55] },
  { id: 'bath-dark-stone', src: `${BOOKING}/905854890.jpg?k=0f8c595d6290e72b92952fd2a316b0850aef2f3e2a56ff3b37ca6dbb2bbef778&o=`, focus: [0.5, 0.55] },
  { id: 'bathtub-towel-rail', src: `${BOOKING}/905854902.jpg?k=2e09bc086ce11fadcb714b08945508c2e7c755ea8c5eb8df865233b24eac4753&o=`, focus: [0.4, 0.6] },
];
