import { GamaInstance } from "./gama.js";

const instance = new GamaInstance(document.getElementById("canvas"));

instance.setup("./gama-worker.js", "./lineup.wasm");
