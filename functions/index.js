const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.setUserRole = functions.https.onCall(async (data, context) => {
  const {uid, role} = data;

  if (!context.auth) {
    throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated.",
    );
  }

  if (!uid || !role) {
    throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a valid UID and role.",
    );
  }

  try {
    await admin.auth().setCustomUserClaims(uid, {role});
    return {message: "Role updated successfully."};
  } catch (error) {
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});
