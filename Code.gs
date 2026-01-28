function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Try to parse the incoming data
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: "Invalid JSON"}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Decide which sheet to use based on the 'type' field
  var sheetName = (data.type === 'demo_request') ? "Demo Requests" : "Survey Responses";
  var sheet = ss.getSheetByName(sheetName);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Add headers if it's a new sheet
    if (data.type === 'demo_request') {
      sheet.appendRow(["Timestamp", "Name", "Email", "Role"]);
    } else {
      sheet.appendRow(["Timestamp", "Email", "Role", "Company Stage", "Improvements", "Pain Scale", "Current Solution", "Hardest Part", "Value Scale"]);
    }
  }
  
  // Append the row
  if (data.type === 'demo_request') {
    sheet.appendRow([
      data.timestamp || new Date(),
      data.name,
      data.email,
      data.role
    ]);
  } else {
    sheet.appendRow([
      data.timestamp || new Date(),
      data.email,
      data.primary_role,
      data.company_stage,
      data.improvements,
      data.pain_scale,
      data.current_solution,
      data.hardest_part,
      data.value_scale
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({result: "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}