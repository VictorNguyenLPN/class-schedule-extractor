# TDTU Class Schedule Extractor

A Chrome extension that helps TDTU (Ton Duc Thang University) students extract their class schedule and export it to an ICS file format, which can be imported into various calendar applications like Google Calendar, Apple Calendar, or Microsoft Outlook.

## Features

- Extracts class schedule from TDTU's academic portal
- Exports schedule to ICS format
- Supports customizable semester start date
- Includes detailed class information:
  - Course name and code
  - Group and sub-group information
  - Room location with full address
  - Time periods with accurate start and end times
  - Week information for the entire semester

## Installation

1. Clone this repository or download it as a ZIP file
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder

## How to Use

1. Log in to [TDTU's Academic Portal](https://lichhoc-lichthi.tdtu.edu.vn/)
2. Navigate to your class schedule page
3. Click the extension icon in your Chrome toolbar
4. Select the semester start date (must be a Sunday)
5. Click "Export ICS" button
6. The ICS file will be downloaded automatically
7. Import the downloaded ICS file into your preferred calendar application

## Development Progress Videos

Check out the development progress of this extension:

1. [First Development Session](https://youtu.be/DDNFgMm5VLk)
   - Initial setup and basic functionality implementation
   - Schedule extraction logic development

2. [Second Development Session](https://youtu.be/RUM6VdiVU0w)
   - Advanced features implementation
   - UI improvements and bug fixes

## Technical Details

The extension uses:
- Chrome Extension Manifest V3
- Pure JavaScript (ES6+)
- DOM manipulation for schedule extraction
- ICS format specification for calendar export

## Structure

```
├── manifest.json        # Extension configuration
├── main.html           # Popup interface
└── main.js            # Main extension logic
```

## Notes

- The extension only works on the TDTU academic portal
- Make sure to select the correct semester start date (Sunday)
- The exported schedule includes full address information for each location:
  - P Buildings: 12C Ngo Tat To, Binh Thanh, TP. HCM
  - Other Buildings: 19 Nguyen Huu Tho, Tan Hung, TP. HCM

## Contributing

Feel free to contribute to this project by:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
