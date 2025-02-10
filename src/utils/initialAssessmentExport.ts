import { jsPDF } from 'jspdf';

interface ExportToPDFOptions {
  title: string;
  logoSrc: string;
  contentId: string;
  filename: string;
}

export const exportInitialAssessment = async (options: ExportToPDFOptions): Promise<void> => {
  const { title, logoSrc, contentId, filename } = options;
  const content = document.getElementById(contentId);
  
  if (!content) return;

  const pdf = new jsPDF({
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.width;
  const margin = 40;
  let yPosition = margin;

  // 添加标题
  pdf.setFontSize(24);
  pdf.text(title, margin, yPosition);
  yPosition += 50;

  // 等待 logo 加载完成
  try {
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          pdf.addImage(img, 'PNG', pageWidth - 100, margin, 60, 60);
          resolve(null);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = logoSrc;
    });
  } catch (error) {
    console.warn('Logo loading failed:', error);
  }

  // 设置正文字体和大小
  pdf.setFontSize(12);

  // 获取所有表单组
  const formGroups = content.querySelectorAll('.formGroup, .form-group');
  formGroups.forEach((group) => {
    const label = group.querySelector('label')?.textContent?.replace('*', '').trim();
    if (!label) return;

    // 检查是否需要新页面
    if (yPosition > pdf.internal.pageSize.height - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    // 添加标签
    pdf.setFont("helvetica", "bold");
    pdf.text(label, margin, yPosition);
    yPosition += 20;

    // 获取输入值
    const input = group.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;
    if (input) {
      pdf.setFont("helvetica", "normal");
      let value = '';

      if (input instanceof HTMLInputElement) {
        if (input.type === 'checkbox') {
          value = input.checked ? 'Yes' : 'No';
        } else if (input.type === 'radio') {
          const checkedRadio = group.querySelector('input[type="radio"]:checked') as HTMLInputElement;
          value = checkedRadio ? checkedRadio.value : '';
        } else {
          value = input.value || '';
        }
      } else {
        value = input.value || '';
      }

      // 处理长文本
      if (value.length > 60 || input instanceof HTMLTextAreaElement) {
        const maxWidth = pageWidth - (margin * 2);
        const lines = pdf.splitTextToSize(value, maxWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 15 + 20;
      } else {
        pdf.text(value, margin + 10, yPosition);
        yPosition += 30;
      }
    }

    // 处理设备选择部分
    const deviceInputs = group.querySelectorAll('input[type="checkbox"]');
    if (deviceInputs.length > 0) {
      deviceInputs.forEach((deviceInput: Element) => {
        const input = deviceInput as HTMLInputElement;
        const deviceLabel = input.parentElement?.textContent?.trim() || '';
        if (deviceLabel && input.checked) {
          yPosition += 20;
          pdf.text(`- ${deviceLabel}`, margin + 20, yPosition);
        }
      });
      yPosition += 20;
    }
  });

  // 处理 AT Used 部分
  const atSection = content.querySelector('#at-used-section');
  if (atSection) {
    yPosition += 20;
    pdf.setFont("helvetica", "bold");
    pdf.text("AT Used (Consider Model, Experience)", margin, yPosition);
    yPosition += 20;

    const devices = [
      { selector: '#tablet', label: 'Tablet' },
      { selector: '#computer', label: 'Computer' },
      { selector: '#gaming-consoles', label: 'Gaming Consoles' }
    ];

    devices.forEach(device => {
      const input = atSection.querySelector(device.selector) as HTMLInputElement;
      if (input?.checked) {
        pdf.setFont("helvetica", "normal");
        pdf.text(`- ${device.label}`, margin + 20, yPosition);
        yPosition += 20;
      }
    });

    // 处理 Other Devices
    const otherDevices = atSection.querySelector('#other-devices') as HTMLTextAreaElement;
    if (otherDevices?.value) {
      pdf.text('Other Devices:', margin + 20, yPosition);
      yPosition += 20;
      const lines = pdf.splitTextToSize(otherDevices.value, pageWidth - (margin * 3));
      pdf.text(lines, margin + 40, yPosition);
      yPosition += lines.length * 15 + 20;
    }
  }

  // 处理 Access Methods 部分
  const accessSection = content.querySelector('#access-methods-section');
  if (accessSection) {
    yPosition += 20;
    pdf.setFont("helvetica", "bold");
    pdf.text("Access Methods", margin, yPosition);
    yPosition += 20;

    const methods = [
      { selector: '#physical-access', label: 'Physical Access' },
      { selector: '#voice-control', label: 'Voice Control' },
      { selector: '#sip-and-puff', label: 'Sip-And-Puff Systems' },
      { selector: '#eye-gaze', label: 'Eye Gaze' }
    ];

    methods.forEach(method => {
      const input = accessSection.querySelector(method.selector) as HTMLInputElement;
      if (input?.checked) {
        pdf.setFont("helvetica", "normal");
        pdf.text(`- ${method.label}`, margin + 20, yPosition);
        yPosition += 20;
      }
    });
  }

  // 保存 PDF
  pdf.save(filename);
}; 