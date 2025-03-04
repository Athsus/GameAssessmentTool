# Gaming Assessment Tool

This tool is designed to help occupational therapists (OTs) assess and recommend gaming accessibility solutions for clients with various functional limitations. The system provides comprehensive assessment interfaces and database management functionality.

## OT's Functionalities

### 1. Basic Assessments

The system provides three specialized assessment interfaces to evaluate different functional limitations:

#### Keyboard and Mouse Assessment
- Navigate to the Keyboard Assessment page from the main menu
- Evaluate the client's upper limb status by selecting "Impaired" or "Unimpaired" for each function
- When ROM is impaired, you can specify affected body parts (hands, wrists, elbow, shoulders) and side (L/R)
- Check the appropriate boxes for recommended keyboard types based on the assessment
- Each selection will automatically display matching product recommendations in the right panel
- Click on specific recommendations to see product details, images, and websites

#### Physical Limitation Assessment
- Access the Physical Assessment page to evaluate gaming controller accessibility
- Complete each section (Range of Motion, Strength Limitations, Dexterity, etc.)
- For each section, mark "Impaired" or "Unimpaired" and indicate affected sides (L/R)
- Check the appropriate recommendation boxes to see matching adaptive products
- For severe impairments, the assessment includes specialized sections for mouth controllers and eye gaze
- All recommendations appear in the right panel for review and selection

#### Sensory Accessibility Assessment
- Use the Sensory Assessment page to evaluate visual, audio, and tactile needs
- Check the appropriate boxes under Visual Impairment for clients with low vision or color vision deficiency
- For clients with hearing impairments, use the Audio section to select appropriate accommodations
- The Tactile section addresses touch sensitivity, pressure sensitivity, and texture preferences
- Each selection automatically displays related recommendations in the right panel

#### Using the Recommendation Panel
- As you check boxes during assessment, matching products appear in the right panel
- Products are grouped by category and code
- Click any product to select it for your client (selected items show "Selected ✓")
- Click the collapse button (<) to minimize the panel and expand your workspace
- Each category has a dropdown arrow (▼/▲) to show/hide its recommendations
- To remove a category, click the X button in the upper right of the category header
- Add new products to a category by clicking the + button

### 2. Add Recommendation to Cart

- During assessment, click on any recommendation in the right panel to select it
- Selected items are indicated with "Selected ✓" and are automatically added to your client's cart
- Click a selected item again to deselect it and remove it from the cart
- Access the full cart from the main navigation to review all selected recommendations
- You can add recommendations from multiple assessments to create a comprehensive solution package

### 3. Assessment Export as PDF

*Under Construction*

This feature will allow you to export completed assessments as PDF files for documentation and sharing.

### 4. Cart Export as PDF

*Under Construction*

This feature will allow you to export the cart contents as a PDF report for clients and procurement.

## Manager's Functionalities

### 1. Database Management

The Database Management interface allows authorized users to maintain the product databases:

#### Accessing the Database
- Navigate to the Database Management page from the main menu
- Select a table from the dropdown menu (Keyboard Recommendations, Physical Recommendations, etc.)
- The table data will load automatically, displaying all products in that category

#### Viewing and Editing Data
- Click on any cell to edit its value directly in the table
- Modified cells will be highlighted to show pending changes
- Check the boxes next to rows you want to update or delete
- Use the row selection checkbox in the header to select/deselect all rows

#### Adding New Records
- Click the "Add New Row" button to open the add form
- For tables with category relationships, select the appropriate category from the dropdown
- Fill in all required fields in the form
- To add an image, use the image upload field to select a file (5MB max size)
- Click "Add Row" to save the new record to the database

#### Updating Existing Records
- After editing cells in selected rows, click "Save Selected Changes"
- Review the confirmation dialog showing all pending changes
- Click "Confirm" to commit the changes to the database
- Status messages will confirm successful updates or show errors

#### Deleting Records
- Select the rows you want to remove by checking their selection boxes
- Click "Delete Selected" to initiate the deletion process
- Review the confirmation dialog to ensure you're deleting the correct rows
- Click "Confirm" to permanently remove the selected records

#### Adding Images to Products
- In the recommendation panels, products without images show "No Image"
- Click the + or ✏️ button on any product image to add or update an image
- Enter the URL of the image in the popup dialog
- Click "Save" to update the product with the new image

This comprehensive database management system ensures that OTs always have access to up-to-date product information and recommendations for their clients.