// see here for options: http://visjs.org/examples/network/other/configuration.html
const physics = {
  solver: "forceAtlas2Based",
  forceAtlas2Based: {
    springLength: 30,
    avoidOverlap: 1, // leave it to 1
    centralGravity: 0.02
  },

  //solver: "barnesHut",

  // there is an ongoing task: https://github.com/almende/vis/tree/webworkersNetwork
  // with a $100 bounty: https://www.bountysource.com/issues/33251603-web-worker
  // once it is done, we should be able to do:
  // useWorker: true,

  minVelocity: 1.4, // 0.75,
  timestep: 0.3, // a small timestep is better to provoke stabilization early


  stabilization: false,/* {
    enabled: false, // we disable stabilization because it takes a lot of time
    iterations: 80,
    fit: true, // fit the screen
    //updateInterval: 10
  },*/

  adaptiveTimestep: false // true // just used during stabiilzation
};
export default physics
