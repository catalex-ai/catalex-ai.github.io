function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Define the order of headers
    var headers = [
      "timestamp",
      "primary_role",
      "company_stage",
      "improvements",
      "top_priority",
      "pain_scale",
      "current_solution",
      "hardest_part",
      "value_scale"
    ];
    
    // Check if sheet is empty and add headers if so
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }
    
    // Map data to the row format
    var row = headers.map(function(header) {
      return data[header] || "";
    });
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
