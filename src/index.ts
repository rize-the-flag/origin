import Config from "../config.json" assert {type: "json"};
import {App} from "./App/App.js"
import {MarketListener} from "./App/market-listener/market-listener.js";

const app = new App();
app.use([
    new MarketListener(Config.MarketWatcher.requestFrequency)
])
app.run();



