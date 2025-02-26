import { jsPDF } from 'jspdf';

export const addLogo = async (pdf: jsPDF, logoSrc: string, x: number, y: number, width: number): Promise<number> => {
  return new Promise((resolve) => {
    if (!logoSrc) {
      resolve(0);
      return;
    }

    const img = new Image();
    img.src = logoSrc;
    
    img.onload = () => {
      const height = (img.height / img.width) * width;
      pdf.addImage(img, 'PNG', x, y, width, height);
      resolve(height);
    };
    
    img.onerror = () => {
      console.error('Error loading logo');
      resolve(0);
    };
  });
};

export const formatTableData = (tableElement: Element): { headers: string[], rows: string[][] } => {
  const tableData = {
    headers: [] as string[],
    rows: [] as string[][]
  };

  // Extract headers
  tableElement.querySelectorAll('th').forEach(th => {
    tableData.headers.push(th.textContent?.trim() || '');
  });

  // Extract rows
  tableElement.querySelectorAll('tbody tr').forEach(tr => {
    const row: string[] = [];
    tr.querySelectorAll('td').forEach(td => {
      // Check for checkboxes
      const checkbox = td.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkbox) {
        row.push(checkbox.checked ? '✓' : '');
      } 
      // Check for radio buttons
      else if (td.querySelector('input[type="radio"]')) {
        const radios = td.querySelectorAll('input[type="radio"]');
        const checkedRadio = Array.from(radios).find(r => (r as HTMLInputElement).checked);
        row.push(checkedRadio ? '✓' : '');
      }
      // Check for text inputs
      else if (td.querySelector('input[type="text"], textarea')) {
        const input = td.querySelector('input[type="text"], textarea') as HTMLInputElement | HTMLTextAreaElement;
        row.push(input?.value || '');
      }
      // Just add text content
      else {
        row.push(td.textContent?.trim() || '');
      }
    });
    
    if (row.some(cell => cell !== '')) {
      tableData.rows.push(row);
    }
  });

  return tableData;
}; 