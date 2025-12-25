import { GamaInstance } from "./gama.js";

const instance = new GamaInstance();

instance.bind(document.getElementById("canvas"));

instance.setup("./gama-worker.js", "./lineup.wasm");
