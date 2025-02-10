import { jsPDF } from 'jspdf';
import 'jspdf-autotable';  // 需要安装: npm install jspdf-autotable

interface ExportToPDFOptions {
  title: string;
  logoSrc: string;
  contentId: string;
  filename: string;
}

export const exportToPDF = async (options: ExportToPDFOptions): Promise<void> => {
  const { title, contentId, filename } = options;
  const content = document.getElementById(contentId);
  
  if (!content) return;

  // 创建 PDF 实例，使用 pt 作为单位以便更精确的控制
  const pdf = new jsPDF({
    unit: 'pt',
    format: 'a4'
  });

  // 设置一些基本参数
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 40;
  let yPosition = margin;

  // 添加标题
  pdf.setFontSize(24);
  pdf.text(title, margin, yPosition);
  yPosition += 30;

  // 添加 logo（如果需要）
  // ... 可以使用 pdf.addImage() 添加 logo

  // 设置正文字体和大小
  pdf.setFontSize(12);
  
  // 处理表单数据
  const formData = extractFormData(content);
  
  // 基本信息部分
  formData.basicInfo.forEach(item => {
    if (yPosition + 60 > pageHeight) {
      pdf.addPage();
      yPosition = margin;
    }

    // 添加标签
    pdf.setFont("helvetica", "bold");
    pdf.text(item.label, margin, yPosition);
    
    // 添加值
    pdf.setFont("helvetica", "normal");
    if (item.value.length > 60) {
      // 长文本处理
      const lines = pdf.splitTextToSize(item.value, pageWidth - (margin * 2));
      pdf.text(lines, margin, yPosition + 20);
      yPosition += 20 + (lines.length * 15);
    } else {
      pdf.text(item.value, margin + 150, yPosition);
      yPosition += 30;
    }
  });

  // 表格部分（如果有）
  if (formData.tables.length > 0) {
    formData.tables.forEach(table => {
      if (yPosition + 100 > pageHeight) {
        pdf.addPage();
        yPosition = margin;
      }

      // 使用 autoTable 插件来绘制表格
      pdf.autoTable({
        head: [table.headers],
        body: table.rows,
        startY: yPosition,
        margin: { left: margin },
        styles: {
          fontSize: 10,
          cellPadding: 5,
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        columnStyles: {
          0: { cellWidth: 150 },  // Task 列
          1: { cellWidth: 40 },   // F 列
          2: { cellWidth: 40 },   // P 列
          3: { cellWidth: 40 },   // A 列
          4: { cellWidth: 'auto' } // Comments 列
        }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 20;
    });
  }

  // 保存 PDF
  pdf.save(filename);
};

interface FormField {
  label: string;
  value: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
}

interface FormData {
  basicInfo: FormField[];
  tables: TableData[];
}

function extractFormData(content: HTMLElement, formType: 'gefpt' | 'initial' = 'gefpt'): FormData {
  const formData: FormData = {
    basicInfo: [],
    tables: []
  };

  if (formType === 'initial') {
    // 提取 InitialAssessment 的数据
    content.querySelectorAll('.formGroup').forEach(group => {
      const label = group.querySelector('label')?.textContent?.trim() || '';
      const input = group.querySelector('input, textarea');
      let value = '';

      if (input instanceof HTMLInputElement) {
        value = input.value || '';
      } else if (input instanceof HTMLTextAreaElement) {
        value = input.value || '';
      }

      formData.basicInfo.push({ label, value });
    });

    // 提取表格数据（如果有的话）
    content.querySelectorAll('table').forEach(table => {
      const tableData: TableData = {
        headers: [],
        rows: []
      };

      // 提取表头
      table.querySelectorAll('th').forEach(th => {
        tableData.headers.push(th.textContent?.trim() || '');
      });

      // 提取行数据
      table.querySelectorAll('tbody tr').forEach(tr => {
        const row: string[] = [];
        tr.querySelectorAll('td').forEach(td => {
          const input = td.querySelector('input, textarea');
          if (input instanceof HTMLInputElement) {
            if (input.type === 'checkbox') {
              row.push(input.checked ? 'X' : '');
            } else {
              row.push(input.value || '');
            }
          } else if (input instanceof HTMLTextAreaElement) {
            row.push(input.value || '');
          } else {
            row.push(td.textContent?.trim() || '');
          }
        });
        if (row.some(cell => cell !== '')) {
          tableData.rows.push(row);
        }
      });

      if (tableData.headers.length > 0 || tableData.rows.length > 0) {
        formData.tables.push(tableData);
      }
    });
  } else {
    // 提取基本信息 - 针对 GEFPT 的表单结构
    content.querySelectorAll('.form-field').forEach(field => {
      const label = field.querySelector('.form-label')?.textContent?.replace('*', '').trim() || '';
      
      // 处理时间输入
      if (field.querySelector('.duration-input')) {
        const hours = field.querySelector('.duration-field[placeholder="Hours"]') as HTMLInputElement;
        const minutes = field.querySelector('.duration-field[placeholder="Minutes"]') as HTMLInputElement;
        const value = `${hours?.value || '0'}:${minutes?.value || '0'}`;
        formData.basicInfo.push({ label, value });
      } else {
        const input = field.querySelector('.form-input') as HTMLInputElement;
        const value = input?.value || '';
        formData.basicInfo.push({ label, value });
      }
    });

    // 提取表格数据 - 针对 GEFPT 的表格结构
    content.querySelectorAll('.form-table').forEach(table => {
      const tableData: TableData = {
        headers: [],
        rows: []
      };

      // 提取表头
      const headerRow = table.querySelector('.form-table-header');
      if (headerRow) {
        headerRow.querySelectorAll('.form-table-header-cell').forEach(th => {
          tableData.headers.push(th.textContent?.trim() || '');
        });
      }

      // 提取行数据
      table.querySelectorAll('tbody tr').forEach(tr => {
        const row: string[] = [];
        
        // 处理单元格
        tr.querySelectorAll('td').forEach(td => {
          // 检查单选框
          const radios = td.querySelectorAll('input[type="radio"]');
          if (radios.length > 0) {
            const checkedRadio = Array.from(radios).find(radio => (radio as HTMLInputElement).checked);
            row.push(checkedRadio ? 'X' : '');
          } 
          // 检查复选框
          else if (td.querySelector('input[type="checkbox"]')) {
            const checkbox = td.querySelector('input[type="checkbox"]') as HTMLInputElement;
            row.push(checkbox.checked ? 'X' : '');
          }
          // 检查文本输入
          else if (td.querySelector('input[type="text"]')) {
            const input = td.querySelector('input[type="text"]') as HTMLInputElement;
            row.push(input?.value || '');
          }
          // 检查文本区域
          else if (td.querySelector('textarea')) {
            const textarea = td.querySelector('textarea') as HTMLTextAreaElement;
            row.push(textarea?.value || '');
          }
          // 普通文本内容
          else {
            row.push(td.textContent?.trim() || '');
          }
        });

        if (row.some(cell => cell !== '')) {  // 只添加非空行
          tableData.rows.push(row);
        }
      });

      if (tableData.headers.length > 0 || tableData.rows.length > 0) {
        formData.tables.push(tableData);
      }
    });
  }

  return formData;
} 