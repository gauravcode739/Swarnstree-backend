import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();

const cleanHTML = (str) => {
  if (!str) return '';
  // Replace <br> and </p> with a space or newline so words don't stick together
  let cleaned = str.replace(/<\/?(p|br|div)[^>]*>/gi, '\n');
  // Remove all other HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  // Decode HTML entities like &nbsp; &amp;
  cleaned = cleaned.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  // Clean up extra newlines and spaces
  cleaned = cleaned.replace(/\n\s*\n/g, '\n').trim();
  return cleaned;
};

const fixDescriptions = async () => {
  try {
    await connectDB();
    console.log('Database Connected.');

    const products = await Product.find({});
    let count = 0;
    
    for (let p of products) {
      const cleaned = cleanHTML(p.description);
      if (cleaned !== p.description) {
        p.description = cleaned;
        await p.save();
        console.log(`Cleaned description for: ${p.name}`);
        count++;
      }
    }
    console.log(`Fixed ${count} product descriptions.`);
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixDescriptions();
