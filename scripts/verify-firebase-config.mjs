const apiKey = process.env.VITE_FIREBASE_API_KEY;
const expectedProjectNumber = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const requiredDomain = "khaledhamayel2005.github.io";

if (!apiKey || !expectedProjectNumber) {
  throw new Error("Firebase build variables are missing");
}

const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects?key=${encodeURIComponent(apiKey)}`);
const body = await response.json();

if (!response.ok) {
  throw new Error(`Firebase API key validation failed: ${body.error?.message || response.status}`);
}
if (body.projectId !== expectedProjectNumber) {
  throw new Error(`Firebase API key belongs to project number ${body.projectId}, expected ${expectedProjectNumber}`);
}
if (!body.authorizedDomains?.includes(requiredDomain)) {
  throw new Error(`Firebase Authentication does not authorize ${requiredDomain}`);
}

console.log(`Firebase configuration verified for project ${body.projectId}`);
