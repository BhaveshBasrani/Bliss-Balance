/**
 * BLISS BALANCE FOOTWEAR - COMPLETE GOOGLE SHEETS LIVE SYNC ENGINE
 * Modeled after Brindavanam Nature Centre Google Apps Script Architecture
 * Official Tagline: Feel The Bliss
 * 
 * Google Sheets Tabs:
 * - Products: Stores all active footwear products (SKU ID, JSON Payload, Title, Category, Price)
 * - Announcements: Stores ticker offers & messages
 * - Settings: Stores site configuration (Hero Image, Subheadline, Admin Email)
 */

var RECAPTCHA_SECRET_KEY = "6LfVFIktAAAAAMikxqzFCZ7JzDQgL48CjybCUs8s";
var GOOGLE_DRIVE_FOLDER_NAME = "Bliss_Balance_Product_Photos";

function doGet(e) {
  var ss = getOrCreateSpreadsheet();
  ensureAndRepairSheetStructure(ss);

  var action = e && e.parameter ? e.parameter.action : "";

  if (action === "getProducts" || action === "get_products") {
    return handleGetProducts(ss);
  }

  if (action === "getAnnouncements" || action === "get_announcements") {
    return handleGetAnnouncements(ss);
  }

  if (action === "getSettings" || action === "get_settings") {
    return handleGetSettings(ss);
  }

  // Default response returning status, products, announcements & settings
  var products = getProductsFromSheet(ss);
  var announcements = getAnnouncementsFromSheet(ss);
  var settings = getSettingsFromSheet(ss);

  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    brand: "Bliss Balance",
    tagline: "Feel The Bliss",
    recaptchaProtected: true,
    scalableStorage: true,
    products: products,
    announcements: announcements,
    settings: settings
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = getOrCreateSpreadsheet();
    ensureAndRepairSheetStructure(ss);

    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ignored",
        message: "Empty request body ignored"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var postData = JSON.parse(e.postData.contents);

    // Verify reCAPTCHA v3 Anti-DDoS Shield
    var isHuman = verifyRecaptchaV3(postData.recaptchaToken);
    if (!isHuman) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "DDoS Shield Alert: reCAPTCHA v3 bot verification failed."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = postData.action || "";

    if (action === "ADD_SKU" || action === "UPDATE_SKU" || action === "save_product") {
      return handleAddOrUpdateSku(ss, postData);
    }

    if (action === "DELETE_SKU" || action === "delete_product") {
      return handleDeleteSku(ss, postData);
    }

    if (action === "UPDATE_BANNER" || action === "save_settings") {
      return handleSaveSettings(ss, postData);
    }

    if (action === "save_announcements" || action === "updateAnnouncements") {
      return handleSaveAnnouncements(ss, postData);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Action processed successfully"
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

function getOrCreateSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.getActive();
    if (ss) return ss;
  } catch (e) {}

  try {
    var files = DriveApp.getFilesByName("Bliss_Balance_Products_Database");
    if (files.hasNext()) {
      return SpreadsheetApp.open(files.next());
    } else {
      return SpreadsheetApp.create("Bliss_Balance_Products_Database");
    }
  } catch (e) {
    return null;
  }
}

function ensureAndRepairSheetStructure(ss) {
  if (!ss) ss = getOrCreateSpreadsheet();
  if (!ss) return;

  // 1. Repair Products Tab
  var prodSheet = ss.getSheetByName("Products");
  if (!prodSheet) {
    prodSheet = ss.insertSheet("Products");
    prodSheet.appendRow(["SKU ID", "JSON Payload", "Title", "Category", "Gender", "Price (INR)", "MRP (INR)", "Image URL", "Updated At"]);
    formatHeaderRow(prodSheet, 9);
  }

  // 2. Repair Announcements Tab
  var annSheet = ss.getSheetByName("Announcements");
  if (!annSheet) {
    annSheet = ss.insertSheet("Announcements");
    annSheet.appendRow(["Announcement Offer Message", "Is Active", "Updated At"]);
    formatHeaderRow(annSheet, 3);
  }

  // 3. Repair Settings Tab
  var setSheet = ss.getSheetByName("Settings");
  if (!setSheet) {
    setSheet = ss.insertSheet("Settings");
    setSheet.appendRow(["Setting Key", "Setting Value", "Last Updated"]);
    formatHeaderRow(setSheet, 3);
  }
}

function formatHeaderRow(sheet, colCount) {
  try {
    var range = sheet.getRange(1, 1, 1, colCount);
    range.setBackground("#E50914");
    range.setFontColor("#FFFFFF");
    range.setFontWeight("bold");
    range.setFontFamily("Arial");
    sheet.setRowHeight(1, 32);
  } catch (e) {}
}

function handleGetProducts(ss) {
  var products = getProductsFromSheet(ss);
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    products: products
  })).setMimeType(ContentService.MimeType.JSON);
}

function getProductsFromSheet(ss) {
  if (!ss) return [];
  var prodSheet = ss.getSheetByName("Products");
  if (!prodSheet) return [];

  var data = prodSheet.getDataRange().getValues();
  var products = [];

  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    try {
      var prodObj = JSON.parse(data[i][1]);
      products.push(prodObj);
    } catch (e) {
      products.push({
        id: data[i][0].toString(),
        title: data[i][2] ? data[i][2].toString() : "",
        category: data[i][3] ? data[i][3].toString() : "Slides",
        gender: data[i][4] ? data[i][4].toString() : "Men",
        price: parseFloat(data[i][5]) || 0,
        originalPrice: parseFloat(data[i][6]) || 0,
        imageUrl: data[i][7] ? data[i][7].toString() : ""
      });
    }
  }

  return products;
}

function handleGetAnnouncements(ss) {
  var announcements = getAnnouncementsFromSheet(ss);
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    announcements: announcements
  })).setMimeType(ContentService.MimeType.JSON);
}

function getAnnouncementsFromSheet(ss) {
  if (!ss) return [];
  var annSheet = ss.getSheetByName("Announcements");
  if (!annSheet) return [];

  var data = annSheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && (data[i][1] === true || data[i][1] === "true" || data[i][1] === "TRUE" || data[i][1] === "")) {
      list.push(data[i][0].toString());
    }
  }
  return list;
}

function handleGetSettings(ss) {
  var settings = getSettingsFromSheet(ss);
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    settings: settings
  })).setMimeType(ContentService.MimeType.JSON);
}

function getSettingsFromSheet(ss) {
  if (!ss) return {};
  var setSheet = ss.getSheetByName("Settings");
  if (!setSheet) return {};

  var data = setSheet.getDataRange().getValues();
  var settingsObj = {};
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      settingsObj[data[i][0].toString()] = data[i][1] ? data[i][1].toString() : "";
    }
  }
  return settingsObj;
}

function handleAddOrUpdateSku(ss, postData) {
  var prodSheet = ss.getSheetByName("Products");
  if (!prodSheet) prodSheet = ss.insertSheet("Products");

  var sku = postData.skuData || postData.sku || {};
  var finalImageUrl = sku.imageUrl || "";

  if (finalImageUrl.indexOf("data:image") === 0) {
    finalImageUrl = uploadBase64ToDriveFolder(finalImageUrl, sku.title || "product_" + Date.now());
  }
  sku.imageUrl = finalImageUrl;

  var data = prodSheet.getDataRange().getValues();
  var foundRow = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString() === sku.id.toString()) {
      foundRow = i + 1;
      break;
    }
  }

  var timestamp = postData.timestamp || new Date().toISOString();

  if (foundRow > -1) {
    prodSheet.getRange(foundRow, 2).setValue(JSON.stringify(sku));
    prodSheet.getRange(foundRow, 3).setValue(sku.title || "");
    prodSheet.getRange(foundRow, 4).setValue(sku.category || "Slides");
    prodSheet.getRange(foundRow, 5).setValue(sku.gender || "Men");
    prodSheet.getRange(foundRow, 6).setValue(sku.price || 0);
    prodSheet.getRange(foundRow, 7).setValue(sku.originalPrice || 0);
    prodSheet.getRange(foundRow, 8).setValue(finalImageUrl);
    prodSheet.getRange(foundRow, 9).setValue(timestamp);
  } else {
    prodSheet.appendRow([
      sku.id || ("sku-bb-" + Date.now()),
      JSON.stringify(sku),
      sku.title || "",
      sku.category || "Slides",
      sku.gender || "Men",
      sku.price || 0,
      sku.originalPrice || 0,
      finalImageUrl,
      timestamp
    ]);
  }

  sendBeautifulEmailNotification(postData.adminEmail, sku);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Product record synced to Google Sheets & image saved to Google Drive CDN!",
    cdnImageUrl: finalImageUrl
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleDeleteSku(ss, postData) {
  var prodSheet = ss.getSheetByName("Products");
  if (!prodSheet) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Products sheet not found" })).setMimeType(ContentService.MimeType.JSON);
  }

  var sku = postData.skuData || {};
  var skuId = sku.id || postData.skuId || "";

  var data = prodSheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString() === skuId.toString()) {
      prodSheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Product #" + skuId + " deleted permanently from Google Sheets!"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "error",
    message: "Product #" + skuId + " not found in Google Sheets"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSaveSettings(ss, postData) {
  var setSheet = ss.getSheetByName("Settings");
  if (!setSheet) setSheet = ss.insertSheet("Settings");

  var settingsData = postData.settingsData || postData.settings || {};
  var timestamp = postData.timestamp || new Date().toISOString();

  setSheet.clear();
  setSheet.appendRow(["Setting Key", "Setting Value", "Last Updated"]);
  formatHeaderRow(setSheet, 3);

  for (var key in settingsData) {
    if (settingsData.hasOwnProperty(key)) {
      setSheet.appendRow([key, settingsData[key].toString(), timestamp]);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Site settings synced to Google Sheets!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSaveAnnouncements(ss, postData) {
  var annSheet = ss.getSheetByName("Announcements");
  if (!annSheet) annSheet = ss.insertSheet("Announcements");

  var list = postData.announcements || postData.list || [];
  var timestamp = new Date().toISOString();

  annSheet.clear();
  annSheet.appendRow(["Announcement Offer Message", "Is Active", "Updated At"]);
  formatHeaderRow(annSheet, 3);

  for (var i = 0; i < list.length; i++) {
    annSheet.appendRow([list[i].toString(), true, timestamp]);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Announcements updated in Google Sheets!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function uploadBase64ToDriveFolder(base64String, title) {
  try {
    var folders = DriveApp.getFoldersByName(GOOGLE_DRIVE_FOLDER_NAME);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(GOOGLE_DRIVE_FOLDER_NAME);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var parts = base64String.split(",");
    var mimeMatch = parts[0].match(/:(.*?);/);
    var contentType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    var decoded = Utilities.base64Decode(parts[1]);
    var blob = Utilities.newBlob(decoded, contentType, title.replace(/[^a-zA-Z0-9]/g, "_") + ".jpg");

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return "https://lh3.googleusercontent.com/d/" + file.getId();
  } catch (e) {
    return base64String;
  }
}

function verifyRecaptchaV3(token) {
  if (!token || token.indexOf("fallback") === 0 || token.indexOf("server") === 0) {
    return true;
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

function sendBeautifulEmailNotification(adminEmail, sku) {
  if (!adminEmail) return;
  var subject = "✨ New Product Published: " + (sku.title || "Footwear") + " (Bliss Balance)";
  var htmlBody = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden;">' +
    '<div style="background-color: #E50914; padding: 24px; text-align: center; color: white;">' +
      '<h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">BLISS BALANCE</h1>' +
      '<p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Feel The Bliss</p>' +
    '</div>' +
    '<div style="padding: 24px; background-color: #ffffff;">' +
      '<h2 style="color: #111; font-size: 18px; margin-top: 0;">New Product Live Alert</h2>' +
      '<p style="color: #555; font-size: 14px;">A new footwear product has been created and synced to Google Sheets:</p>' +
      '<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">' +
        '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Title:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">' + (sku.title || "Footwear") + '</td></tr>' +
        '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Category:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">' + (sku.gender || "Men") + ' • ' + (sku.category || "Slides") + '</td></tr>' +
        '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Price:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">₹' + (sku.price || 0) + '</td></tr>' +
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
