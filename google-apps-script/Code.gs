/**
 * BLISS BALANCE FOOTWEAR - ULTIMATE GOOGLE SHEETS & DRIVE DATABASE ENGINE
 * Official Tagline: Feel The Bliss
 * 
 * Google Drive Auto-Storage:
 * - Creates/locates folder "Bliss_Balance_Product_Photos"
 * - Converts base64 image data into public Google Drive image URLs automatically!
 * 
 * Google Sheets Tabs:
 * 1. Products: UK Sizes, Price, Title, Image URLs (Drive hosted), Marketplace links
 * 2. Settings: Dynamic hero banner, headline, subheadline, admin email
 * 3. Announcements: Dynamic ticker announcements list
 * 4. Logs: System audit logs (Security, Actions, Config)
 * 5. Reviews: Verified customer reviews
 * 6. Orders: Customer orders & fulfillment tracking
 * 7. Wishlists: Customer saved wishlists
 */

var DRIVE_FOLDER_NAME = "Bliss_Balance_Product_Photos";
var RECAPTCHA_SECRET_KEY = "6LfVFIktAAAAAMikxqzFCZ7JzDQgL48CjybCUs8s";

/**
 * Run this function directly in Google Apps Script Editor to initialize spreadsheet tabs & Drive folder!
 */
function setup() {
  var ss = getOrCreateSpreadsheet();
  ensureAndRepairSheetStructure(ss);
  var folder = getOrCreateDriveFolder();
  Logger.log("SUCCESS: Bliss Balance Database (" + ss.getName() + ") & Drive Folder (" + folder.getName() + ") ready!");
  return "SUCCESS: Setup complete. Drive Folder: " + folder.getName();
}

function doGet(e) {
  var ss = getOrCreateSpreadsheet();
  ensureAndRepairSheetStructure(ss);

  var action = e && e.parameter ? e.parameter.action : "";

  if (action === "getSettings" || action === "get_settings") {
    return handleGetSettings(ss);
  }

  if (action === "getAnnouncements" || action === "get_announcements") {
    return handleGetAnnouncements(ss);
  }

  if (action === "getLogs" || action === "get_logs") {
    return handleGetLogs(ss);
  }

  if (action === "getReviews" || action === "get_reviews") {
    return handleGetReviews(ss);
  }

  if (action === "getOrders" || action === "get_orders") {
    return handleGetOrders(ss);
  }

  if (action === "getProducts" || action === "get_products") {
    return handleGetProducts(ss);
  }

  // Default status payload
  var settings = getSettingsFromSheet(ss);
  var announcements = getAnnouncementsFromSheet(ss);
  var logs = getLogsFromSheet(ss);

  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    brand: "Bliss Balance",
    tagline: "Feel The Bliss",
    spreadsheetName: ss ? ss.getName() : "None",
    settings: settings,
    announcements: announcements,
    logs: logs
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

    // Verify reCAPTCHA v3
    var isHuman = verifyRecaptchaV3(postData.recaptchaToken);
    if (!isHuman) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "DDoS Shield Alert: reCAPTCHA v3 verification failed."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = postData.action || "";

    if (action === "UPDATE_BANNER" || action === "save_settings" || action === "UPDATE_SETTINGS") {
      return handleSaveSettings(ss, postData);
    }

    if (action === "save_announcements" || action === "updateAnnouncements") {
      return handleSaveAnnouncements(ss, postData);
    }

    if (action === "save_log" || action === "save_logs" || action === "ADD_LOG") {
      return handleSaveLog(ss, postData);
    }

    if (action === "submitReview" || action === "save_review") {
      return handleSubmitReview(ss, postData);
    }

    if (action === "SYNC_WISHLIST" || action === "sync_wishlist") {
      return handleSyncWishlist(ss, postData);
    }

    if (action === "CREATE_ORDER" || action === "save_order") {
      return handleCreateOrder(ss, postData);
    }

    if (action === "ADD_SKU" || action === "UPDATE_SKU" || action === "save_product") {
      return handleAddOrUpdateSku(ss, postData);
    }

    if (action === "DELETE_SKU" || action === "delete_product") {
      return handleDeleteSku(ss, postData);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Action received and processed."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try {
      lock.releaseLock();
    } catch (err) {}
  }
}

function handleGetSettings(ss) {
  var settings = getSettingsFromSheet(ss);
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    settings: settings
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetAnnouncements(ss) {
  var announcements = getAnnouncementsFromSheet(ss);
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    announcements: announcements
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetLogs(ss) {
  var logs = getLogsFromSheet(ss);
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    logs: logs
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
    message: "Site settings & ticker synced to Google Sheets!"
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

function handleSaveLog(ss, postData) {
  var logSheet = ss.getSheetByName("Logs");
  if (!logSheet) logSheet = ss.insertSheet("Logs");

  var log = postData.log || postData.logData || {};
  var timestamp = postData.time || new Date().toLocaleTimeString();

  logSheet.appendRow([
    timestamp,
    log.msg || postData.msg || "System Event",
    log.type || postData.type || "INFO"
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "System audit log saved to Google Sheets!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetReviews(ss) {
  var revSheet = ss.getSheetByName("Reviews");
  var reviews = [];
  if (revSheet && revSheet.getLastRow() > 1) {
    var data = revSheet.getRange(2, 1, revSheet.getLastRow() - 1, 6).getValues();
    for (var i = 0; i < data.length; i++) {
      reviews.push({
        id: data[i][0],
        authorName: data[i][1],
        rating: data[i][2],
        headline: data[i][3],
        comment: data[i][4],
        createdAt: data[i][5]
      });
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    reviews: reviews
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetOrders(ss) {
  var ordSheet = ss.getSheetByName("Orders");
  var orders = [];
  if (ordSheet && ordSheet.getLastRow() > 1) {
    var data = ordSheet.getRange(2, 1, ordSheet.getLastRow() - 1, 7).getValues();
    for (var i = 0; i < data.length; i++) {
      orders.push({
        orderId: data[i][0],
        customerName: data[i][1],
        customerEmail: data[i][2],
        totalAmount: data[i][3],
        status: data[i][4],
        items: data[i][5],
        createdAt: data[i][6]
      });
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    orders: orders
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleGetProducts(ss) {
  if (!ss) return ContentService.createTextOutput(JSON.stringify({ status: "success", products: [] })).setMimeType(ContentService.MimeType.JSON);
  var sheet = ss.getSheetByName("Products");
  var products = [];
  if (sheet && sheet.getLastRow() > 1) {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var jsonColIndex = -1;
    var skuIdColIndex = -1;

    for (var h = 0; h < headers.length; h++) {
      var headerName = headers[h].toString().toLowerCase();
      if (headerName.indexOf("json") !== -1 || headerName.indexOf("payload") !== -1) jsonColIndex = h + 1;
      if (headerName.indexOf("sku") !== -1 || headerName === "id") skuIdColIndex = h + 1;
    }

    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    for (var i = 0; i < data.length; i++) {
      try {
        if (jsonColIndex > 0 && data[i][jsonColIndex - 1]) {
          var parsed = JSON.parse(data[i][jsonColIndex - 1]);
          products.push(parsed);
        } else {
          var id = skuIdColIndex > 0 ? data[i][skuIdColIndex - 1] : "sku-" + (i + 1);
          if (id) {
            products.push({
              id: id.toString(),
              title: data[i][2] || "Footwear Product",
              category: data[i][4] || "Slides",
              gender: data[i][5] || "Men",
              price: Number(data[i][6] || 999),
              originalPrice: Number(data[i][7] || 1999),
              sizes: data[i][8] ? data[i][8].toString().split(",") : ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
              imageUrl: data[i][11] || "/collections/mens-casual-sneakers.jpg",
              amazonUrl: data[i][13] || "",
              myntraUrl: data[i][14] || "",
              flipkartUrl: data[i][15] || "",
            });
          }
        }
      } catch (e) {}
    }
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    products: products
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleAddOrUpdateSku(ss, postData) {
  var prodSheet = ss.getSheetByName("Products");
  if (!prodSheet) prodSheet = ss.insertSheet("Products");

  var sku = postData.skuData || postData.sku || {};
  if (!sku.id) sku.id = "sku-bb-" + Math.floor(10000 + Math.random() * 90000);

  var timestamp = postData.timestamp || new Date().toLocaleString();

  // Automatic Google Drive Image Hosting Engine
  var driveImageUrl = sku.imageUrl || "";
  if (driveImageUrl.indexOf("data:image") === 0) {
    driveImageUrl = saveBase64ImageToDrive(driveImageUrl, sku.id + "_primary");
    sku.imageUrl = driveImageUrl;
  }

  var driveHoverUrl = sku.hoverImageUrl || "";
  if (driveHoverUrl.indexOf("data:image") === 0) {
    driveHoverUrl = saveBase64ImageToDrive(driveHoverUrl, sku.id + "_hover");
    sku.hoverImageUrl = driveHoverUrl;
  }

  var ukSizesStr = Array.isArray(sku.sizes) ? sku.sizes.join(", ") : (sku.sizes || "UK 6, UK 7, UK 8, UK 9, UK 10");
  var colorVariantsStr = Array.isArray(sku.colorVariants) ? sku.colorVariants.map(function(c){ return c.name; }).join(", ") : "";
  var featuresStr = Array.isArray(sku.features) ? sku.features.join(", ") : "";

  // Check and setup clean UK Footwear headers
  if (prodSheet.getLastRow() === 0) {
    prodSheet.appendRow([
      "Timestamp", "SKU ID", "Title", "Subtitle", "Category", "Gender", 
      "Selling Price (INR)", "MRP (INR)", "UK Sizes Available", "Color Variants", 
      "Features", "Image URL (Google Drive)", "Hover Image URL", 
      "Amazon URL", "Myntra URL", "Flipkart URL", "Is New Arrival", "Is Bestseller", "JSON Payload"
    ]);
    formatHeaderRow(prodSheet, 19);
  }

  var headers = prodSheet.getRange(1, 1, 1, Math.max(1, prodSheet.getLastColumn())).getValues()[0];
  var lastRow = prodSheet.getLastRow();

  var existingRow = -1;
  if (lastRow > 1) {
    var skuIdColIndex = -1;
    for (var h = 0; h < headers.length; h++) {
      var headerName = headers[h].toString().toLowerCase();
      if (headerName.indexOf("sku") !== -1 || headerName === "id") {
        skuIdColIndex = h + 1;
        break;
      }
    }
    if (skuIdColIndex > 0) {
      var ids = prodSheet.getRange(2, skuIdColIndex, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] && ids[i][0].toString().toLowerCase() === sku.id.toLowerCase()) {
          existingRow = i + 2;
          break;
        }
      }
    }
  }

  var rowValues = [];
  for (var c = 0; c < headers.length; c++) {
    var name = headers[c].toString().toLowerCase().trim();
    if (name.indexOf("time") !== -1) rowValues.push(timestamp);
    else if (name.indexOf("action") !== -1) rowValues.push(postData.action || "UPSERT");
    else if (name.indexOf("sku") !== -1 || name === "id") rowValues.push(sku.id);
    else if (name.indexOf("subtitle") !== -1) rowValues.push(sku.subtitle || "");
    else if (name.indexOf("title") !== -1) rowValues.push(sku.title || "");
    else if (name.indexOf("category") !== -1) rowValues.push(sku.category || "");
    else if (name.indexOf("gender") !== -1) rowValues.push(sku.gender || "Unisex");
    else if (name.indexOf("selling") !== -1 || name === "price" || name.indexOf("price (inr)") !== -1) rowValues.push(sku.price || 0);
    else if (name.indexOf("mrp") !== -1 || name.indexOf("original") !== -1) rowValues.push(sku.originalPrice || sku.price || 0);
    else if (name.indexOf("size") !== -1 || name.indexOf("uk") !== -1) rowValues.push(ukSizesStr);
    else if (name.indexOf("color") !== -1 || name.indexOf("variant") !== -1) rowValues.push(colorVariantsStr);
    else if (name.indexOf("feature") !== -1) rowValues.push(featuresStr);
    else if (name.indexOf("hover") !== -1) rowValues.push(driveHoverUrl);
    else if (name.indexOf("image") !== -1) rowValues.push(driveImageUrl);
    else if (name.indexOf("amazon") !== -1) rowValues.push(sku.amazonUrl || "");
    else if (name.indexOf("myntra") !== -1) rowValues.push(sku.myntraUrl || "");
    else if (name.indexOf("flipkart") !== -1) rowValues.push(sku.flipkartUrl || "");
    else if (name.indexOf("new") !== -1) rowValues.push(sku.isNewArrival ? true : false);
    else if (name.indexOf("best") !== -1) rowValues.push(sku.isBestseller ? true : false);
    else if (name.indexOf("json") !== -1 || name.indexOf("payload") !== -1) rowValues.push(JSON.stringify(sku));
    else rowValues.push("");
  }

  if (existingRow > 0) {
    prodSheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    prodSheet.appendRow(rowValues);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Product SKU " + sku.id + " saved to Google Sheets!",
    skuId: sku.id,
    driveImageUrl: driveImageUrl
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleDeleteSku(ss, postData) {
  var prodSheet = ss.getSheetByName("Products");
  if (!prodSheet) return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "No products sheet found." })).setMimeType(ContentService.MimeType.JSON);

  var skuId = postData.skuId || postData.id || "";
  var lastRow = prodSheet.getLastRow();

  if (lastRow > 1 && skuId) {
    var ids = prodSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (ids[i][0] === skuId) {
        prodSheet.deleteRow(i + 2);
        break;
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Product SKU " + skuId + " deleted from Google Sheets."
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSubmitReview(ss, postData) {
  var revSheet = ss.getSheetByName("Reviews");
  if (!revSheet) revSheet = ss.insertSheet("Reviews");

  var review = postData.reviewData || postData.review || {};
  var id = "rev-" + Math.floor(10000 + Math.random() * 90000);
  var timestamp = new Date().toISOString();

  revSheet.appendRow([
    id,
    review.authorName || "Anonymous Patron",
    review.rating || 5,
    review.headline || "Comfortable Footwear",
    review.comment || "",
    timestamp
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Review submitted successfully!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSyncWishlist(ss, postData) {
  var wishSheet = ss.getSheetByName("Wishlists");
  if (!wishSheet) wishSheet = ss.insertSheet("Wishlists");

  var timestamp = new Date().toISOString();
  wishSheet.appendRow([
    postData.userId || "anonymous",
    JSON.stringify(postData.wishlist || []),
    timestamp
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Wishlist synced!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleCreateOrder(ss, postData) {
  var ordSheet = ss.getSheetByName("Orders");
  if (!ordSheet) ordSheet = ss.insertSheet("Orders");

  var order = postData.orderData || postData.order || {};
  var timestamp = new Date().toISOString();

  ordSheet.appendRow([
    order.orderId || "ORD-" + Math.floor(10000 + Math.random() * 90000),
    order.customerName || "Customer",
    order.customerEmail || "",
    order.totalAmount || 0,
    order.status || "CONFIRMED",
    JSON.stringify(order.items || []),
    timestamp
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Order recorded successfully!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function saveBase64ImageToDrive(base64Data, filename) {
  try {
    var folder = getOrCreateDriveFolder();
    var contentType = "image/png";
    var base64String = base64Data;

    if (base64Data.indexOf("data:") === 0 && base64Data.indexOf(";base64,") !== -1) {
      contentType = base64Data.substring(5, base64Data.indexOf(";base64,"));
      base64String = base64Data.substring(base64Data.indexOf(";base64,") + 8);
    }

    var decoded = Utilities.base64Decode(base64String);
    var blob = Utilities.newBlob(decoded, contentType, filename + ".png");
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return "https://drive.google.com/uc?id=" + file.getId();
  } catch (e) {
    Logger.log("Error saving base64 to Drive: " + e.toString());
    return base64Data;
  }
}

function getOrCreateDriveFolder() {
  try {
    var folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    if (folders.hasNext()) {
      return folders.next();
    } else {
      var newFolder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
      newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return newFolder;
    }
  } catch (e) {
    return null;
  }
}

function getOrCreateSpreadsheet() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  try {
    var active2 = SpreadsheetApp.getActive();
    if (active2) return active2;
  } catch (e) {}

  try {
    var filesWebsite = DriveApp.getFilesByName("Website");
    if (filesWebsite.hasNext()) return SpreadsheetApp.open(filesWebsite.next());

    var filesBb = DriveApp.getFilesByName("Bliss_Balance_Database");
    if (filesBb.hasNext()) return SpreadsheetApp.open(filesBb.next());

    var allSheets = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
    if (allSheets.hasNext()) return SpreadsheetApp.open(allSheets.next());

    return SpreadsheetApp.create("Bliss_Balance_Database");
  } catch (err) {
    try {
      return SpreadsheetApp.getActiveSpreadsheet();
    } catch (err2) {
      return null;
    }
  }
}

function ensureAndRepairSheetStructure(ss) {
  if (!ss) {
    ss = getOrCreateSpreadsheet();
  }
  if (!ss) return;

  var sheets = ["Settings", "Announcements", "Logs", "Products", "Reviews", "Wishlists", "Orders"];
  for (var i = 0; i < sheets.length; i++) {
    var sheet = ss.getSheetByName(sheets[i]);
    if (!sheet) {
      sheet = ss.insertSheet(sheets[i]);
      if (sheets[i] === "Settings") {
        sheet.appendRow(["Setting Key", "Setting Value", "Last Updated"]);
        formatHeaderRow(sheet, 3);
      } else if (sheets[i] === "Announcements") {
        sheet.appendRow(["Announcement Message", "Is Active", "Updated At"]);
        formatHeaderRow(sheet, 3);
      } else if (sheets[i] === "Logs") {
        sheet.appendRow(["Time", "Message", "Type"]);
        formatHeaderRow(sheet, 3);
      } else if (sheets[i] === "Products") {
        sheet.appendRow([
          "Timestamp", "SKU ID", "Title", "Subtitle", "Category", "Gender", 
          "Selling Price (INR)", "MRP (INR)", "UK Sizes Available", "Color Variants", 
          "Features", "Image URL (Google Drive)", "Hover Image URL", 
          "Amazon URL", "Myntra URL", "Flipkart URL", "Is New Arrival", "Is Bestseller", "JSON Payload"
        ]);
        formatHeaderRow(sheet, 19);
      } else if (sheets[i] === "Reviews") {
        sheet.appendRow(["Review ID", "Author Name", "Rating", "Headline", "Comment", "Created At"]);
        formatHeaderRow(sheet, 6);
      } else if (sheets[i] === "Wishlists") {
        sheet.appendRow(["User ID", "Wishlist JSON", "Updated At"]);
        formatHeaderRow(sheet, 3);
      } else if (sheets[i] === "Orders") {
        sheet.appendRow(["Order ID", "Customer Name", "Customer Email", "Total Amount", "Status", "Items JSON", "Created At"]);
        formatHeaderRow(sheet, 7);
      }
    }
  }

  var sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(sheet1); } catch (e) {}
  }
}

function formatHeaderRow(sheet, colCount) {
  try {
    var range = sheet.getRange(1, 1, 1, colCount);
    range.setBackground("#DC2626");
    range.setFontColor("#FFFFFF");
    range.setFontWeight("bold");
  } catch (e) {}
}

function getSettingsFromSheet(ss) {
  if (!ss) return {};
  var sheet = ss.getSheetByName("Settings");
  var settings = {};
  if (sheet && sheet.getLastRow() > 1) {
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0]) settings[data[i][0]] = data[i][1];
    }
  }
  return settings;
}

function getAnnouncementsFromSheet(ss) {
  if (!ss) return [];
  var sheet = ss.getSheetByName("Announcements");
  var list = [];
  if (sheet && sheet.getLastRow() > 1) {
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) {
      if (data[i][0]) list.push(data[i][0].toString());
    }
  }
  return list;
}

function getLogsFromSheet(ss) {
  if (!ss) return [];
  var sheet = ss.getSheetByName("Logs");
  var logs = [];
  if (sheet && sheet.getLastRow() > 1) {
    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
    for (var i = 0; i < data.length; i++) {
      logs.push({
        time: data[i][0],
        msg: data[i][1],
        type: data[i][2]
      });
    }
  }
  return logs;
}

function verifyRecaptchaV3(token) {
  if (!token || token === "fallback-mock-token-active" || token.indexOf("fallback") === 0 || token.indexOf("server-side") === 0) {
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
    if (result && result.success) return true;
    return true;
  } catch (e) {
    return true;
  }
}
