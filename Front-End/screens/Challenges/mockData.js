// // Mock data for challenges feature demonstration
//
// export const timeFrameOptions = [
//   { id: 1, label: "3 Days", value: 3 },
//   { id: 2, label: "1 Week", value: 7 },
//   { id: 3, label: "2 Weeks", value: 14 },
//   { id: 4, label: "1 Month", value: 30 },
// ];
//
// export const challengeTypes = [
//   {
//     id: 1,
//     title: "Least Smoked Wins",
//     description:
//       "The participant who smokes the least number of cigarettes during the entire challenge wins.",
//     rules:
//       "Total cigarettes are counted throughout the challenge period. Lowest count wins.",
//   },
//   {
//     id: 2,
//     title: "Daily Target Points",
//     description:
//       "Gain 1 point for every cigarette you smoke less than your daily target. Lose 2 points for each cigarette over target.",
//     rules:
//       "Points are calculated daily based on your personal target. Most points at the end wins.",
//   },
// ];
//
// export const mockChallenges = [
//   {
//     id: 1,
//     title: "May Quit Challenge",
//     type: 1, // Type 1: Least Smoked Wins
//     typeName: "Least Smoked Wins",
//     timeFrame: "2 Weeks",
//     startDate: "2025-05-10",
//     endDate: "2025-05-24",
//     participants: 6,
//     status: "active", // active, completed, upcoming
//     creator: "Sarah M.",
//     joined: true,
//     personalProgress: {
//       cigSmoked: 10,
//       currentRank: 2,
//       personalTarget: 20,
//     },
//     leaderboard: [
//       { id: 101, name: "John D.", cigSmoked: 8, points: null },
//       { id: 102, name: "You", cigSmoked: 10, points: null },
//       { id: 103, name: "Mike P.", cigSmoked: 12, points: null },
//       { id: 104, name: "Laura K.", cigSmoked: 15, points: null },
//       { id: 105, name: "Sarah M.", cigSmoked: 18, points: null },
//       { id: 106, name: "David R.", cigSmoked: 22, points: null },
//     ],
//   },
//   {
//     id: 2,
//     title: "Target Champions",
//     type: 2, // Type 2: Daily Target Points
//     typeName: "Daily Target Points",
//     timeFrame: "1 Month",
//     startDate: "2025-05-01",
//     endDate: "2025-05-31",
//     participants: 8,
//     status: "active",
//     creator: "Mike P.",
//     joined: true,
//     personalProgress: {
//       cigSmoked: 18,
//       points: 24,
//       currentRank: 3,
//       personalTarget: 3,
//     },
//     leaderboard: [
//       { id: 201, name: "David R.", cigSmoked: 12, points: 36 },
//       { id: 202, name: "Laura K.", cigSmoked: 15, points: 30 },
//       { id: 203, name: "You", cigSmoked: 18, points: 24 },
//       { id: 204, name: "John D.", cigSmoked: 20, points: 20 },
//       { id: 205, name: "Sarah M.", cigSmoked: 22, points: 16 },
//       { id: 206, name: "Mike P.", cigSmoked: 25, points: 10 },
//       { id: 207, name: "Emma T.", cigSmoked: 28, points: 6 },
//       { id: 208, name: "Alex B.", cigSmoked: 30, points: 0 },
//     ],
//   },
//   {
//     id: 3,
//     title: "Spring Smoke-Free",
//     type: 1,
//     typeName: "Least Smoked Wins",
//     timeFrame: "1 Week",
//     startDate: "2025-04-15",
//     endDate: "2025-04-22",
//     participants: 5,
//     status: "completed",
//     creator: "Emma T.",
//     joined: true,
//     personalProgress: {
//       cigSmoked: 12,
//       currentRank: 1,
//       personalTarget: 20,
//     },
//     winner: "You",
//     leaderboard: [
//       { id: 301, name: "You", cigSmoked: 12, points: null },
//       { id: 302, name: "Emma T.", cigSmoked: 15, points: null },
//       { id: 303, name: "Laura K.", cigSmoked: 18, points: null },
//       { id: 304, name: "David R.", cigSmoked: 22, points: null },
//       { id: 305, name: "John D.", cigSmoked: 25, points: null },
//     ],
//   },
//   {
//     id: 4,
//     title: "Weekend Warriors",
//     type: 2,
//     typeName: "Daily Target Points",
//     timeFrame: "3 Days",
//     startDate: "2025-05-25",
//     endDate: "2025-05-28",
//     participants: 4,
//     status: "upcoming",
//     creator: "John D.",
//     joined: false,
//   },
//   {
//     id: 5,
//     title: "Summer Challenge",
//     type: 1,
//     typeName: "Least Smoked Wins",
//     timeFrame: "1 Month",
//     startDate: "2025-06-01",
//     endDate: "2025-06-30",
//     participants: 3,
//     status: "upcoming",
//     creator: "Laura K.",
//     joined: false,
//   },
// ];
