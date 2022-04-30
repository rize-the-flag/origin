import Config from "../config.json" assert {type: "json"};
import {App} from "./App/App.js"
import {MarketListener} from "./App/market-watcher/market-watcher.js";

const app = new App(Config as typeof Config);
app.use([
    new MarketListener(Config.MarketWatcher.requestFrequency)
])
app.run();



