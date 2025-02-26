import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatTableData } from './pdfUtils';

interface ExportOptions {
  title: string;
  logoSrc: string;
  contentId: string;
  filename: string;
}

export const exportInitialAssessment = async (options: ExportOptions): Promise<void> => {
  const { title, contentId, filename } = options;
  const content = document.getElementById(contentId);
  
  if (!content) return;

  // Create PDF instance
  const pdf = new jsPDF({
    unit: 'pt',
    format: 'a4'
  });

  // Set basic parameters
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 40;
  let yPosition = margin;

  // Add title first (without waiting for logo)
  pdf.setFontSize(24);
  pdf.setTextColor(0, 51, 102); // Dark blue color for title
  pdf.text(title, margin, yPosition + 15);
  yPosition += 60;

  // Draw a horizontal line
  pdf.setDrawColor(0, 102, 204);
  pdf.setLineWidth(1);
  pdf.line(margin, yPosition - 20, pageWidth - margin, yPosition - 20);

  // Process basic information section
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text("Basic Information", margin, yPosition);
  yPosition += 25;

  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);

  // Extract form fields
  const formGroups = content.querySelectorAll('.formGroup');

  // Group related form fields for better formatting
  const basicFields = [
    'Name', 'Address', 'Phone', 'Date of Birth', 'NDIS Number', 
    'NDIS Plan Dates', 'Assessed By', 'Date', 'People Consulted'
  ];
  
  const detailFields = [
    'Diagnoses', 'Background', 'Mobility', 'Transfers', 
    'Living Situation', 'Funding Related Goals', 'Current Concerns',
    'Strengths/Likes', 'Supports In Use/Available'
  ];

  // Process basic fields in a grid format (2 columns)
  pdf.setFontSize(10);
  const columnWidth = (pageWidth - (margin * 2)) / 2 - 10;
  let columnYPosition = yPosition;
  let column = 0;

  // Improved data extraction for form fields
  formGroups.forEach((group) => {
    const labelElement = group.querySelector('label');
    if (!labelElement) return;
    
    const label = labelElement.textContent?.trim() || '';
    if (!basicFields.includes(label)) return;
    
    // Get the input or textarea element
    const input = group.querySelector('input, textarea');
    let value = '(Not provided)';

    if (input && typeof input === 'object') {
      if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
        value = input.value || '(Not provided)';
      }
    }

    // If no direct input found, try to find it by ID
    if (!input && labelElement.htmlFor) {
      const inputById = document.getElementById(labelElement.htmlFor);
      if (inputById instanceof HTMLInputElement || inputById instanceof HTMLTextAreaElement) {
        value = inputById.value || '(Not provided)';
      }
    }

    const labelXPosition = margin + (column * (columnWidth + 20));
    
    pdf.setFont("helvetica", "bold");
    pdf.text(label + ":", labelXPosition, columnYPosition);
    
    pdf.setFont("helvetica", "normal");
    pdf.text(value, labelXPosition, columnYPosition + 15);
    
    columnYPosition += 35;
    
    // Switch to second column or new page if needed
    if (columnYPosition > pageHeight - margin) {
      if (column === 0) {
        column = 1;
        columnYPosition = yPosition;
      } else {
        pdf.addPage();
        column = 0;
        columnYPosition = margin;
        yPosition = margin;
      }
    }
  });

  // Update the yPosition to the maximum of both columns
  yPosition = Math.max(columnYPosition, yPosition);
  yPosition += 20;
  
  // Check if we need a new page for the detailed sections
  if (yPosition > pageHeight - 150) {
    pdf.addPage();
    yPosition = margin;
  }

  // Section header for detailed fields
  pdf.setFontSize(16);
  pdf.setTextColor(0, 51, 102);
  pdf.text("Clinical Information", margin, yPosition);
  yPosition += 25;
  
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);

  // Process detail fields (full width) with improved data extraction
  formGroups.forEach((group) => {
    const labelElement = group.querySelector('label');
    if (!labelElement) return;
    
    const label = labelElement.textContent?.trim() || '';
    if (!detailFields.includes(label)) return;
    
    // Try to find the textarea directly
    let input = group.querySelector('textarea');
    
    // If not found, try to find by ID
    if (!input && labelElement.htmlFor) {
      input = document.getElementById(labelElement.htmlFor) as HTMLTextAreaElement;
    }
    
    // If still not found, look for any input in the group
    if (!input) {
      input = group.querySelector('input[type="text"]');
    }
    
    let value = '(Not provided)';
    // if (input && typeof input === 'object') {
    //   if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
    //     value = input.value || '(Not provided)';
    //   }
    // }

    // Check if we need a new page
    if (yPosition + 60 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFont("helvetica", "bold");
    pdf.text(label + ":", margin, yPosition);
    
    pdf.setFont("helvetica", "normal");
    const splitText = pdf.splitTextToSize(value, pageWidth - (margin * 2));
    pdf.text(splitText, margin, yPosition + 15);
    
    yPosition += 25 + (splitText.length * 12);
  });

  // Process AT Used section
  const atUsedSection = content.querySelector('[data-section="at-used"]');
  if (atUsedSection) {
    // Check if we need a new page
    if (yPosition + 120 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 51, 102);
    pdf.text("Assistive Technology Used", margin, yPosition);
    yPosition += 20;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    // Create a table for AT Used
    const atUsedData: any = [];
    const checkboxes = atUsedSection.querySelectorAll('input[type="checkbox"]');
    
    Array.from(checkboxes).forEach((checkbox) => {
      if (checkbox instanceof HTMLInputElement) {
        const checkboxLabel = checkbox.parentElement?.textContent?.trim() || '';
        const modelInput = checkbox.parentElement?.nextElementSibling as HTMLInputElement;
        const model = modelInput?.value || '';
        
        if (checkbox.checked) {
          atUsedData.push([checkboxLabel, model]);
        }
      }
    });
    
    if (atUsedData.length > 0) {
      pdf.autoTable({
        head: [['Device', 'Model']],
        body: atUsedData,
        startY: yPosition,
        margin: { left: margin },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [0, 102, 204] }
      });
      
      yPosition = (pdf as any).lastAutoTable.finalY + 15;
    } else {
      pdf.text("No assistive technology devices selected", margin, yPosition);
      yPosition += 15;
    }
  }

  // Process Gaming History
  const gamingSection = content.querySelector('[data-section="gaming-history"]');
  if (gamingSection) {
    // Check if we need a new page
    if (yPosition + 120 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 51, 102);
    pdf.text("Gaming Experience", margin, yPosition);
    yPosition += 20;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    // Extract gaming history data
    const consoles: string[] = [];
    const checkboxes = gamingSection.querySelectorAll('input[type="checkbox"]');
    
    Array.from(checkboxes).forEach((checkbox) => {
      if (checkbox instanceof HTMLInputElement && checkbox.checked) {
        const label = checkbox.parentElement?.textContent?.trim() || '';
        consoles.push(label);
      }
    });
    
    // Controller and games info - using standard DOM methods
    let controllerText = 'Not specified';
    let gamesText = 'Not specified';
    
    // Find all labels in the gaming section
    const labels = gamingSection.querySelectorAll('label');
    
    // Find the controller and games labels
    Array.from(labels).forEach(label => {
      const labelText = label.textContent?.trim() || '';
      
      if (labelText.includes('Controller:')) {
        // Find the textarea that follows this label
        let nextElement = label.nextElementSibling;
        while (nextElement) {
          if (nextElement instanceof HTMLTextAreaElement) {
            controllerText = nextElement.value || 'Not specified';
            break;
          }
          nextElement = nextElement.nextElementSibling;
        }
      }
      
      if (labelText.includes('Games:')) {
        // Find the textarea that follows this label
        let nextElement = label.nextElementSibling;
        while (nextElement) {
          if (nextElement instanceof HTMLTextAreaElement) {
            gamesText = nextElement.value || 'Not specified';
            break;
          }
          nextElement = nextElement.nextElementSibling;
        }
      }
    });
    
    const consoleText = consoles.length > 0 ? consoles.join(', ') : 'None specified';
    
    pdf.setFont("helvetica", "bold");
    pdf.text("Previous Gaming Experience:", margin, yPosition);
    yPosition += 15;
    
    pdf.setFont("helvetica", "normal");
    pdf.text(`Consoles: ${consoleText}`, margin + 10, yPosition);
    yPosition += 15;
    
    pdf.text(`Controller: ${controllerText}`, margin + 10, yPosition);
    yPosition += 15;
    
    const gamesSplit = pdf.splitTextToSize(`Games: ${gamesText}`, pageWidth - (margin * 2) - 10);
    pdf.text(gamesSplit, margin + 10, yPosition);
    yPosition += gamesSplit.length * 12 + 10;
  }

  // Add a section for functional limitations
  const functionalSection = document.querySelector('.assessmentTable');
  if (functionalSection) {
    if (yPosition + 120 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 51, 102);
    pdf.text("Functional Limitations", margin, yPosition);
    yPosition += 20;
    
    // Extract table data using the formatTableData utility
    const tableData = formatTableData(functionalSection);
    
    if (tableData.rows.length > 0) {
      pdf.autoTable({
        head: [tableData.headers],
        body: tableData.rows,
        startY: yPosition,
        margin: { left: margin },
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [0, 102, 204] }
      });
      
      yPosition = (pdf as any).lastAutoTable.finalY + 15;
    }
  }

  // Add recommendations section
  const recommendationTable = document.querySelector('.recommendationTable');
  if (recommendationTable) {
    if (yPosition + 120 > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(14);
    pdf.setTextColor(0, 51, 102);
    pdf.text("Recommendations", margin, yPosition);
    yPosition += 20;
    
    // Extract recommendations data
    const rows = recommendationTable.querySelectorAll('tr');
    
    Array.from(rows).forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        const label = cells[0].textContent?.trim() || '';
        let value = '(Not provided)';
        
        // Try to get value from textarea or input
        const input = cells[1].querySelector('textarea, input');
        if (input && typeof input === 'object') {
          if (input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement) {
            value = input.value || '(Not provided)';
          }
        } else {
          value = cells[1].textContent?.trim() || '(Not provided)';
        }
        
        // Check if we need a new page
        if (yPosition + 40 > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.setFont("helvetica", "bold");
        pdf.text(label + ":", margin, yPosition);
        yPosition += 15;
        
        pdf.setFont("helvetica", "normal");
        const splitText = pdf.splitTextToSize(value, pageWidth - (margin * 2) - 10);
        pdf.text(splitText, margin + 10, yPosition);
        yPosition += splitText.length * 12 + 10;
      }
    });
  }

  // Save PDF
  pdf.save(filename);
}; 