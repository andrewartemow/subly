// export const fadeIn = (direction: string, delay: number) => {
//   return {
//     hidden: {
//       y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
//       x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
//     },
//     show: {
//       y: 0,
//       x: 0,
//       opacity: 1,
//       transition: {
//         type: 'tween',
//         duration: 1.2,
//         delay: delay,
//         ease: [0.25, 0.25, 0.25, 0.75],
//       },
//     },
//   };
// };

// variants.js

export const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// export const slideUp = {
//   hidden: { opacity: 0, y: 50 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };
