import GradCamSim from "./GradCamSim";
import BlackBoxSim from "./BlackBoxSim";

/* Projects reference a simulation by key from content.js, so the data
   file never has to import a component. A project with a real photograph
   carries `image` instead and never reaches here. */
const SIMS = {
  gradcam: GradCamSim,
  blackbox: BlackBoxSim,
};

export default function Sim({ name }) {
  const Component = SIMS[name];
  return Component ? <Component /> : null;
}
