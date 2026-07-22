import { analytics } from "@launchfury/analytics";

const WRITE_KEY = "lf_landing_tatw";
const HOST = window.location.origin;

analytics.init({
  writeKey: WRITE_KEY,
  host: HOST,
  autocapturePageviews: true,
  debug: false,
});