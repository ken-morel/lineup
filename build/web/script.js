import { GamaInstance } from "./gama.js";

const instance = new GamaInstance();

instance.setup("./gama-worker.js", "./lineup.wasm");
