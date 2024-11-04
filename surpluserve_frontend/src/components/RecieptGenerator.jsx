import { jsPDF } from 'jspdf';
import { formatDate } from '../utils'; // You'll need to create this utility function

export class ReceiptGenerator {
  constructor(donation, receipt) {
    this.donation = donation;
    this.receipt = receipt;
    this.doc = new jsPDF();
  }

  async generateReceipt() {
    try {
      // Set document properties
      this.doc.setProperties({
        title: `Donation Receipt - ${this.receipt.receiptId}`,
        subject: 'Food Donation Receipt',
        creator: 'Your Organization Name'
      });

      // Add header
      this.addHeader();
      
      // Add receipt details
      this.addReceiptDetails();
      
      // Add donation details
      this.addDonationDetails();
      
      // Add QR code if exists
      if (this.receipt.qrCode) {
        await this.addQRCode();
      }
      
      // Add footer
      this.addFooter();
      
      return this.doc;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw new Error('Failed to generate receipt PDF');
    }
  }

  addHeader() {
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Donation Receipt', 105, 20, { align: 'center' });
    
    // Add organization logo or name
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Your Organization Name', 105, 30, { align: 'center' });
  }

  addReceiptDetails() {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Receipt Details', 20, 45);
    
    this.doc.setFont('helvetica', 'normal');
    const details = [
      `Receipt ID: ${this.receipt.receiptId}`,
      `Date: ${formatDate(this.receipt.date)}`,
      `Donor: ${this.receipt.donor}`,
      `Recipient: ${this.receipt.recipient}`
    ];
    
    let yPos = 55;
    details.forEach(detail => {
      this.doc.text(detail, 20, yPos);
      yPos += 10;
    });
  }

  addDonationDetails() {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Donation Details', 20, 95);
    
    this.doc.setFont('helvetica', 'normal');
    const details = [
      `Food Type: ${this.donation.foodType}`,
      `Quantity: ${this.donation.quantity} servings`,
      `Pickup Location: ${this.donation.pickupLocation}`,
      `Created Date: ${formatDate(this.donation.createdAt)}`
    ];
    
    let yPos = 105;
    details.forEach(detail => {
      this.doc.text(detail, 20, yPos);
      yPos += 10;
    });
  }

  async addQRCode() {
    // Convert base64 QR code to image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = this.receipt.qrCode;
      img.onload = () => {
        try {
          // Add QR code title
          this.doc.setFont('helvetica', 'bold');
          this.doc.text('Pickup QR Code', 20, 145);
          
          // Add QR code image
          this.doc.addImage(
            img,
            'PNG',
            20,
            150,
            50,
            50
          );
          
          // Add QR code instructions
          this.doc.setFont('helvetica', 'normal');
          this.doc.setFontSize(10);
          this.doc.text(
            'Please present this QR code when picking up your donation',
            20,
            215
          );
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
    });
  }

  addFooter() {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'italic');
    const text = 'This receipt is automatically generated and is valid without signature.';
    this.doc.text(text, 105, 285, { align: 'center' });
  }
}