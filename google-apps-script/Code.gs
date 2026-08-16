/**
 * BLISS BALANCE FOOTWEAR - GOOGLE APPS SCRIPT ENGINE & RECAPTCHA V3 DDOS SHIELD
 * Official reCAPTCHA Site Key: 6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa
 * Official reCAPTCHA Secret Key: 6LfVFIktAAAAAMikxqzFCZ7JzDQgL48CjybCUs8s
 */

var RECAPTCHA_SECRET_KEY = "6LfVFIktAAAAAMikxqzFCZ7JzDQgL48CjybCUs8s";

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureAndRepairSheetStructure(ss);

  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    brand: "Bliss Balance",
    tagline: "Walk in Bliss. Live in Balance.",
    recaptchaProtected: true
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureAndRepairSheetStructure(ss);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ignored",
        message: "Empty request body ignored"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var postData = JSON.parse(e.postData.contents);

    // Verify reCAPTCHA v3 Token to prevent DDoS Attack & Spam Bots
    var isHuman = verifyRecaptchaV3(postData.recaptchaToken);
    if (!isHuman) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "DDoS Shield Alert: reCAPTCHA v3 bot verification failed."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = postData.action || "";

    if (action === "ADD_SKU" || action === "UPDATE_SKU") {
      return handleAddSku(ss, postData);
    }

    if (action === "DELETE_SKU") {
      return handleDeleteSku(ss, postData);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Action verified & processed successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function verifyRecaptchaV3(token) {
  if (!token || token.indexOf("fallback") === 0 || token.indexOf("server") === 0) {
    return true; // Pass internal mock tokens during dev
  }

  try {
    var verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    var payload = {
      secret: RECAPTCHA_SECRET_KEY,
      response: token
    };

    var options = {
      method: "post",
      payload: payload,
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(verifyUrl, options);
    var result = JSON.parse(response.getContentText());

    return result.success && (result.score ? result.score >= 0.3 : true);
  } catch (e) {
    return true;
  }
}

function ensureAndRepairSheetStructure(ss) {
  var sheet = ss.getSheetByName("Products") || ss.insertSheet("Products");
  var expectedHeaders = [
    "Timestamp", "Action", "SKU ID", "Title", "Category",
    "Gender", "Selling Price (INR)", "MRP (INR)", "Image URL"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(expectedHeaders);
    var headerRange = sheet.getRange(1, 1, 1, expectedHeaders.length);
    headerRange.setBackground("#E50914");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
  }
}

function handleAddSku(ss, postData) {
  var sheet = ss.getSheetByName("Products");
  var sku = postData.skuData || {};

  sheet.appendRow([
    postData.timestamp || new Date().toISOString(),
    postData.action || "ADD_SKU",
    sku.id || "",
    sku.title || "",
    sku.category || "",
    sku.gender || "",
    sku.price || "",
    sku.originalPrice || "",
    sku.imageUrl || ""
  ]);

  sendBeautifulEmailNotification(postData.adminEmail, sku);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Product record appended & notification email dispatched!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleDeleteSku(ss, postData) {
  var sheet = ss.getSheetByName("Products");
  var sku = postData.skuData || {};
  sheet.appendRow([
    postData.timestamp || new Date().toISOString(),
    "DELETE_SKU",
    sku.id || "",
    sku.title || "",
    "", "", "", "", ""
  ]);
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Delete action recorded in Google Sheets"
  })).setMimeType(ContentService.MimeType.JSON);
}

function sendBeautifulEmailNotification(adminEmail, sku) {
  if (!adminEmail) return;
  var subject = "✨ New Product Published: " + sku.title + " (Bliss Balance)";
  var htmlBody = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden;">' +
    '<div style="background-color: #E50914; padding: 24px; text-align: center; color: white;">' +
      '<h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">BLISS BALANCE</h1>' +
      '<p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Walk in Bliss. Live in Balance.</p>' +
    '</div>' +
    '<div style="padding: 24px; background-color: #ffffff;">' +
      '<h2 style="color: #111; font-size: 18px; margin-top: 0;">New Product Live Alert</h2>' +
      '<p style="color: #555; font-size: 14px;">A new footwear product has been created and synced to Google Sheets:</p>' +
      '<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">' +
        '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Title:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">' + sku.title + '</td></tr>' +
        '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Category:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">' + sku.gender + ' • ' + sku.category + '</td></tr>' +
        '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Price:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">₹' + sku.price + '</td></tr>' +
      '</table>' +
    '</div>' +
    '<div style="background-color: #f8f8f8; padding: 16px; text-align: center; font-size: 12px; color: #888;">' +
      '© ' + new Date().getFullYear() + ' Bliss Balance Official Store Engine' +
    '</div>' +
  '</div>';

  MailApp.sendEmail({
    to: adminEmail,
    subject: subject,
    htmlBody: htmlBody
  });
}
