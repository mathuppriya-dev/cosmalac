import { Request, Response } from 'express';
import { dbService } from '../services/dbService';

export const submitInquiry = async (req: Request, res: Response) => {
  try {
    const newInquiry = await dbService.createInquiry(req.body);
    
    // Log inquiry submission (simulate email alert to management)
    console.log(`✉️  New Inquiry Received from ${req.body.name} (${req.body.type}): ${req.body.message.substring(0, 50)}...`);
    
    res.status(201).json({
      message: 'Inquiry submitted successfully. Our team will contact you shortly.',
      inquiry: newInquiry
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting inquiry', error: error.message });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await dbService.getInquiries();
    res.json(inquiries);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving inquiries', error: error.message });
  }
};

export const updateInquiry = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const updated = await dbService.updateInquiryStatus(id, status, notes);
    if (!updated) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating inquiry', error: error.message });
  }
};
